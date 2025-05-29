"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Bell, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await api<Notification[]>("/api/notifications/");
      setNotifications(data);
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
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await api("/api/notifications/mark_all_as_read/", "POST");
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Load notifications when component mounts
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.is_read;
    return notification.notification_type === activeTab;
  });

  // Get notification type label
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "welcome":
        return "Welcome";
      case "inactivity":
        return "Reminder";
      case "pro_expiration":
        return "Pro Subscription";
      case "motivational":
        return "Motivation";
      default:
        return "Notification";
    }
  };

  // Get notification type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case "welcome":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactivity":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "pro_expiration":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "motivational":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-examprep-kaabe-light-brown/5">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              asChild
              className="text-examprep-kaabe-brown hover:text-examprep-kaabe-maroon hover:bg-examprep-kaabe-maroon/5"
            >
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container py-8">
        <div className="flex flex-col items-center text-center gap-4 mb-8">
          <div className="h-16 w-16 rounded-full bg-examprep-kaabe-maroon/10 flex items-center justify-center">
            <Bell className="h-8 w-8 text-examprep-kaabe-maroon" />
          </div>
          <h1 className="text-3xl font-bold text-examprep-kaabe-brown">
            Notifications
          </h1>
          <p className="text-muted-foreground max-w-md">
            Stay updated with important information, reminders, and motivational
            content.
          </p>
        </div>

        <Card className="border-examprep-kaabe-maroon/20 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-examprep-kaabe-brown">
              Your Notifications
            </CardTitle>
            {notifications.some((n) => !n.is_read) && (
              <Button
                variant="outline"
                size="sm"
                className="border-examprep-kaabe-maroon/20 text-examprep-kaabe-maroon hover:bg-examprep-kaabe-maroon/5"
                onClick={markAllAsRead}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark all as read
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="mb-6">
                <TabsTrigger value="all">
                  All
                  {notifications.length > 0 && (
                    <Badge className="ml-2 bg-examprep-kaabe-maroon/10 text-examprep-kaabe-maroon border-none">
                      {notifications.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="unread">
                  Unread
                  {notifications.filter((n) => !n.is_read).length > 0 && (
                    <Badge className="ml-2 bg-examprep-kaabe-maroon/10 text-examprep-kaabe-maroon border-none">
                      {notifications.filter((n) => !n.is_read).length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="motivational">Motivational</TabsTrigger>
                <TabsTrigger value="pro_expiration">Pro Status</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="h-8 w-8 border-4 border-examprep-kaabe-maroon/20 border-t-examprep-kaabe-maroon rounded-full animate-spin"></div>
                  </div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <p className="text-muted-foreground">
                      No notifications found
                    </p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg border ${
                        !notification.is_read
                          ? "bg-examprep-kaabe-maroon/5 border-examprep-kaabe-maroon/20"
                          : "bg-white border-examprep-kaabe-maroon/10"
                      }`}
                      onClick={() =>
                        !notification.is_read && markAsRead(notification.id)
                      }
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-examprep-kaabe-brown">
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={getTypeColor(
                              notification.notification_type
                            )}
                          >
                            {getTypeLabel(notification.notification_type)}
                          </Badge>
                          {!notification.is_read && (
                            <div className="h-2 w-2 rounded-full bg-examprep-kaabe-maroon"></div>
                          )}
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-examprep-kaabe-maroon/70">
                        {formatDate(notification.created_at)}
                      </p>
                    </motion.div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
