"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

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

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prevUnread = useRef<number>(0);

  // create audio once
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/notify.mp3");
      audioRef.current.volume = 0.6;
    }
  }, []);

  // pull notifications list
  const fetchNotifications = async () => {
    try {
      const data = await api<Notification[]>("/api/notifications/");
      setNotifications(data);
      const unread = data.filter((n) => !n.is_read).length;
      setUnreadCount(unread);
      // play sound only if new items arrived
      if (unread > prevUnread.current) {
        audioRef.current?.play().catch(() => {});
      }
      prevUnread.current = unread;
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  // initial + 30‑second polling
  useEffect(() => {
    fetchNotifications();
    const id = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(id);
  }, []);

  // mark individual read
  const markAsRead = async (id: string) => {
    try {
      await api("/api/notifications/${id}/mark_as_read/", "POST");
      setNotifications((n) =>
        n.map((x) => (x.id === id ? { ...x, is_read: true } : x))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error(err);
    }
  };

  // mark all
  const markAll = async () => {
    try {
      await api("/api/notifications/mark_all_as_read/", "POST");
      setNotifications((n) => n.map((x) => ({ ...x, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  /* helper */
  const formatDate = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  const iconFor = (t: string) => {
    const map: Record<string, string> = {
      welcome: "👋",
      inactivity: "⏰",
      pro_expiration: "⭐",
      motivational: "🔥",
    };
    return map[t] ?? "📢";
  };

  /* ───────── UI ───────── */
  return (
    <>
      {/* the bell button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setOpen(true)}
      >
        <Bell className="h-5 w-5 text-examprep-kaabe-maroon" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 min-w-[1.2rem] px-1.5 py-0.5 rounded-full bg-examprep-kaabe-maroon text-white text-[10px] flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* slide‑in panel */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-96 bg-examprep-kaabe-beige/90 backdrop-blur-md"
        >
          <SheetHeader className="border-b border-examprep-kaabe-light-maroon/20 mb-4 pb-3">
            <SheetTitle className="flex items-center justify-between">
              <span className="text-examprep-kaabe-maroon font-bold text-lg">
                Notifications
              </span>
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAll}>
                  <Check className="h-4 w-4 mr-1" /> Mark all
                </Button>
              )}
            </SheetTitle>
          </SheetHeader>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-examprep-kaabe-maroon" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center text-sm text-examprep-kaabe-light-brown py-10">
              No notifications yet.
            </div>
          ) : (
            <div className="space-y-2 pr-1 max-h-[calc(100vh-180px)] overflow-y-auto">
              <AnimatePresence>
                {notifications.map((n) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    layout
                    className={`p-3 rounded-lg border border-examprep-kaabe-light-maroon/10 bg-white/70 hover:bg-white flex gap-3 cursor-pointer transition-colors ${
                      n.is_read ? "opacity-70" : "shadow-sm"
                    }`}
                    onClick={() => markAsRead(n.id)}
                  >
                    <div className="h-8 w-8 flex-shrink-0 rounded-full bg-examprep-kaabe-maroon/10 flex items-center justify-center text-lg">
                      {iconFor(n.notification_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-examprep-kaabe-brown line-clamp-1">
                        {n.title}
                      </p>
                      <p className="text-xs text-examprep-kaabe-light-brown line-clamp-2">
                        {n.message}
                      </p>
                      <p className="text-[10px] text-examprep-kaabe-maroon/70 mt-0.5">
                        {formatDate(n.created_at)}
                      </p>
                    </div>
                    {!n.is_read && (
                      <span className="mt-1 w-2 h-2 rounded-full bg-examprep-kaabe-maroon"></span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          <div className="pt-4">
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => (window.location.href = "/notification")}
            >
              View full history
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
