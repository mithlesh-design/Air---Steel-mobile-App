export type ArticleData = {
  id: string;
  tag: string;
  section: string;
  title: string;
  subtitle: string;
  briefing: string;
};

export const ARTICLES: Record<string, ArticleData> = {
  "night-runners": {
    id: "night-runners",
    tag: "Article",
    section: "Nightside",
    title: "Night Runners",
    subtitle: "Inside Tokyo's underground car culture — where the city sleeps and the machines wake.",
    briefing:
      "After midnight, the elevated expressways of Tokyo become something else entirely. The toll gates thin out, the neon bleeds into wet asphalt, and a loose fraternity of drivers emerges — not for racing, but for the ritual of movement. Night Runners documents three consecutive nights spent inside this world: the mechanics who tune by feel, the drivers who navigate by instinct, and the quiet code that governs it all.",
  },
  "analogue": {
    id: "analogue",
    tag: "Article",
    section: "Feature",
    title: "Analogue",
    subtitle: "A Los Angeles studio restoring pre-digital machines in a world saturated with screens.",
    briefing:
      "In a converted warehouse off South Alameda, a small team works without computers. Every restoration is performed by hand — carburetor jets cleaned with wire, timing set by ear, bodywork guided by touch. Analogue is a portrait of the last practitioners of a discipline that refuses to modernise, and an argument for why that stubbornness matters.",
  },
  "the-silent-mile": {
    id: "the-silent-mile",
    tag: "Article",
    section: "Cover Story",
    title: "The Silent Mile",
    subtitle: "High above Geneva, a test track exists that no map shows and few have seen.",
    briefing:
      "The road climbs past the tree line and then simply continues — unmarked, immaculate, and entirely private. The Silent Mile profiles the architects and engineers behind one of Europe's most secretive proving grounds, where prototype vehicles are evaluated in absolute quiet, away from competition intelligence and public roads. What happens here shapes what you drive in five years.",
  },
  "carbon-ritual": {
    id: "carbon-ritual",
    tag: "Article",
    section: "Material",
    title: "Carbon Ritual",
    subtitle: "The obsessive craft behind hand-laid carbon fibre in London's most rigorous coachbuilders.",
    briefing:
      "Carbon fibre is misunderstood as a material of speed. In the workshops of three London coachbuilders, it is treated as something closer to fabric — woven, folded, and cured with the patience of a tailor. Carbon Ritual follows a single panel from raw woven sheet to finished body component: seventy-two hours, six pairs of hands, and a discipline that tolerates no shortcuts.",
  },
  "architecture-of-silence": {
    id: "architecture-of-silence",
    tag: "Article",
    section: "Cover Story",
    title: "The Architecture of Silence",
    subtitle: "How brutalist design principles are reshaping the modern high-end automotive workshop.",
    briefing:
      "Modern high-end garages are moving away from the cluttered, oil-stained aesthetic of the past towards a clean, brutalist minimalism. Three architecturally significant workshops in Switzerland and Japan take you inside spaces where concrete meets carbon fiber, and every tool has its place. Here, the environment itself becomes a medium — a cathedral-like atmosphere where noise is kept to a reverent minimum.",
  },
};
