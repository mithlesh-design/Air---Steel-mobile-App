export type ArticleData = {
  id: string;
  tag: string;
  section: string;
  title: string;
  subtitle: string;
  briefing: string;
  location: string;
  img: string;
};

export const ARTICLES: ArticleData[] = [
  {
    id: 'night-runners',
    tag: 'Article',
    section: 'Nightside',
    title: 'Night Runners',
    subtitle: 'Where the city sleeps and the machines wake.',
    location: 'Tokyo',
    briefing:
      'After midnight, the elevated expressways of Tokyo become something else entirely. The toll gates thin out, the neon bleeds into wet asphalt, and a loose fraternity of drivers emerges — not for racing, but for the ritual of movement.',
    img: 'https://images.unsplash.com/photo-1598082630518-ad3583b480ad?w=800&q=80',
  },
  {
    id: 'analogue',
    tag: 'Article',
    section: 'Feature',
    title: 'Analogue',
    subtitle: 'Restoring pre-digital machines in a world saturated with screens.',
    location: 'Los Angeles',
    briefing:
      'In a converted warehouse off South Alameda, a small team works without computers. Every restoration is performed by hand — carburetor jets cleaned with wire, timing set by ear, bodywork guided by touch.',
    img: 'https://images.unsplash.com/photo-1594051164364-8753eac89b0b?w=800&q=80',
  },
  {
    id: 'the-silent-mile',
    tag: 'Article',
    section: 'Cover Story',
    title: 'The Silent Mile',
    subtitle: 'A test track no map shows and few have seen.',
    location: 'Geneva',
    briefing:
      'The road climbs past the tree line and then simply continues — unmarked, immaculate, and entirely private. The Silent Mile profiles the architects and engineers behind one of Europe\'s most secretive proving grounds.',
    img: 'https://images.unsplash.com/photo-1699349578489-54436281e9e0?w=800&q=80',
  },
  {
    id: 'carbon-ritual',
    tag: 'Article',
    section: 'Material',
    title: 'Carbon Ritual',
    subtitle: 'The obsessive craft behind hand-laid carbon fibre.',
    location: 'London',
    briefing:
      'Carbon fibre is misunderstood as a material of speed. In the workshops of three London coachbuilders, it is treated as something closer to fabric — woven, folded, and cured with the patience of a tailor.',
    img: 'https://images.unsplash.com/photo-1762522930348-070b98229e9b?w=800&q=80',
  },
  {
    id: 'architecture-of-silence',
    tag: 'Article',
    section: 'Cover Story',
    title: 'The Architecture of Silence',
    subtitle: 'Brutalist design principles reshaping the modern workshop.',
    location: 'Switzerland · Japan',
    briefing:
      'Modern high-end garages are moving away from the cluttered, oil-stained aesthetic of the past towards a clean, brutalist minimalism. Three architecturally significant workshops in Switzerland and Japan.',
    img: 'https://images.unsplash.com/photo-1557226217-bf0da2478e6c?w=800&q=80',
  },
];
