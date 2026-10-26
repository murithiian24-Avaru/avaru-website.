// Loaded in <head>, before first paint: marks the page as JavaScript-enabled so the
// mobile header renders collapsed straight away instead of shifting the page when
// main.js (deferred) runs. Safety net: if main.js never sets up the menu, the class
// is removed again so the no-JavaScript menu stays reachable.
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  window.addEventListener('load', function () {
    if (!root.hasAttribute('data-nav-ready')) root.classList.remove('js');
  });
})();
