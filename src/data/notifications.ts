import type { HistoryEntry, User } from "../types/user";
import type { AppNotification } from "../types/category";

export const notifications: AppNotification[] = [
  { id: "n1", category: "update", title: "New course from Photography Academy", body: "\u201cStreet Photography\u201d just published \u2014 follow it to get notified of new lessons.", timeAgo: "2h ago", read: false },
  { id: "n2", category: "offer", title: "20% off all Photography courses", body: "Special offer on every Photography Academy course through this weekend.", timeAgo: "5h ago", read: false },
  { id: "n3", category: "reminder", title: "Your class starts tomorrow at 10:00 AM", body: "Advanced Photography \u2014 in-person session at Photography Academy, Béchar.", timeAgo: "8h ago", read: false },
  { id: "n4", category: "update", title: "Course update: \u201cAdvanced Photography\u201d", body: "A new lesson was added to Lighting: \u201cStudio lighting basics\u201d.", timeAgo: "Yesterday", read: true },
  { id: "n5", category: "system", title: "New review on your saved course", body: "Portrait Photography Masterclass received a new 5-star review.", timeAgo: "Yesterday", read: true },
  { id: "n6", category: "update", title: "CodePro Institute added 3 new lessons", body: "Complete Web Development \u2014 new React Router module now live.", timeAgo: "2 days ago", read: true },
];

export const historyEntries: HistoryEntry[] = [
  { id: "h1", type: "course", refId: "advanced-photography", viewedAt: "Today, 10:12 AM" },
  { id: "h2", type: "provider", refId: "photography-academy", viewedAt: "Today, 10:10 AM" },
  { id: "h3", type: "course", refId: "uiux-design-basics", viewedAt: "Yesterday, 6:40 PM" },
  { id: "h4", type: "course", refId: "python-for-beginners", viewedAt: "Yesterday, 6:22 PM" },
  { id: "h5", type: "provider", refId: "codepro-institute", viewedAt: "2 days ago" },
  { id: "h6", type: "course", refId: "english-conversation-skills", viewedAt: "3 days ago" },
];

export const currentUser: User = {
  name: "Alex Martin",
  handle: "@alexmartin",
  email: "alex.martin@example.com",
  avatarUrl: "/orival.svg",
  location: "Béchar, Algeria",
  joined: "May 2024",
};
