// Product portfolio. Statuses must reflect real evidence:
//   development: actively being built, not publicly available
//   concept:     idea and planning stage, no product to use
// Change a status only when development or release evidence supports it.

export const STATUS = {
  development: { label: 'In development', tone: 'dev', note: 'Being built. Not yet publicly available.' },
  concept: { label: 'Concept', tone: 'concept', note: 'Planning stage. Not available to use.' },
  planned: { label: 'Planned', tone: 'concept', note: 'Planned for future development.' },
  internal: { label: 'Internal tool', tone: 'internal', note: 'Used inside Avaru. Not offered to the public.' },
};

export const products = [
  {
    id: 'adlease',
    name: 'AdLease',
    icon: 'smartphone',
    status: 'development',
    category: 'Device access · Advertising',
    tagline: 'Working toward smartphone ownership',
    summary:
      'An advertising-supported, instalment-based phone ownership concept, designed to help people work toward owning a smartphone.',
    detail: [
      'AdLease is our highest-priority product. It explores a model where advertising and flexible instalments together help people work toward owning a smartphone.',
      'An Android app is in development. AdLease is not yet available on Google Play or any other app store, and it is not offering devices or financing to the public.',
    ],
  },
  {
    id: 'zubari',
    name: 'Zubari',
    icon: 'bus',
    status: 'concept',
    category: 'Transport',
    tagline: 'Simpler transport booking',
    summary: 'A transport booking platform concept, aimed at making it easier to find and book transport.',
    detail: [
      'Zubari is a concept for a transport booking platform. We are exploring how booking everyday transport could be made simpler and more reliable.',
      'Zubari is at the planning stage. There is no app or booking service available.',
    ],
  },
  {
    id: 'aerovault',
    name: 'AeroVault',
    icon: 'plane',
    status: 'concept',
    category: 'Aviation education',
    tagline: 'Smarter aviation learning',
    summary:
      'An aviation education and learning platform concept, aimed at making aviation and aeronautical learning resources more accessible.',
    detail: [
      'AeroVault is a concept for a digital learning platform that brings aviation and aeronautical engineering learning resources together in one accessible place.',
      'AeroVault is at the planning stage. No courses or learning materials are offered yet.',
    ],
  },
  {
    id: 'autoear',
    name: 'AutoEar',
    icon: 'activity',
    status: 'concept',
    category: 'AI · Automotive',
    tagline: 'AI-assisted vehicle diagnostics',
    summary: 'An AI-assisted vehicle diagnostics concept, exploring how AI could help identify vehicle problems earlier.',
    detail: [
      'AutoEar is a concept that explores how AI could assist with diagnosing vehicle problems, helping drivers and mechanics understand issues sooner.',
      'AutoEar is at the planning stage. It is not a working diagnostic tool and should not be relied on for any vehicle decision.',
    ],
  },
  {
    id: 'the-haven',
    name: 'The Haven',
    icon: 'home',
    status: 'concept',
    category: 'Diaspora · Projects',
    tagline: 'Connecting the diaspora with projects at home',
    summary:
      'A diaspora-focused concept for Kenyan projects and investment, exploring how Kenyans abroad could take part in projects at home.',
    detail: [
      'The Haven is a concept exploring how Kenyans living abroad could discover and take part in projects and investment opportunities in Kenya.',
      'The Haven is at the planning stage. It does not offer, accept or manage any investment, and nothing on this website is an offer of securities or financial advice.',
    ],
  },
];

export const platforms = [
  {
    id: 'avaru-core',
    name: 'Avaru Core',
    icon: 'layers',
    status: 'internal',
    summary: 'Our internal founder and management hub, used to run and coordinate work across Avaru. It is not a public product.',
  },
  {
    id: 'avaru-nexus',
    name: 'Avaru Nexus',
    icon: 'cpu',
    status: 'planned',
    summary: 'A planned AI management layer intended to sit on top of Avaru Core. It has not been built yet.',
  },
];
