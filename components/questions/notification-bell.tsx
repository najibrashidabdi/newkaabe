"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Circle, Loader2 } from "lucide-react";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

interface Notification {
  id: number;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  /* unread badge */
  const unread = items.filter((n) => !n.is_read).length;

  /* lazy-fetch when panel is opened first time */
  const load = async () => {
    if (items.length || loading) return;
    setLoading(true);
    try {
      const res = await api<Notification[]>("/api/notifications/");
      setItems(res);
    } finally {
      setLoading(false);
    }
  };

  /* mark as read */
  const markRead = (id: number) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    api(`/api/notifications/${id}/read/`, "POST").catch(() => {});
  };

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) load();
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-examprep-kaabe-brown hover:bg-examprep-kaabe-cream"
        >
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-examprep-kaabe-maroon px-1 text-[10px] font-semibold text-white">
              {unread}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-80 p-0 bg-white/90 backdrop-blur-md border-examprep-kaabe-light-maroon/20 shadow-custom rounded-xl"
      >
        <div className="px-4 py-3 font-semibold text-examprep-kaabe-maroon flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Notifications
        </div>
        <Separator />

        {/* list */}
        <div className="max-h-72 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-examprep-kaabe-maroon" />
            </div>
          ) : items.length === 0 ? (
            <p className="p-4 text-center text-sm text-examprep-kaabe-light-brown">
              You’re all caught up!
            </p>
          ) : (
            items.map((n) => (
              <button
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`flex w-full items-start gap-2 px-4 py-3 text-left hover:bg-examprep-kaabe-cream/50 transition-colors ${
                  !n.is_read ? "bg-examprep-kaabe-cream/40" : ""
                }`}
              >
                {!n.is_read && (
                  <Circle className="h-2.5 w-2.5 mt-1 text-examprep-kaabe-maroon shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-xs font-medium truncate text-examprep-kaabe-brown">
                    {n.title}
                  </p>
                  <p className="text-xs line-clamp-2 text-examprep-kaabe-light-brown">
                    {n.body}
                  </p>
                </div>
                <span className="ml-2 shrink-0 whitespace-nowrap text-[10px] text-examprep-kaabe-light-brown">
                  {new Date(n.created_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </button>
            ))
          )}
        </div>

        <Separator />

        <div className="p-2 text-right">
          <Button variant="link" size="sm" asChild>
            <Link href="/notifications">See all</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
