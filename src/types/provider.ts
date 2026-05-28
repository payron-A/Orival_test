import type { LearningMode, GeoLocation } from "./courses";

//_____PROVIDER_____
export interface Provider {
  id: string;
  name: string;
  avatarUrl: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  followerCount: number;
  modes: LearningMode[];
  location?: GeoLocation;
  about: string;
  categoryIds: string[];
}