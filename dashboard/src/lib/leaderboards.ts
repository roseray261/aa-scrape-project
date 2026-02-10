export interface Leaderboard {
  slug: string;
  name: string;
  description: string;
}

export const LEADERBOARDS: Leaderboard[] = [
  {
    slug: "text-to-image",
    name: "Text to Image",
    description: "Ranking of AI models that generate images from text prompts",
  },
  {
    slug: "image-editing",
    name: "Image Editing",
    description: "Ranking of AI models for editing and modifying images",
  },
  {
    slug: "text-to-video",
    name: "Text to Video",
    description: "Ranking of AI models that generate videos from text prompts",
  },
  {
    slug: "image-to-video",
    name: "Image to Video",
    description: "Ranking of AI models that generate videos from images",
  },
  {
    slug: "text-to-speech",
    name: "Text to Speech",
    description: "Ranking of AI models that generate speech from text",
  },
];

export function getLeaderboardBySlug(slug: string): Leaderboard | undefined {
  return LEADERBOARDS.find((lb) => lb.slug === slug);
}
