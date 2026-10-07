export type City = "Piltover" | "Zaun" | "Both";

export type Character = {
  name: string;
  title: string;
  city: City;
  color: string;
  glow: string;
  sigil: string;
  line: string;
  bio: string;
  traits: string[];
  /** Portrait (cards) and wide splash (dialog) under /public. Missing → sigil art. */
  image?: string;
  splash?: string;
};

export const characters: Character[] = [
  {
    name: "Vi",
    image: "/characters/vi.jpg",
    splash: "/characters/vi-splash.jpg",
    title: "The Enforcer of the Undercity",
    city: "Zaun",
    color: "#ff5c8a",
    glow: "rgba(255,92,138,0.45)",
    sigil: "VI",
    line: "Fists first. Questions never.",
    bio: "Raised in the lanes beneath Piltover, Vi fights to hold together the only family she has left — even when it means trading blows with the city that made her.",
    traits: ["Brawler", "Protector", "Stubborn"],
  },
  {
    name: "Jinx",
    image: "/characters/jinx.jpg",
    splash: "/characters/jinx-splash.jpg",
    title: "The Loose Cannon",
    city: "Zaun",
    color: "#4fd8ff",
    glow: "rgba(79,216,255,0.45)",
    sigil: "JX",
    line: "Chaos is just a plan nobody else understands.",
    bio: "Once called Powder, she grew into a brilliant, unpredictable inventor whose rockets and grenades are as volatile as the memories haunting her.",
    traits: ["Inventor", "Volatile", "Haunted"],
  },
  {
    name: "Caitlyn",
    image: "/characters/caitlyn.jpg",
    splash: "/characters/caitlyn-splash.jpg",
    title: "The Sheriff's Sharpshooter",
    city: "Piltover",
    color: "#6f9bff",
    glow: "rgba(111,155,255,0.45)",
    sigil: "CK",
    line: "One shot. Make it count.",
    bio: "A Kiramman by birth and an investigator by choice, Caitlyn trades the comforts of the upper city for the truth buried far below it.",
    traits: ["Marksman", "Idealist", "Relentless"],
  },
  {
    name: "Jayce",
    image: "/characters/jayce.jpg",
    splash: "/characters/jayce-splash.jpg",
    title: "The Defender of Tomorrow",
    city: "Piltover",
    color: "#e8b866",
    glow: "rgba(232,184,102,0.45)",
    sigil: "JT",
    line: "Progress has a price. Someone always pays it.",
    bio: "The visionary who brought magic to the masses through hextech — and discovered that every great invention casts a long shadow.",
    traits: ["Visionary", "Hextech", "Driven"],
  },
  {
    name: "Viktor",
    image: "/characters/viktor.jpg",
    splash: "/characters/viktor-splash.jpg",
    title: "The Machine Herald",
    city: "Both",
    color: "#ffb347",
    glow: "rgba(255,179,71,0.45)",
    sigil: "VK",
    line: "Flesh is temporary. Ideas are not.",
    bio: "Born in the undercity and brilliant beyond measure, Viktor pushes the limits of hextech to outrun a body that is failing him.",
    traits: ["Scientist", "Evolving", "Quiet"],
  },
  {
    name: "Ekko",
    image: "/characters/ekko.jpg",
    splash: "/characters/ekko-splash.jpg",
    title: "The Boy Who Shattered Time",
    city: "Zaun",
    color: "#7cf2b0",
    glow: "rgba(124,242,176,0.45)",
    sigil: "EK",
    line: "Every second is a second chance.",
    bio: "Leader of the Firelights, a tinkerer who builds sanctuaries out of scrap and keeps the undercity's hope glowing in the dark.",
    traits: ["Firelight", "Tinkerer", "Loyal"],
  },
  {
    name: "Silco",
    image: "/characters/silco.jpg",
    splash: "/characters/silco-splash.jpg",
    title: "The Chem-Baron",
    city: "Zaun",
    color: "#9b5cff",
    glow: "rgba(155,92,255,0.45)",
    sigil: "SC",
    line: "A nation is built on the backs of the willing.",
    bio: "A ruthless kingpin who dreams of an independent Zaun, fuelled by shimmer and an unshakable conviction that the ends justify everything.",
    traits: ["Strategist", "Ruthless", "Visionary"],
  },
  {
    name: "Mel",
    image: "/characters/mel.jpg",
    splash: "/characters/mel-splash.jpg",
    title: "The Councilor",
    city: "Piltover",
    color: "#f4d58d",
    glow: "rgba(244,213,141,0.45)",
    sigil: "MM",
    line: "Power is a conversation. I prefer to lead it.",
    bio: "A Noxian-born diplomat on Piltover's council, Mel plays the long game of influence while hiding more of herself than anyone realises.",
    traits: ["Diplomat", "Elegant", "Calculating"],
  },
];

export const seasons = [
  {
    id: "s1",
    label: "Season One",
    year: "2021",
    tagline: "The fuse is lit.",
    acts: [
      {
        act: "Act I",
        title: "Welcome to the Playground",
        text: "Two orphaned sisters run the streets of the undercity — until one heist sets off a chain reaction neither of them can take back.",
      },
      {
        act: "Act II",
        title: "Hextech Rising",
        text: "Years later, Piltover's progress gleams while Zaun simmers. A sheriff's daughter and a prisoner form an unlikely alliance.",
      },
      {
        act: "Act III",
        title: "The Monster You Created",
        text: "Loyalties fracture, a summit turns to fire, and a single rocket rewrites the fate of both cities.",
      },
    ],
  },
  {
    id: "s2",
    label: "Season Two",
    year: "2024",
    tagline: "The war begins.",
    acts: [
      {
        act: "Act I",
        title: "Heavy Is the Crown",
        text: "Piltover reels from tragedy and turns its gaze — and its weapons — toward the undercity.",
      },
      {
        act: "Act II",
        title: "Blood Will Out",
        text: "Old wounds reopen as sisters choose sides and hextech grows into something no one fully controls.",
      },
      {
        act: "Act III",
        title: "The Last Glorious Purpose",
        text: "Gods, machines and the people caught between them collide in a final battle for the soul of Runeterra.",
      },
    ],
  },
] as const;

export const stats = [
  { value: 2, suffix: "", label: "Seasons" },
  { value: 18, suffix: "", label: "Episodes" },
  { value: 6, suffix: "", label: "Acts" },
  { value: 1, suffix: "st", label: "Streaming series to win the Emmy for Outstanding Animated Program" },
];

export const NETFLIX_URL = "https://www.netflix.com/title/81435684";
export const TRAILER_URL =
  "https://www.youtube.com/results?search_query=arcane+official+trailer";
