/* ============================================================
   HANIF ABDULLAH — SITE CONTENT
   All copy, news, timeline, results and partner data lives here
   so the client can update the website without touching layout.
   ============================================================ */

export const BRAND = {
  name: 'HANIF ABDULLAH',
  firstName: 'Hanif',
  tagline: 'Hit with Heart. Ace Your Dreams.',
  phrase: 'Hope Always',
  sport: 'Junior Tennis Athlete',
  hashtag: '#TEAMHANIF',
  closingLine: 'Every champion begins as a learner. This is Hanif’s journey.',
  altClosingLine: 'Every great journey begins with a single step. This is Hanif’s.',
  email: 'hello@hanifabdullah.com',       // TODO: replace with the official address
  socials: [
    { label: 'Instagram', href: '#', icon: 'instagram' },
    { label: 'YouTube', href: '#', icon: 'youtube' },
    { label: 'Facebook', href: '#', icon: 'facebook' }
  ]
}

export const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'journey', label: 'Journey' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'results', label: 'Results' },
  { id: 'partners', label: 'Partners' },
  { id: 'contact', label: 'Contact' }
]

export const VALUES = ['Professional', 'Respectful', 'Humble', 'Hard-working']

export const HOME = {
  heroKicker: 'Junior Tennis Athlete',
  heroPhoto: {
    src: '/poster2.jpg',            // replace with a clean action photo (black / white / burgundy treatment is applied automatically)
    alt: 'Hanif Abdullah on court',
    position: '50% 20%',            // which part of the photo to keep in view
    kicker: 'The moments that matter',
    lines: [
      'First day at a new academy.',
      'Practising in the rain.',
      'Respecting opponents.',
      'Congratulating the winner after a defeat.'
    ]
  },
  intro: {
    label: 'Introduction',
    heading: 'A young player.\nA long road.\nA lot of heart.',
    body: [
      'Hanif Abdullah is a junior tennis player at the very beginning of his journey. This website is the honest record of that journey — the training days, the tournaments, the lessons learned in wins and in losses.',
      'It is written for the people who support him, the coaches who guide him, and the young players who might one day be inspired to pick up a racket and take their own first step.'
    ]
  },
  news: [
    {
      date: 'Latest',
      tag: 'Training',
      title: 'First day at a new academy',
      excerpt: 'New courts, new coaches, new drills — and a lot to learn. Hanif spent the morning on footwork and the afternoon listening.'
    },
    {
      date: 'Recent',
      tag: 'Competition',
      title: 'Congratulating the winner',
      excerpt: 'A tough match and a close loss. The handshake at the net mattered more than the scoreline, and the lesson from the second set will not be forgotten.'
    },
    {
      date: 'Recent',
      tag: 'Community',
      title: 'Thanking the volunteers',
      excerpt: 'Tournaments only happen because people give their weekends. Hanif stayed back to help pack the courts and say thank you.'
    }
  ]
}

export const ABOUT = {
  story: {
    label: "Hanif's Story",
    heading: 'It started with\na single step.',
    paragraphs: [
      'Hanif picked up his first racket as a small boy who simply loved to hit a ball against a wall. The wall never got tired, and neither did he.',
      'What began as play slowly became practice. Early mornings, patient coaches, and thousands of repetitions turned enthusiasm into technique — and technique into a quiet, growing belief.',
      'Today Hanif trains with the same joy he had on day one, with a clearer sense of where he wants to go and a deep respect for everyone who helps him get there.'
    ]
  },
  goals: {
    label: 'Goals',
    heading: 'What he is working towards',
    items: [
      { title: 'Master the fundamentals', text: 'Clean technique, balanced footwork and a reliable serve — the foundation every other goal stands on.' },
      { title: 'Compete with courage', text: 'Enter tournaments at home and abroad, play the big points bravely and learn from every result.' },
      { title: 'Grow as a person', text: 'Respect opponents, thank volunteers, help younger players and carry himself the same way in victory and defeat.' },
      { title: 'Earn the next level', text: 'Progress step by step through the junior pathway towards national and international competition.' }
    ]
  },
  vision: {
    label: 'Vision',
    heading: 'More than medals',
    quote: 'Years from now, when Hanif looks back, we hope he doesn’t just see medals. We hope he sees a record of how he grew into a respectful, resilient and humble person.',
    body: 'Our hope is that this journey will inspire young people to embrace challenges, enjoy the process of learning and pursue their dreams with dedication and good sportsmanship.'
  }
}

export const JOURNEY = {
  label: 'Timeline',
  heading: 'The road so far',
  intro: 'Every chapter of the journey, told honestly — the first steps, the first defeats, the first flights abroad and the milestones still ahead.',
  milestones: [
    {
      id: 'started',
      chapter: '01',
      title: 'Started tennis',
      location: 'Home courts',
      text: 'The first racket, the first rally and the first taste of a sport that would become a way of life.',
      status: 'done'
    },
    {
      id: 'first-tournament',
      chapter: '02',
      title: 'First tournament',
      location: 'Local junior event',
      text: 'Nerves, a proper draw sheet and a first competitive match. The result mattered less than the experience of walking on court alone.',
      status: 'done'
    },
    {
      id: 'spain',
      chapter: '03',
      title: 'Spain',
      location: 'Training camp',
      text: 'Clay courts, long rallies and a new way of thinking about patience and point construction.',
      status: 'done'
    },
    {
      id: 'thailand',
      chapter: '04',
      title: 'Thailand',
      location: 'International experience',
      text: 'Competing and training alongside players from across Asia — different styles, different climates, the same love of the game.',
      status: 'done'
    },
    {
      id: 'future',
      chapter: '05',
      title: 'Future milestones',
      location: 'The road ahead',
      text: 'National junior events, international junior tours and, one day, a ranking beside his name. One step at a time.',
      status: 'next'
    }
  ]
}

export const GALLERY = {
  label: 'Gallery',
  heading: 'Moments that\nreveal character',
  intro: 'Not just the trophies. The rain sessions, the coaches, the handshakes and the smiles after a hard lesson.',
  photos: [
    { src: '/poster1.jpg', alt: 'Hanif Abdullah training montage', caption: 'The court is my stage' },
    { src: '/poster2.jpg', alt: 'Hanif Abdullah backhand', caption: 'Focus. Drive. Win. Repeat.' },
    { src: '', alt: 'Practising in the rain', caption: 'Practising in the rain' },
    { src: '', alt: 'Learning a new technique', caption: 'Learning a new technique' },
    { src: '', alt: 'Meeting inspiring coaches', caption: 'Meeting inspiring coaches' },
    { src: '', alt: 'Respecting opponents', caption: 'Respecting opponents' }
  ],
  videos: [
    { title: 'Training highlights', duration: 'Coming soon', embed: '' },
    { title: 'Match point moments', duration: 'Coming soon', embed: '' },
    { title: 'A day at the academy', duration: 'Coming soon', embed: '' }
  ]
}

export const RESULTS = {
  label: 'Results',
  heading: 'The real story,\nwin or lose',
  intro: 'Every result is recorded here — the wins and the losses — because both are part of the journey.',
  note: 'Sample entries shown for layout. Official results will be updated after each tournament.',
  history: [
    { event: 'Junior Open — Under 10', location: 'Local', surface: 'Hard', result: 'Quarter-final', outcome: 'Learned to close out a set' },
    { event: 'Academy Championship', location: 'Home academy', surface: 'Hard', result: 'Runner-up', outcome: 'First final' },
    { event: 'International Junior Camp Event', location: 'Spain', surface: 'Clay', result: 'Round of 16', outcome: 'First clay-court matches' },
    { event: 'Asian Junior Invitational', location: 'Thailand', surface: 'Hard', result: 'Semi-final', outcome: 'First international semi-final' }
  ],
  titles: [
    { title: 'Titles', value: '—', note: 'Updated as they come' },
    { title: 'Finals', value: '—', note: 'Updated as they come' },
    { title: 'Matches played', value: '—', note: 'Every one a lesson' }
  ],
  rankings: {
    heading: 'Rankings',
    text: 'Rankings will be published here once Hanif enters ranked competition. Until then, the focus is on development, not numbers.'
  }
}

export const PARTNERS = {
  label: 'Partners',
  heading: 'Grow with Hanif',
  intro: 'Junior tennis is a long-term investment in a young person. We are looking for partners who share that patience and those values.',
  sponsors: {
    heading: 'Future sponsors',
    text: 'Sponsorship supports coaching, travel to tournaments, equipment and academy fees. Partners receive honest storytelling, brand-consistent imagery and a young athlete who represents them with respect.',
    cta: 'Discuss sponsorship'
  },
  equipment: {
    heading: 'Equipment',
    items: [
      { name: 'Rackets', text: 'Junior-weight frames sized for his current stage of growth.' },
      { name: 'Footwear', text: 'Hard-court and clay-court shoes for training and travel.' },
      { name: 'Apparel', text: 'Black, white and burgundy — consistent with the brand.' }
    ]
  },
  academies: {
    heading: 'Academies',
    text: 'Hanif trains with academies and coaches who value technique, discipline and character equally. Academy partnerships and training invitations are always welcome.',
    cta: 'Academy enquiries'
  }
}

export const CONTACT = {
  label: 'Contact',
  heading: 'Get in touch',
  intro: 'For sponsorship, media requests or academy invitations, please use the channels below. Every message is read and answered.',
  channels: [
    { id: 'sponsorship', title: 'Sponsorship', text: 'Partnership proposals, brand collaborations and long-term support.', email: 'sponsorship@hanifabdullah.com' },
    { id: 'media', title: 'Media', text: 'Interviews, features, photography and press enquiries.', email: 'media@hanifabdullah.com' },
    { id: 'academies', title: 'Academies', text: 'Training invitations, camps and academy partnerships.', email: 'academies@hanifabdullah.com' }
  ]
}
