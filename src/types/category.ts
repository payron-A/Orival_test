//_____CATEGORY_____
//___Category:
export interface Category {
  id: string;
  name: string;
  icon: string; // lucide icon name
  courseCount: number;
  color: string;
}
//___Notification Category:
export type NotificationCategory = "update" | "system";
export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  timeAgo: string;
  read: boolean;
}