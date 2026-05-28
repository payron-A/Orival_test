import type { Video } from "../types/content";

/**
 * Prototype standalone videos. They reuse existing seed creators/categories and
 * deliberately carry NO media source, so the player shows its honest
 * "no media attached" state rather than pretending to stream.
 */
export const demoVideos: Video[] = [
  { id: "v-framing-basics", title: "Framing a portrait in natural light", thumbnailUrl: "", providerId: "photography-academy", categoryId: "photography", description: "A short walkthrough on placing your subject and reading window light.", durationLabel: "08:40", tags: ["photography", "portrait", "light"], addedAt: "2026-09-02", isDemo: true },
  { id: "v-html-first-page", title: "HTML for beginners: your first page", thumbnailUrl: "", providerId: "codepro-institute", categoryId: "programming", description: "Build a simple web page from an empty file, one tag at a time.", durationLabel: "12:15", tags: ["html", "web", "beginner"], addedAt: "2026-09-10", isDemo: true },
  { id: "v-python-loops", title: "How loops actually work in Python", thumbnailUrl: "", providerId: "codepro-institute", categoryId: "programming", description: "for, while and the mistakes that cause infinite loops.", durationLabel: "10:05", tags: ["python", "loops"], addedAt: "2026-09-18", isDemo: true },
  { id: "v-type-pairing", title: "Pairing two typefaces without guessing", thumbnailUrl: "", providerId: "creative-studio", categoryId: "design", description: "A practical method for choosing type that works together.", durationLabel: "07:30", tags: ["design", "typography"], addedAt: "2026-09-25", isDemo: true },
  { id: "v-english-small-talk", title: "Small talk in English: five openers", thumbnailUrl: "", providerId: "english-center", categoryId: "languages", description: "Easy ways to start a conversation with someone new.", durationLabel: "06:20", tags: ["english", "speaking"], addedAt: "2026-10-03", isDemo: true },
];
