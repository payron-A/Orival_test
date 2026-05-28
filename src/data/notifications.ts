import type { AppNotification } from "../types/category";

export const notifications: AppNotification[] = [
  { id: "n1", category: "update", title: "New from Photography Academy", body: "A new video was added: Framing a portrait in natural light.", timeAgo: "2h ago", read: false },
  { id: "n2", category: "update", title: "CodePro Institute added new lessons", body: "Complete Web Development has a new React Router section.", timeAgo: "Yesterday", read: false },
  { id: "n3", category: "system", title: "Prototype notice", body: "Notifications on this build are sample data. They are not delivered by a server.", timeAgo: "2 days ago", read: true },
];
