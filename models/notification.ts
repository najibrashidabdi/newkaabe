import type { User } from "./user";

export interface Notification {
  id: string;
  user: User;
  title: string;
  message: string;
  type: "welcome" | "inactivity" | "pro_expiration" | "motivational";
  isRead: boolean;
  createdAt: Date;
  deliveryStatus: "pending" | "sent" | "failed";
  deliveryMethod: "email" | "push" | "in_app";
}
