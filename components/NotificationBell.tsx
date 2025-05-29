"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Notification {
  id: string;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await api<Notification[]>("/api/notifications/");
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.is_read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (id: string) => {
    try {
      await api(`/api/notifications/${id}/mark_as_read/`, "POST");
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await api("/api/notifications/mark_all_as_read/", "POST");
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Load notifications when component mounts or popover opens
  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "welcome":
        return "👋";
      case "inactivity":
        return "⏰";
      case "pro_expiration":
        return "⭐";
      case "motivational":
        return "🔥";
      default:
        return "📢";
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => setOpen(true)}
        >
          <Bell className="h-5 w-5 text-examprep-kaabe-maroon" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-examprep-kaabe-maroon text-white text-[10px] flex items-center justify-center p-0">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-80 p-0 rounded-xl border border-examprep-kaabe-maroon/10 bg-white shadow-xl"
      >
        <div className="flex justify-between items-center p-4 border-b border-examprep-kaabe-maroon/10">
          <h3 className="font-bold text-examprep-kaabe-brown">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center p-6">
              <div className="h-6 w-6 border-2 border-examprep-kaabe-maroon/20 border-t-examprep-kaabe-maroon rounded-full animate-spin"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <p>No notifications yet</p>
            </div>
          ) : (
            <AnimatePresence>
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`flex gap-3 p-4 hover:bg-examprep-kaabe-maroon/5 transition-colors cursor-pointer border-b border-examprep-kaabe-maroon/5 ${
                    !notification.is_read ? "bg-examprep-kaabe-maroon/5" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="h-8 w-8 rounded-full bg-examprep-kaabe-maroon/10 flex items-center justify-center flex-shrink-0">
                    <span>
                      {getNotificationIcon(notification.notification_type)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${
                        !notification.is_read
                          ? "text-examprep-kaabe-brown"
                          : "text-muted-foreground"
                      }`}
                    >
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-examprep-kaabe-maroon/70 mt-1">
                      {formatDate(notification.created_at)}
                    </p>
                  </div>
                  {!notification.is_read && (
                    <div className="w-2 h-2 rounded-full bg-examprep-kaabe-maroon self-start mt-2"></div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <div className="p-3 border-t border-examprep-kaabe-maroon/10">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-examprep-kaabe-maroon"
            onClick={() => (window.location.href = "/notifications")}
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
