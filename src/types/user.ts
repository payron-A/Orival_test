//_____USER_____
export type AccountRole = "member" | "creator";
export type CreatorApplicationStatus = "pending" | "approved" | "rejected";

export interface CreatorApplication {
  status: CreatorApplicationStatus;
  experience: string;
  expertise: string;
  qualifications: string;
  submittedAt: string;
  decidedAt?: string;
}

export interface User {
  name: string;
  handle: string;
  email: string;
  avatarUrl: string;
  location: string;
  joinedAt: string;
  following?: string[];
  /** Set by the legacy API for provider accounts; treated as Creator. */
  providerId?: string;
  /** Frontend-only role. NOT a security boundary. */
  role?: AccountRole;
  creatorApplication?: CreatorApplication;
}

//_____HISTORY_____
export interface HistoryEntry {
  id: string;
  type: "course" | "video";
  refId: string;
  lessonId?: string;
  viewedAt: string; // ISO
}
