#!/usr/bin/env python3
"""Derive the standalone Avaru "A" mark from the official logo master.

The mark is EXTRACTED, never drawn. The script crops the "A" from the master and
makes everything that is not the white artwork transparent. It does not trace,
redraw, resize, reshape or recolour the artwork. The result does NOT reproduce
every pixel of the master: by approved decision, the master's near-black keyline
and the faint glow around the artwork are left out. See "Endorsement mark" in
README.md for the decisions, results and limitations.

Usage (from the repository root; needs Python 3 with Pillow and NumPy):
    python3 scripts/brand/derive-mark.py           # extract, save, then verify the saved file
    python3 scripts/brand/derive-mark.py --check   # verify only; also fail if the committed
                                                   # file differs from a fresh extraction

What the master contains around the "A" (measured from the file itself)
- White artwork, about RGB(255,255,249).
- Navy background, about RGB(16,25,35), with very little noise.
- A near-black keyline, about RGB(0,0,0), 1-2 px wide, around the artwork edges
  (broken in places, where the white meets the navy directly).
- A faint glow: navy slightly brighter than elsewhere, just outside the keyline.

Extraction
1. Refuse to run unless the master's full SHA-256 matches the approved fingerprint.
2. Measure the navy, white and keyline colours and the background noise.
3. Find the "A": the first block of artwork rows, separated from the wordmark by
   an empty band.
4. "Possible artwork" = pixels bright enough to be at least 50% white whether
   their dark part is navy or keyline. Only these pixels and the pixels directly
   touching them (8 neighbours) may keep any opacity. Everything else - the
   keyline, the glow and the background - becomes transparent.
5. Opacity of an edge pixel, from its brightness L:
     navy reading    = (L - navy) / (white - navy)
     keyline reading =  L         / white
   A pixel touching a keyline pixel uses the keyline reading; others the navy
   reading. Pixels within 4x the background noise of navy, or darker, become
   transparent. Pixels more than 2 px inside the artwork are fully opaque.
6. Every pixel's colour is the master's measured white; only opacity varies.
7. Crop to the visible pixels plus a 2 px transparent margin.

Extraction checks (fail = stop, nothing is written)
A.  Master fingerprint matches.
B1. The mark's 50% outline equals the master's resolved 50% white outline.
B2. Pixels touching both keyline and navy ("evidence both ways") must not exceed
    AMBIGUOUS_LIMIT of the outline. They are listed with positions.
C1. Every kept edge pixel's opacity equals its reading (within rounding) and lies
    between the navy and keyline readings.
C2. Every fully opaque pixel is at least 95% white in the master.
C3. Dropped pixels outside the keyline (within 2 px of it) hold at most 11% white.
C4. All other dropped background holds at most 5% white.
D.  Inside the artwork, the mark on navy matches the master within 24/255.

Independent verification (reads the SAVED PNG and the master only; uses none of
the extraction's readings or classifications)
V1. Master fingerprint matches.
V2. The PNG is found in the master at the reported position, by search.
V3. Every master pixel that is at least 50% white under any reading is >= 50%
    opaque in the PNG; every master pixel below 50% under any reading is < 50%.
    Pixels between the two are counted and listed.
V4. No retained pixel lies outside the keyline: every pixel with any opacity
    touches a master pixel that could be 50% white, and none is itself keyline.
V5. No ghost rim: no faint pixel (under 25% opacity) is detached from the solid
    artwork.
V6. Opaque pixels match the master's colour within 24/255.
V7. Reported: differences from the master on navy, by artwork, edge and removed.
"""
import hashlib
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
MASTER = ROOT / "public/brand/avaru-logo-official.png"
OUTPUT = ROOT / "public/brand/avaru-mark-white.png"
MASTER_SHA256 = "9031557c5f24f9a9b58d49cff211357a28143b589d70ca2b2b619d7d0a31ab47"
NEAR_PX, INSIDE_PX, MARGIN_PX = 3, 2, 2
KEYLINE_MAX = 13      # brightness at or below this is keyline (keyline ~2, navy ~25)
COLOUR_LIMIT = 24     # D and V6, per channel out of 255
OPAQUE_MIN = 0.95     # C2
BG_MAX = 0.05         # C4, unchanged
# C3, approved exception (founder, 28 Oct 2026): pixels outside the keyline are
# background, but the master's faint glow there reads as up to ~11% white if
# interpreted as navy + white. Applies only to pixels within 2 px of the keyline.
OUTSIDE_KEYLINE_MAX = 0.11
# B2, approved exception (founder, 28 Oct 2026); originally 0.5%. Isolated pixels
# where the keyline is broken touch both keyline and navy.
AMBIGUOUS_LIMIT = 0.015


def fail(msg):
    print(f"FAILED: {msg}")
    sys.exit(1)


def grow(mask, r):
    """Pixels within r px (square neighbourhood) of any True pixel."""
    out = mask.copy()
    p = np.pad(mask, r)
    h, w = mask.shape
    for dy in range(-r, r + 1):
        for dx in range(-r, r + 1):
            out |= p[r + dy : r + dy + h, r + dx : r + dx + w]
    return out


def outline_edge(mask):
    """Pixels of mask that touch a pixel outside it (4-neighbourhood)."""
    p = np.pad(mask, 1, constant_values=False)
    inner = p[:-2, 1:-1] & p[2:, 1:-1] & p[1:-1, :-2] & p[1:-1, 2:]
    return mask & ~inner


def master_stats():
    digest = hashlib.sha256(MASTER.read_bytes()).hexdigest()
    rgb = np.asarray(Image.open(MASTER).convert("RGB")).astype(np.float64)
    lum = rgb.mean(axis=2)
    band = rgb[:200].reshape(-1, 3)                       # top band: empty background
    return {
        "digest": digest, "rgb": rgb, "lum": lum,
        "navy": np.median(band, axis=0),
        "ln": band.mean(axis=1).mean(), "noise": band.mean(axis=1).std(),
        "white": np.median(rgb[lum > 245], axis=0),
        "keyline": np.median(rgb[lum <= KEYLINE_MAX], axis=0),
    }


def extract():
    m = master_stats()
    if m["digest"] != MASTER_SHA256:
        fail(f"A. master fingerprint is {m['digest']}, expected {MASTER_SHA256}")
    rgb, lum, ln, noise = m["rgb"], m["lum"], m["ln"], m["noise"]
    lw = m["white"].mean()
    floor = ln + 4 * noise

    rows = np.where((lum > (ln + lw) / 2).any(axis=1))[0]
    breaks = np.where(np.diff(rows) > 1)[0]
    if len(breaks) == 0:
        fail("could not separate the A mark from the wordmark")
    top, bottom, next_top = rows[0], rows[breaks[0]], rows[breaks[0] + 1]
    if next_top - bottom < 2 * (NEAR_PX + MARGIN_PX) + 10:
        fail("gap between the A mark and the wordmark is too small for a clean crop")
    cols = np.where((lum[top : bottom + 1] > (ln + lw) / 2).any(axis=0))[0]
    y0, y1 = top - NEAR_PX - 1, bottom + NEAR_PX + 2
    x0, x1 = cols[0] - NEAR_PX - 1, cols[-1] + NEAR_PX + 2

    L, region = lum[y0:y1, x0:x1], rgb[y0:y1, x0:x1]
    lo = np.clip((L - ln) / (lw - ln), 0, 1)              # navy reading
    hi = np.clip(L / lw, 0, 1)                            # keyline reading
    sure_in, sure_out = lo >= 0.5, hi < 0.5
    possible = ~sure_out                                  # could be >= 50% white
    may_keep = grow(possible, 1)                          # artwork + pixels touching it
    deep = ~grow(~sure_in, INSIDE_PX)
    is_keyline = L <= KEYLINE_MAX
    keyline_reading = grow(is_keyline, 1)

    alpha = np.where(keyline_reading, hi, lo)
    alpha[L <= floor] = 0.0
    alpha[~may_keep] = 0.0
    alpha[deep] = 1.0

    ys, xs = np.where(alpha > 0)
    cy0, cy1 = max(ys.min() - MARGIN_PX, 0), ys.max() + MARGIN_PX + 1
    cx0, cx1 = max(xs.min() - MARGIN_PX, 0), xs.max() + MARGIN_PX + 1
    sl = (slice(cy0, cy1), slice(cx0, cx1))
    (alpha, L, region, lo, hi, sure_in, sure_out, possible, may_keep, deep,
     is_keyline, keyline_reading) = (v[sl] for v in (alpha, L, region, lo, hi, sure_in, sure_out,
                                                     possible, may_keep, deep, is_keyline, keyline_reading))
    ox, oy = x0 + cx0, y0 + cy0

    a8 = np.round(alpha * 255).astype(np.uint8)
    colour = np.round(m["white"]).astype(np.uint8)
    rgba = np.dstack([np.broadcast_to(colour, a8.shape + (3,)), a8])

    # ---- extraction checks ----
    a = a8.astype(np.float64) / 255
    resolved = np.where(keyline_reading, hi, lo)
    out_in, master_in = a8 >= 128, resolved >= 0.5
    ambiguous = ~sure_in & ~sure_out
    navy_like = (L > KEYLINE_MAX) & (L < ln + 15)
    both_ways = ambiguous & keyline_reading & grow(navy_like, 1)
    by, bx = np.where(both_ways)
    both_xy = sorted(zip((bx + ox).tolist(), (by + oy).tolist()))
    both_gap = float(((hi - lo)[both_ways]).max() * 255) if both_ways.any() else 0.0
    outline_len = outline_edge(master_in).sum()
    shape_errors = int((out_in != master_in).sum())
    both_share = both_ways.sum() / max(outline_len, 1)

    tol = 1 / 255 + 4 * noise / (lw - ln)
    band = may_keep & ~deep & (L > floor)
    band_errors = int((band & ((np.abs(a - resolved) > 1 / 255 + 1e-9)
                               | (a < lo - tol) | (a > hi + tol))).sum())
    deep_min = float(lo[deep].min())
    dropped = ~may_keep
    outside_kl = dropped & grow(is_keyline, 2)
    other_bg = dropped & ~outside_kl
    max_outside = float(lo[outside_kl].max()) if outside_kl.any() else 0.0
    max_other = float(lo[other_bg].max()) if other_bg.any() else 0.0
    dark_dropped = may_keep & ~deep & (L <= floor)
    max_dark = float(hi[dark_dropped].max()) if dark_dropped.any() else 0.0
    recomposed = a[..., None] * colour + (1 - a[..., None]) * m["navy"]
    diff = np.abs(recomposed - region).max(axis=2)

    report = {
        "A  master_sha256": m["digest"],
        "   measured navy/white/keyline": "#%02x%02x%02x / #%02x%02x%02x / #%02x%02x%02x" % (
            *np.round(m["navy"]).astype(int), *colour, *np.round(m["keyline"]).astype(int)),
        "   background noise (lum)": round(float(noise), 2),
        "   crop in master": f"x {ox}-{ox + a8.shape[1] - 1}, y {oy}-{oy + a8.shape[0] - 1} ({a8.shape[1]}x{a8.shape[0]})",
        "B1 outline px differing": f"{shape_errors} of {int(out_in.sum())} artwork px",
        "B2 evidence-both-ways px": f"{int(both_ways.sum())} ({both_share * 100:.2f}% of outline, limit "
                                    f"{AMBIGUOUS_LIMIT * 100:.1f}%), read as keyline, max uncertainty {both_gap:.0f}/255",
        "B2 positions (x,y in master)": " ".join(f"({x},{y})" for x, y in both_xy),
        "C1 edge px off reading": f"{band_errors} of {int(band.sum())}",
        "C2 opaque px min white": f"{deep_min * 100:.1f}% (limit {OPAQUE_MIN * 100:.0f}%)",
        "C3 outside-keyline max white": f"{max_outside * 100:.1f}% (limit {OUTSIDE_KEYLINE_MAX * 100:.0f}%, "
                                        f"{int(outside_kl.sum())} px)",
        "C4 other background max white": f"{max_other * 100:.1f}% (limit {BG_MAX * 100:.0f}%)",
        "   dark edge px dropped": f"{int(dark_dropped.sum())}, up to {max_dark * 100:.1f}% white (upper bound)",
        "D  artwork colour diff": f"max {diff[deep].max():.1f}, mean {diff[deep].mean():.2f} (limit {COLOUR_LIMIT})",
    }
    problems = []
    if shape_errors:
        problems.append(f"B1. {shape_errors} outline pixels differ")
    if both_share > AMBIGUOUS_LIMIT:
        problems.append("B2. too many pixels with evidence both ways")
    if band_errors:
        problems.append(f"C1. {band_errors} edge pixels off their reading")
    if deep_min < OPAQUE_MIN:
        problems.append("C2. an opaque pixel is not white in the master")
    if max_outside > OUTSIDE_KEYLINE_MAX:
        problems.append(f"C3. outside-keyline pixel with {max_outside * 100:.1f}% white")
    if max_other > BG_MAX:
        problems.append(f"C4. background pixel with {max_other * 100:.1f}% white")
    if diff[deep].max() > COLOUR_LIMIT:
        problems.append("D. artwork colour out of limit")
    return Image.fromarray(np.ascontiguousarray(rgba), "RGBA"), (ox, oy), report, problems


def verify_saved(path, expected_xy):
    """Independent check of the saved PNG against the master alone."""
    m = master_stats()
    rgba = np.asarray(Image.open(path).convert("RGBA")).astype(np.float64)
    A = rgba[..., 3] / 255
    h, w = A.shape
    lum, ln, lw = m["lum"], m["ln"], m["white"].mean()
    problems, rep = [], {}

    rep["V1 master_sha256"] = m["digest"]
    if m["digest"] != MASTER_SHA256:
        problems.append("V1. master fingerprint changed")

    # V2: locate the PNG in the master by search (alpha vs master brightness).
    ex, ey = expected_xy
    best = None
    for dy in range(-6, 7):
        for dx in range(-6, 7):
            x, y = ex + dx, ey + dy
            if x < 0 or y < 0:
                continue
            Lm = (lum[y : y + h, x : x + w] - ln) / (lw - ln)
            err = float(np.mean((np.clip(Lm, 0, 1) - A) ** 2))
            if best is None or err < best[0]:
                best = (err, x, y)
    rep["V2 found at (x,y)"] = f"({best[1]},{best[2]}), expected ({ex},{ey})"
    if (best[1], best[2]) != (ex, ey):
        problems.append("V2. PNG is not at the expected position in the master")

    L = lum[ey : ey + h, ex : ex + w]
    navy_r = np.clip((L - ln) / (lw - ln), 0, 1)
    key_r = np.clip(L / lw, 0, 1)
    must_in, must_out = navy_r >= 0.5, key_r < 0.5
    between = ~must_in & ~must_out
    v3_in = int((must_in & (A < 0.5)).sum())
    v3_out = int((must_out & (A >= 0.5)).sum())
    yy, xx = np.where(between)
    rep["V3 sure-white px not opaque"] = v3_in
    rep["V3 sure-dark px opaque"] = v3_out
    rep["V3 undecidable px (listed)"] = f"{int(between.sum())}: " + " ".join(
        f"({x + ex},{y + ey})" for y, x in zip(yy, xx))
    if v3_in or v3_out:
        problems.append("V3. outline differs from the master")

    kept = A > 0
    could_be_white = ~must_out
    outside = kept & ~grow(could_be_white, 1)
    on_keyline = kept & (L <= KEYLINE_MAX)
    rep["V4 retained px outside keyline"] = int(outside.sum())
    rep["V4 retained px on keyline"] = int(on_keyline.sum())
    if outside.any() or on_keyline.any():
        problems.append("V4. retained pixels lie outside the keyline")

    faint = kept & (A < 0.25)
    detached = faint & ~grow(A >= 0.5, 1)
    rep["V5 detached faint px (ghost rim)"] = int(detached.sum())
    if detached.any():
        problems.append("V5. ghost rim present")

    region = m["rgb"][ey : ey + h, ex : ex + w]
    opaque = A == 1
    cdiff = np.abs(rgba[..., :3] - region).max(axis=2)
    rep["V6 opaque px colour diff"] = f"max {cdiff[opaque].max():.1f}, mean {cdiff[opaque].mean():.2f} (limit {COLOUR_LIMIT})"
    if cdiff[opaque].max() > COLOUR_LIMIT:
        problems.append("V6. opaque colour out of limit")

    rec = A[..., None] * rgba[..., :3] + (1 - A[..., None]) * m["navy"]
    d = np.abs(rec - region).max(axis=2)
    edge, removed = kept & ~opaque, ~kept
    rep["V7 diff on navy: artwork"] = f"max {d[opaque].max():.1f}, mean {d[opaque].mean():.2f}"
    rep["V7 diff on navy: edge"] = f"max {d[edge].max():.1f}, mean {d[edge].mean():.2f} ({int(edge.sum())} px)"
    rep["V7 diff on navy: removed"] = (f"max {d[removed].max():.1f}, mean {d[removed].mean():.2f} "
                                       f"({int((removed & (L <= KEYLINE_MAX)).sum())} keyline px, "
                                       f"{int((removed & (L > ln + 4 * m['noise'])).sum())} glow/edge px)")
    return rep, problems


def main():
    img, xy, report, problems = extract()
    print("Extraction checks")
    for k, v in report.items():
        print(f"  {k:34} {v}")
    if problems:
        fail("; ".join(problems))
    if "--check" in sys.argv:
        if not OUTPUT.exists():
            fail(f"{OUTPUT.relative_to(ROOT)} is missing")
        if not np.array_equal(np.asarray(Image.open(OUTPUT).convert("RGBA")), np.asarray(img)):
            fail(f"{OUTPUT.relative_to(ROOT)} does not match a fresh extraction")
        print("  OK: committed file matches a fresh extraction pixel for pixel")
    else:
        img.save(OUTPUT, optimize=True)
        print(f"  wrote {OUTPUT.relative_to(ROOT)}")
    rep, vproblems = verify_saved(OUTPUT, xy)
    print("Independent verification of the saved file against the master")
    for k, v in rep.items():
        print(f"  {k:34} {v}")
    if vproblems:
        fail("; ".join(vproblems))
    print("OK: all checks passed (the keyline and glow are intentionally not reproduced)")


if __name__ == "__main__":
    main()
