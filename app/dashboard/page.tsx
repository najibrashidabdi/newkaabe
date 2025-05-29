"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Award,
  BarChart3,
  LogOut,
  UserRound,
  BarChartIcon as ChartIcon,
  CheckCircle,
  BrainCircuit,
  Clock,
  Target,
  Zap,
  LineChartIcon as ReLineChart,
  PieChartIcon as RePieChart,
  TrendingUp,
  Menu,
  BookOpenCheck,
  User,
  Home,
  ChevronRight,
  X,
  Bell,
  BellRing,
} from "lucide-react";

import { api } from "@/lib/api"; // real API helper
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

import { ProUpgradeModal } from "@/components/pro-upgrade-modal";
import { SubjectCard } from "@/components/subject-card";

import {
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  Line,
  CartesianGrid,
  Area,
  AreaChart,
  Pie,
  Cell,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  PieChart,
} from "recharts";

/* ───────── Types sent by backend ───────── */
interface SubjectStat {
  id: number;
  name: string;
  icon: string;
  questions: number;
  completed: number;
  progress: number;
}

interface LeaderboardEntry {
  id: number;
  name: string;
  school: string;
  points: number;
  profile_picture?: string;
}

interface DashRes {
  name: string;
  school: string;
  is_pro: boolean;
  pro_expires_in?: number; // days left – backend adds this
  total_questions: number;
  completed_questions: number;
  accuracy: number;
  subjects: SubjectStat[];
  leaderboard: LeaderboardEntry[];
  profile_picture?: string;
}

interface UserData {
  id: number;
  email: string;
  full_name: string;
  school_name: string;
  phone_number: string;
  is_verified: boolean;
  profile_picture?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
}

/* Sample data for new charts */
const weeklyProgress = [
  { day: "Mon", questions: 15, accuracy: 70 },
  { day: "Tue", questions: 22, accuracy: 75 },
  { day: "Wed", questions: 18, accuracy: 77 },
  { day: "Thu", questions: 25, accuracy: 82 },
  { day: "Fri", questions: 30, accuracy: 85 },
  { day: "Sat", questions: 12, accuracy: 80 },
  { day: "Sun", questions: 8, accuracy: 78 },
];

const generateStudyTimeData = (subjects: SubjectStat[]) => {
  if (!subjects.length) return [];

  return subjects.map((subject) => ({
    name: subject.name,
    value: subject.completed * 2.5, // Approximating study time based on completed questions
  }));
};

const COLORS = [
  "#8d2c2c",
  "#ad4c4c",
  "#5e4743",
  "#3e2723",
  "#b25f5f",
  "#7a5a56",
];

/* ───────── Component ───────── */
export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashRes | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPro, setShowPro] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("statistics");
  const [chartWidth, setChartWidth] = useState(0);
  const [chartHeight, setChartHeight] = useState(300);

  /* pop‑over open states */
  const [openCard, setOpenCard] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);

  /* fetch dashboard data and user data */
  const load = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch both dashboard data and user profile data
      const [dashboardRes, userRes] = await Promise.all([
        api<DashRes>("/api/dashboard/"),
        api<UserData>("/api/auth/me/"),
      ]);

      setData(dashboardRes);
      setUserData(userRes);

      console.log("Dashboard data:", dashboardRes);
      console.log("User data:", userRes);
      console.log("Profile picture URL:", userRes.profile_picture);
    } catch (e: any) {
      console.error("Error loading dashboard:", e);
      if (e?.detail?.includes("limit")) setShowPro(true);
      else if (e?.status === 403 || e?.message?.includes("Unauthorized"))
        router.push("/login");
      else setError("Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  /* fetch notifications */
  const loadNotifications = useCallback(async () => {
    setNotificationsLoading(true);
    try {
      const notificationsRes = await api<Notification[]>("/api/notifications/");
      setNotifications(notificationsRes);
      console.log("Notifications loaded:", notificationsRes);
    } catch (e: any) {
      console.error("Error loading notifications:", e);
      // Don't show error for notifications, just log it
    } finally {
      setNotificationsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    loadNotifications();
  }, [load, loadNotifications]);

  // Handle responsive chart sizing
  useEffect(() => {
    const handleResize = () => {
      // Adjust chart height based on screen width
      if (window.innerWidth < 640) {
        setChartHeight(250);
      } else {
        setChartHeight(300);
      }
    };

    // Set initial sizes
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleUpgraded = () => {
    setShowPro(false);
    load();
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

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await api("/api/notifications/mark_all_as_read/", "POST");
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Format date for notifications
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
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

  // Get notification type label
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "welcome":
        return "Welcome";
      case "inactivity":
        return "Reminder";
      case "pro_expiration":
        return "Pro";
      case "motivational":
        return "Motivation";
      default:
        return "Info";
    }
  };

  // Get unread notifications count
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  /* guards */
  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-examprep-kaabe-beige">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-examprep-kaabe-light-maroon opacity-25 rounded-full animate-ping"></div>
            <div className="w-16 h-16 border-4 border-t-examprep-kaabe-maroon border-l-examprep-kaabe-light-maroon border-r-examprep-kaabe-light-brown border-b-examprep-kaabe-brown rounded-full animate-spin"></div>
          </div>
          <p className="text-sm text-examprep-kaabe-brown font-medium animate-pulse-gentle">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );

  if (error || !data || !userData)
    return (
      <div className="flex h-screen items-center justify-center bg-examprep-kaabe-beige">
        <div className="text-center p-8 max-w-md bg-white/70 backdrop-blur-sm rounded-xl shadow-custom border border-examprep-kaabe-light-maroon/20 animate-scale-in">
          <div className="w-16 h-16 bg-examprep-kaabe-light-maroon/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-examprep-kaabe-maroon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="text-lg font-semibold text-examprep-kaabe-maroon mb-2">
            Unable to Load Dashboard
          </p>
          <p className="text-sm text-examprep-kaabe-brown mb-4">
            {error ?? "Please try again later"}
          </p>
          <Button
            className="bg-examprep-kaabe-maroon hover:bg-examprep-kaabe-brown text-white transition-colors"
            onClick={() => load()}
          >
            Retry
          </Button>
        </div>
      </div>
    );

  /* data */
  const {
    name,
    school,
    is_pro,
    pro_expires_in = 0,
    completed_questions,
    total_questions,
    accuracy,
    subjects,
    leaderboard,
  } = data;

  // Use userData for profile picture and other user info
  const profilePictureUrl = userData.profile_picture;
  const displayName = userData.full_name || name;
  const displaySchool = userData.school_name || school;

  const completedPercent = total_questions
    ? (completed_questions / total_questions) * 100
    : 0;

  const studyTimeData = generateStudyTimeData(subjects);

  // Helper function to get full profile picture URL
  const getProfilePictureUrl = (url?: string) => {
    if (!url) return null;

    // If it's already a full URL, return as is
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // If it starts with /media/, construct full URL
    if (url.startsWith("/media/")) {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      return `${baseUrl}${url}`;
    }

    // If it's just a path, add /media/ prefix
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    return `${baseUrl}/media/${url}`;
  };

  const fullProfilePictureUrl = getProfilePictureUrl(profilePictureUrl);

  console.log("Final profile picture URL:", fullProfilePictureUrl);

  /* ───────── UI ───────── */
  return (
    <div className="flex min-h-screen flex-col bg-examprep-kaabe-beige">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 w-full border-b border-examprep-kaabe-light-maroon/20 bg-examprep-kaabe-beige/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* logo */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="mr-1 text-examprep-kaabe-brown hover:bg-examprep-kaabe-cream md:hidden"
              onClick={() => setShowMobileMenu(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>

            <Link href="/" className="flex items-center gap-2">
              <div className="h-9 w-9 relative">
                <Image
                  src="/kaabe-logo.png"
                  alt="Kaabe"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-xl bg-kaabe-gradient bg-clip-text text-transparent">
                Kaabe
              </span>
            </Link>
          </div>

          {/* middle nav - desktop only */}
          <nav className="hidden md:flex items-center space-x-1">
            <Button
              variant="ghost"
              className="text-examprep-kaabe-brown hover:bg-examprep-kaabe-cream hover:text-examprep-kaabe-maroon"
              asChild
            >
              <Link href="/">
                <Home className="mr-1 h-4 w-4" />
                Home
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="text-examprep-kaabe-brown hover:bg-examprep-kaabe-cream hover:text-examprep-kaabe-maroon"
              asChild
            >
              <Link href="/subjects">
                <BookOpenCheck className="mr-1 h-4 w-4" />
                Subjects
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="text-examprep-kaabe-brown hover:bg-examprep-kaabe-cream hover:text-examprep-kaabe-maroon"
              asChild
            >
              <Link href="/practice">
                <Target className="mr-1 h-4 w-4" />
                Practice
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="text-examprep-kaabe-brown hover:bg-examprep-kaabe-cream hover:text-examprep-kaabe-maroon"
              asChild
            >
              <Link href="/progress">
                <TrendingUp className="mr-1 h-4 w-4" />
                Progress
              </Link>
            </Button>
          </nav>

          {/* right side */}
          <div className="flex items-center gap-3">
            {!is_pro && (
              <Button
                variant="outline"
                className="hidden sm:flex border-examprep-kaabe-maroon text-examprep-kaabe-maroon hover:bg-examprep-kaabe-maroon hover:text-white transition-colors"
                onClick={() => setShowPro(true)}
              >
                <Zap className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">Upgrade to Pro</span>
                <span className="sm:hidden">Pro</span>
              </Button>
            )}

            {/* Notifications Bell */}
            <Popover
              open={openNotifications}
              onOpenChange={setOpenNotifications}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-examprep-kaabe-brown hover:bg-examprep-kaabe-cream hover:text-examprep-kaabe-maroon"
                >
                  {unreadCount > 0 ? (
                    <BellRing className="h-5 w-5" />
                  ) : (
                    <Bell className="h-5 w-5" />
                  )}
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </PopoverTrigger>

              <PopoverContent
                align="end"
                className="w-80 rounded-xl border border-examprep-kaabe-light-maroon/20 bg-white/90 backdrop-blur-md shadow-custom p-0 animate-fade-in"
              >
                <div className="p-4 border-b border-examprep-kaabe-light-maroon/10">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-examprep-kaabe-brown">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-examprep-kaabe-maroon hover:text-examprep-kaabe-brown"
                        onClick={markAllAsRead}
                      >
                        Mark all read
                      </Button>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <p className="text-xs text-examprep-kaabe-light-brown mt-1">
                      You have {unreadCount} unread notification
                      {unreadCount !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>

                <ScrollArea className="max-h-96">
                  {notificationsLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="h-6 w-6 border-2 border-examprep-kaabe-maroon/20 border-t-examprep-kaabe-maroon rounded-full animate-spin"></div>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="text-center py-8 px-4">
                      <Bell className="h-8 w-8 text-examprep-kaabe-light-brown/50 mx-auto mb-2" />
                      <p className="text-sm text-examprep-kaabe-light-brown">
                        No notifications yet
                      </p>
                    </div>
                  ) : (
                    <div className="p-2">
                      {notifications.slice(0, 10).map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                            !notification.is_read
                              ? "bg-examprep-kaabe-maroon/5 hover:bg-examprep-kaabe-maroon/10"
                              : "hover:bg-examprep-kaabe-cream/30"
                          }`}
                          onClick={() => {
                            if (!notification.is_read) {
                              markAsRead(notification.id);
                            }
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-medium text-examprep-kaabe-brown truncate">
                                  {notification.title}
                                </h4>
                                {!notification.is_read && (
                                  <div className="h-2 w-2 rounded-full bg-red-500 flex-shrink-0"></div>
                                )}
                              </div>
                              <p className="text-xs text-examprep-kaabe-light-brown line-clamp-2 mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between">
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getTypeColor(
                                    notification.notification_type
                                  )}`}
                                >
                                  {getTypeLabel(notification.notification_type)}
                                </Badge>
                                <span className="text-xs text-examprep-kaabe-light-brown">
                                  {formatDate(notification.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>

                {notifications.length > 10 && (
                  <div className="p-3 border-t border-examprep-kaabe-light-maroon/10">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-examprep-kaabe-maroon hover:text-examprep-kaabe-brown hover:bg-examprep-kaabe-cream"
                      asChild
                      onClick={() => setOpenNotifications(false)}
                    >
                      <Link href="/notifications">
                        View all notifications
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>

            {/* Profile Avatar */}
            <Popover open={openCard} onOpenChange={setOpenCard}>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer border-2 border-examprep-kaabe-light-maroon/30 hover:border-examprep-kaabe-maroon transition-colors">
                  {fullProfilePictureUrl ? (
                    <AvatarImage
                      src={fullProfilePictureUrl || "/placeholder.svg"}
                      alt={displayName}
                      onError={(e) => {
                        console.error(
                          "Failed to load profile picture:",
                          fullProfilePictureUrl
                        );
                        // Hide the image on error so fallback shows
                        e.currentTarget.style.display = "none";
                      }}
                      onLoad={() => {
                        console.log(
                          "Profile picture loaded successfully:",
                          fullProfilePictureUrl
                        );
                      }}
                    />
                  ) : null}
                  <AvatarFallback className="bg-examprep-kaabe-cream text-examprep-kaabe-maroon">
                    {displayName ? displayName.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>

              <PopoverContent
                align="end"
                className="w-60 rounded-xl border border-examprep-kaabe-light-maroon/20 bg-white/90 backdrop-blur-md shadow-custom p-4 animate-fade-in"
              >
                <div className="mb-3 flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-examprep-kaabe-maroon" />
                  <span className="font-semibold text-examprep-kaabe-brown">
                    {displayName}
                  </span>
                </div>

                <p className="text-sm text-examprep-kaabe-light-brown mb-1">
                  <strong>School: </strong>
                  {displaySchool}
                </p>

                {is_pro && (
                  <div className="mt-2 p-2 bg-examprep-kaabe-cream/50 rounded-lg border border-examprep-kaabe-light-maroon/20">
                    <p className="text-xs font-medium text-examprep-kaabe-maroon flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      Pro member • {pro_expires_in} day
                      {pro_expires_in !== 1 && "s"} left
                    </p>
                  </div>
                )}

                <Separator className="my-3 bg-examprep-kaabe-light-maroon/10" />

                {!is_pro && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mb-2 border-examprep-kaabe-maroon text-examprep-kaabe-maroon hover:bg-examprep-kaabe-maroon hover:text-white"
                    onClick={() => {
                      setOpenCard(false);
                      setShowPro(true); // open the modal
                    }}
                  >
                    <Zap className="mr-1 h-3.5 w-3.5" />
                    Upgrade to Pro
                  </Button>
                )}

                <div className="space-y-1">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-examprep-kaabe-brown hover:bg-examprep-kaabe-cream hover:text-examprep-kaabe-maroon"
                  >
                    <Link href="/profile">
                      <User className="mr-2 h-3.5 w-3.5" />
                      My Profile
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-examprep-kaabe-brown hover:bg-examprep-kaabe-cream hover:text-examprep-kaabe-maroon"
                  >
                    <Link href="/change-password">
                      <BookOpen className="mr-2 h-3.5 w-3.5" />
                      Change Password
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-red-500 hover:bg-red-50 mt-1"
                  >
                    <Link href="/logout">
                      <LogOut className="mr-2 h-3.5 w-3.5" />
                      Log out
                    </Link>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetContent
          side="left"
          className="w-[85vw] max-w-[300px] bg-examprep-kaabe-beige border-r border-examprep-kaabe-light-maroon/20 p-0"
        >
          <div className="flex flex-col h-full">
            <SheetHeader className="p-4 border-b border-examprep-kaabe-light-maroon/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 relative">
                    <Image
                      src="/kaabe-logo.png"
                      alt="Kaabe"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <SheetTitle className="font-bold text-xl bg-kaabe-gradient bg-clip-text text-transparent m-0">
                    Kaabe
                  </SheetTitle>
                </div>
                <SheetClose className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-examprep-kaabe-cream/50">
                  <X className="h-4 w-4 text-examprep-kaabe-brown" />
                </SheetClose>
              </div>

              {is_pro ? (
                <div className="flex items-center gap-2 text-xs px-3 py-2 bg-examprep-kaabe-cream/60 rounded-lg border border-examprep-kaabe-light-maroon/20">
                  <Award className="w-4 h-4 text-examprep-kaabe-maroon" />
                  <div>
                    <p className="font-semibold text-examprep-kaabe-maroon">
                      Pro Member
                    </p>
                    <p className="text-examprep-kaabe-light-brown">
                      {pro_expires_in} days remaining
                    </p>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full border-examprep-kaabe-maroon text-examprep-kaabe-maroon hover:bg-examprep-kaabe-maroon hover:text-white"
                  onClick={() => {
                    setShowMobileMenu(false);
                    setShowPro(true);
                  }}
                >
                  <Zap className="mr-1 h-4 w-4" />
                  Upgrade to Pro
                </Button>
              )}
            </SheetHeader>

            <div className="flex-1 p-4 space-y-0.5 overflow-y-auto">
              <Button
                variant="ghost"
                className="w-full justify-start text-examprep-kaabe-brown hover:bg-examprep-kaabe-cream hover:text-examprep-kaabe-maroon"
                asChild
              >
                <Link href="/" onClick={() => setShowMobileMenu(false)}>
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-examprep-kaabe-brown hover:bg-examprep-kaabe-cream hover:text-examprep-kaabe-maroon"
                asChild
              >
                <Link href="/subjects" onClick={() => setShowMobileMenu(false)}>
                  <BookOpenCheck className="mr-2 h-4 w-4" />
                  Subjects
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-examprep-kaabe-brown hover:bg-examprep-kaabe-cream hover:text-examprep-kaabe-maroon"
                asChild
              >
                <Link href="/practice" onClick={() => setShowMobileMenu(false)}>
                  <Target className="mr-2 h-4 w-4" />
                  Practice
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-examprep-kaabe-brown hover:bg-examprep-kaabe-cream hover:text-examprep-kaabe-maroon"
                asChild
              >
                <Link href="/progress" onClick={() => setShowMobileMenu(false)}>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Progress
                </Link>
              </Button>

              <Separator className="my-4 bg-examprep-kaabe-light-maroon/10" />

              <Button
                variant="ghost"
                className="w-full justify-start text-examprep-kaabe-brown hover:bg-examprep-kaabe-cream hover:text-examprep-kaabe-maroon"
                asChild
              >
                <Link
                  href="/notifications"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <div className="relative mr-2">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
                        {unreadCount > 9 ? "9" : unreadCount}
                      </span>
                    )}
                  </div>
                  Notifications
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-examprep-kaabe-brown hover:bg-examprep-kaabe-cream hover:text-examprep-kaabe-maroon"
                asChild
              >
                <Link href="/profile" onClick={() => setShowMobileMenu(false)}>
                  <User className="mr-2 h-4 w-4" />
                  My Profile
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-examprep-kaabe-brown hover:bg-examprep-kaabe-cream hover:text-examprep-kaabe-maroon"
                asChild
              >
                <Link
                  href="/change-password"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Change Password
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:bg-red-50"
                asChild
              >
                <Link href="/logout" onClick={() => setShowMobileMenu(false)}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Link>
              </Button>
            </div>

            <div className="p-4 border-t border-examprep-kaabe-light-maroon/20">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border border-examprep-kaabe-light-maroon/30">
                  {fullProfilePictureUrl ? (
                    <AvatarImage
                      src={fullProfilePictureUrl || "/placeholder.svg"}
                      alt={displayName}
                      onError={(e) => {
                        console.error(
                          "Failed to load mobile profile picture:",
                          fullProfilePictureUrl
                        );
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : null}
                  <AvatarFallback className="bg-examprep-kaabe-cream text-examprep-kaabe-maroon text-xs">
                    {displayName ? displayName.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-examprep-kaabe-brown truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-examprep-kaabe-light-brown truncate">
                    {displaySchool}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <div className="relative">
                    <Bell className="h-4 w-4 text-examprep-kaabe-light-brown" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
                      {unreadCount > 9 ? "9" : unreadCount}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main */}
      <main className="flex-1 container py-6 md:py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start gap-4 mb-8 animate-fade-in">
          <div className="w-full md:w-2/3">
            <h1 className="text-2xl md:text-3xl font-bold text-examprep-kaabe-brown mb-2">
              Welcome back, {displayName.split(" ")[0]}!
            </h1>
            <p className="text-examprep-kaabe-light-brown">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="w-full md:w-1/3 flex justify-start md:justify-end mt-4 md:mt-0">
            <Button
              className="w-full sm:w-auto bg-examprep-kaabe-maroon hover:bg-examprep-kaabe-brown text-white shadow-sm transition-all"
              asChild
            >
              <Link href="/mix-quizzes">
                <Zap className="mr-2 h-4 w-4" />
                Start Mix Quizzes
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile Tab Selection */}
        <div className="md:hidden mb-6">
          <select
            className="w-full p-2 rounded-lg bg-white/50 backdrop-blur border border-examprep-kaabe-light-maroon/20 text-examprep-kaabe-brown focus:outline-none focus:ring-2 focus:ring-examprep-kaabe-maroon"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            <option value="statistics">Statistics</option>
            <option value="leaderboard">Leaderboard</option>
            <option value="insights">Insights</option>
          </select>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          {/* tab bar - desktop only */}
          <div className="hidden md:flex items-center justify-between">
            <TabsList className="bg-white/50 backdrop-blur border border-examprep-kaabe-light-maroon/20 p-1 rounded-lg">
              <TabsTrigger
                value="statistics"
                className="flex gap-2 data-[state=active]:bg-examprep-kaabe-maroon data-[state=active]:text-white rounded-md"
              >
                <ChartIcon className="h-4 w-4" /> Statistics
              </TabsTrigger>
              <TabsTrigger
                value="leaderboard"
                className="flex gap-2 data-[state=active]:bg-examprep-kaabe-maroon data-[state=active]:text-white rounded-md"
              >
                <Award className="h-4 w-4" /> Leaderboard
              </TabsTrigger>
              <TabsTrigger
                value="insights"
                className="flex gap-2 data-[state=active]:bg-examprep-kaabe-maroon data-[state=active]:text-white rounded-md"
              >
                <BrainCircuit className="h-4 w-4" /> Insights
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ───────── Statistics ───────── */}
          <TabsContent value="statistics" className="space-y-8 mt-0 md:mt-8">
            {/* KPI cards */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {/* total */}
              <Card className="overflow-hidden relative border-none shadow-custom bg-gradient-to-br from-white/70 to-examprep-kaabe-cream/90 backdrop-blur animate-slide-in-left">
                <div className="absolute inset-0 bg-kaabe-gradient-light" />
                <CardHeader className="relative pb-2 px-4 pt-4">
                  <CardTitle className="text-sm text-examprep-kaabe-light-brown font-medium flex items-center">
                    <BookOpen className="mr-2 h-4 w-4 text-examprep-kaabe-maroon opacity-70" />
                    Total Questions
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative pt-0 px-4 pb-4">
                  <div className="text-3xl font-bold text-examprep-kaabe-brown">
                    {total_questions}
                  </div>
                  <p className="text-xs text-examprep-kaabe-light-brown mt-1">
                    {is_pro
                      ? "Full access unlocked"
                      : `Free plan includes ${total_questions} questions`}
                  </p>
                </CardContent>
              </Card>

              {/* completed */}
              <Card className="overflow-hidden relative border-none shadow-custom bg-gradient-to-br from-white/70 to-examprep-kaabe-cream/90 backdrop-blur animate-scale-in">
                <div className="absolute inset-0 bg-kaabe-gradient-light" />
                <CardHeader className="relative pb-2 px-4 pt-4">
                  <CardTitle className="text-sm text-examprep-kaabe-light-brown font-medium flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-examprep-kaabe-maroon opacity-70" />
                    Completed Questions
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative pt-0 px-4 pb-4">
                  <div className="text-3xl font-bold text-examprep-kaabe-brown">
                    {completed_questions}
                  </div>
                  <Progress
                    value={completedPercent}
                    className="mt-2 h-2 bg-examprep-kaabe-cream progress-fill-maroon"
                  />
                  <p className="text-xs text-right text-examprep-kaabe-light-brown mt-1">
                    {completedPercent.toFixed(0)}% complete
                  </p>
                </CardContent>
              </Card>

              {/* accuracy */}
              <Card className="overflow-hidden relative border-none shadow-custom bg-gradient-to-br from-white/70 to-examprep-kaabe-cream/90 backdrop-blur animate-slide-in-right sm:col-span-2 md:col-span-1">
                <div className="absolute inset-0 bg-kaabe-gradient-light" />
                <CardHeader className="relative pb-2 px-4 pt-4">
                  <CardTitle className="text-sm text-examprep-kaabe-light-brown font-medium flex items-center">
                    <Target className="mr-2 h-4 w-4 text-examprep-kaabe-maroon opacity-70" />
                    Accuracy Rate
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative pt-0 px-4 pb-4">
                  <div className="text-3xl font-bold text-examprep-kaabe-brown">
                    {accuracy}%
                  </div>
                  <p className="text-xs text-examprep-kaabe-light-brown mt-2 italic">
                    {accuracy === 0
                      ? "Complete quizzes to see your accuracy"
                      : accuracy > 80
                      ? "Excellent job! Keep it up!"
                      : "Great job! Keep practicing."}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Progress Chart */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              {/* Weekly Performance Chart */}
              <Card className="border-none shadow-custom graph-card animate-fade-in">
                <CardHeader className="pb-2 px-4 pt-4">
                  <CardTitle className="text-lg text-examprep-kaabe-maroon flex items-center gap-2">
                    <ReLineChart className="h-5 w-5" />
                    Weekly Performance
                  </CardTitle>
                  <CardDescription>
                    Questions completed and accuracy by day
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2 px-0 pb-4 h-[300px] sm:h-[350px] md:h-[300px] overflow-hidden">
                  <div className="w-full h-full pl-0 pr-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={weeklyProgress}
                        margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(94, 71, 67, 0.1)"
                        />
                        <XAxis
                          dataKey="day"
                          tick={{ fill: "#5e4743", fontSize: "10px" }}
                          tickLine={{ stroke: "#5e4743" }}
                          axisLine={{ stroke: "#5e4743" }}
                        />
                        <YAxis
                          yAxisId="left"
                          tick={{ fill: "#5e4743", fontSize: "10px" }}
                          tickLine={{ stroke: "#5e4743" }}
                          axisLine={{ stroke: "#5e4743" }}
                          width={30}
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          domain={[0, 100]}
                          unit="%"
                          tick={{ fill: "#5e4743", fontSize: "10px" }}
                          tickLine={{ stroke: "#5e4743" }}
                          axisLine={{ stroke: "#5e4743" }}
                          width={40}
                        />
                        <ReTooltip
                          wrapperClassName="chart-tooltip"
                          labelClassName="chart-tooltip-label"
                          itemClassName="chart-tooltip-value"
                          contentStyle={{ fontSize: "12px" }}
                        />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="questions"
                          name="Questions"
                          stroke="#8d2c2c"
                          strokeWidth={2}
                          dot={{ r: 3, fill: "#8d2c2c", strokeWidth: 1 }}
                          activeDot={{
                            r: 5,
                            fill: "#8d2c2c",
                            stroke: "#f5f2ea",
                            strokeWidth: 2,
                          }}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="accuracy"
                          name="Accuracy"
                          stroke="#5e4743"
                          strokeWidth={2}
                          dot={{ r: 3, fill: "#5e4743", strokeWidth: 1 }}
                          activeDot={{
                            r: 5,
                            fill: "#5e4743",
                            stroke: "#f5f2ea",
                            strokeWidth: 2,
                          }}
                          unit="%"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Subject Progress Bar Chart */}
              <Card className="border-none shadow-custom graph-card animate-fade-in">
                <CardHeader className="pb-2 px-4 pt-4">
                  <CardTitle className="text-lg text-examprep-kaabe-maroon flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Subject Completion
                  </CardTitle>
                  <CardDescription>
                    Your progress across all subjects
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2 px-0 pb-4 h-[300px] sm:h-[350px] md:h-[300px] overflow-hidden">
                  {subjects.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-examprep-kaabe-light-brown">
                      <BarChart3 className="h-10 w-10 mb-2 opacity-30" />
                      <p className="text-sm">No data available yet</p>
                      <p className="text-xs mt-1">
                        Complete quizzes to see your progress
                      </p>
                    </div>
                  ) : (
                    <div className="w-full h-full pl-0 pr-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <ReBarChart
                          data={subjects.slice(0, 5)} // Limit to 5 subjects for better mobile display
                          layout="vertical"
                          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            horizontal={true}
                            stroke="rgba(94, 71, 67, 0.1)"
                          />
                          <XAxis
                            type="number"
                            domain={[0, 100]}
                            unit="%"
                            tick={{ fill: "#5e4743", fontSize: "10px" }}
                            tickLine={{ stroke: "#5e4743" }}
                            axisLine={{ stroke: "#5e4743" }}
                          />
                          <YAxis
                            dataKey="name"
                            type="category"
                            width={80}
                            tick={{ fill: "#5e4743", fontSize: "10px" }}
                            tickLine={false}
                            axisLine={{ stroke: "#5e4743" }}
                            tickFormatter={(value) =>
                              value.length > 10
                                ? `${value.substring(0, 10)}...`
                                : value
                            }
                          />
                          <ReTooltip
                            wrapperClassName="chart-tooltip"
                            labelClassName="chart-tooltip-label"
                            formatter={(value: any, name: string) => [
                              `${value}%`,
                              name,
                            ]}
                            contentStyle={{ fontSize: "12px" }}
                          />
                          <Bar
                            dataKey="progress"
                            name="Completion"
                            fill="#8d2c2c"
                            radius={[0, 4, 4, 0]}
                            barSize={16}
                          >
                            {subjects.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Bar>
                        </ReBarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Study Time Distribution */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              {/* Study Time Pie Chart */}
              <Card className="border-none shadow-custom graph-card animate-fade-in">
                <CardHeader className="pb-2 px-4 pt-4">
                  <CardTitle className="text-lg text-examprep-kaabe-maroon flex items-center gap-2">
                    <RePieChart className="h-5 w-5" />
                    Study Time Distribution
                  </CardTitle>
                  <CardDescription>Time spent on each subject</CardDescription>
                </CardHeader>
                <CardContent className="pt-2 px-0 pb-4 h-[300px] sm:h-[350px] md:h-[300px] overflow-hidden">
                  {studyTimeData.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-examprep-kaabe-light-brown">
                      <Clock className="h-10 w-10 mb-2 opacity-30" />
                      <p className="text-sm">No study time data yet</p>
                      <p className="text-xs mt-1">
                        Complete more questions to see your distribution
                      </p>
                    </div>
                  ) : (
                    <div className="w-full h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={studyTimeData}
                            cx="50%"
                            cy="45%"
                            labelLine={false}
                            outerRadius={chartHeight > 250 ? 80 : 60}
                            innerRadius={chartHeight > 250 ? 30 : 20}
                            fill="#8d2c2c"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) =>
                              chartHeight > 250
                                ? `${
                                    name.length > 8
                                      ? `${name.substring(0, 8)}...`
                                      : name
                                  }: ${(percent * 100).toFixed(0)}%`
                                : `${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {studyTimeData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <ReTooltip
                            wrapperClassName="chart-tooltip"
                            formatter={(value: any, name: string) => [
                              `${value} minutes`,
                              name,
                            ]}
                            contentStyle={{ fontSize: "12px" }}
                          />
                          <Legend
                            verticalAlign="bottom"
                            height={36}
                            formatter={(value, entry, index) => (
                              <span
                                style={{
                                  color: COLORS[index % COLORS.length],
                                  fontSize: "11px",
                                }}
                              >
                                {value.length > 12
                                  ? `${value.substring(0, 12)}...`
                                  : value}
                              </span>
                            )}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Skill Radar Chart */}
              <Card className="border-none shadow-custom graph-card animate-fade-in">
                <CardHeader className="pb-2 px-4 pt-4">
                  <CardTitle className="text-lg text-examprep-kaabe-maroon flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Skill Mastery
                  </CardTitle>
                  <CardDescription>
                    Your proficiency across key areas
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2 px-0 pb-4 h-[300px] sm:h-[350px] md:h-[300px] overflow-hidden">
                  {subjects.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-examprep-kaabe-light-brown">
                      <Target className="h-10 w-10 mb-2 opacity-30" />
                      <p className="text-sm">No skill data available yet</p>
                      <p className="text-xs mt-1">
                        Complete more quizzes to see your skills
                      </p>
                    </div>
                  ) : (
                    <div className="w-full h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart
                          cx="50%"
                          cy="50%"
                          outerRadius="65%"
                          data={subjects.slice(0, 6)} // Limit to 6 subjects for better display
                        >
                          <PolarGrid stroke="rgba(94, 71, 67, 0.2)" />
                          <PolarAngleAxis
                            dataKey="name"
                            tick={{
                              fill: "#5e4743",
                              fontSize: chartHeight > 250 ? 11 : 9,
                            }}
                            tickFormatter={(value) =>
                              value.length > 8
                                ? `${value.substring(0, 8)}...`
                                : value
                            }
                          />
                          <PolarRadiusAxis
                            angle={30}
                            domain={[0, 100]}
                            tick={{
                              fill: "#5e4743",
                              fontSize: chartHeight > 250 ? 10 : 8,
                            }}
                          />
                          <Radar
                            name="Mastery Level"
                            dataKey="progress"
                            stroke="#8d2c2c"
                            fill="#ad4c4c"
                            fillOpacity={0.6}
                          />
                          <ReTooltip
                            wrapperClassName="chart-tooltip"
                            formatter={(value: any) => [
                              `${value}%`,
                              "Mastery Level",
                            ]}
                            contentStyle={{ fontSize: "12px" }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* subjects grid */}
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <h2 className="text-xl font-bold text-examprep-kaabe-maroon flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Study Subjects
                </h2>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-examprep-kaabe-brown border-examprep-kaabe-brown hover:bg-examprep-kaabe-brown hover:text-white"
                  asChild
                >
                  <Link href="/subjects">View All Subjects</Link>
                </Button>
              </div>

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {subjects.map((s) => (
                  <SubjectCard
                    key={s.id}
                    subject={{
                      id: s.id,
                      name: s.name,
                      icon: s.icon,
                      questions: s.questions,
                    }}
                    isPro={is_pro}
                    progress={s.progress}
                    onUpgradeClick={() => setShowPro(true)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* ───────── Leaderboard ───────── */}
          <TabsContent value="leaderboard" className="mt-0 md:mt-8">
            <Card className="border-none shadow-custom graph-card overflow-hidden relative animate-scale-in">
              <div className="absolute inset-0 bg-kaabe-gradient-light" />
              <CardHeader className="relative px-4 pt-4 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl sm:text-2xl text-examprep-kaabe-maroon flex items-center gap-2">
                      <Award className="h-5 sm:h-6 w-5 sm:w-6" />
                      Top Students
                    </CardTitle>
                    <CardDescription>
                      The highest performing students in your network
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <Badge className="bg-examprep-kaabe-maroon hover:bg-examprep-kaabe-brown text-xs sm:text-sm">
                      This Week
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-examprep-kaabe-light-brown text-examprep-kaabe-light-brown hover:text-examprep-kaabe-brown hover:border-examprep-kaabe-brown text-xs sm:text-sm"
                    >
                      All Time
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative px-4 py-4">
                {leaderboard.length === 0 ? (
                  <div className="py-8 sm:py-12 text-center">
                    <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-examprep-kaabe-cream mb-4">
                      <Award className="h-8 w-8 sm:h-10 sm:w-10 text-examprep-kaabe-maroon opacity-70" />
                    </div>
                    <p className="text-examprep-kaabe-brown font-medium">
                      No scores recorded yet.
                    </p>
                    <p className="text-sm text-examprep-kaabe-light-brown mt-2">
                      Be the first on the leaderboard!
                    </p>
                    <Button
                      className="mt-4 bg-examprep-kaabe-maroon hover:bg-examprep-kaabe-brown text-white transition-colors"
                      asChild
                    >
                      <Link href="/practice">Start Practicing</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {leaderboard.map((stu, idx) => (
                      <div
                        key={stu.id}
                        className={`flex items-center justify-between p-3 sm:p-4 rounded-lg transition-all animate-fade-in
                          ${
                            idx === 0
                              ? "bg-gradient-to-r from-yellow-50 to-yellow-50/30 border border-yellow-200 shadow-sm"
                              : idx === 1
                              ? "bg-gradient-to-r from-gray-50 to-gray-50/30 border border-gray-200"
                              : idx === 2
                              ? "bg-gradient-to-r from-amber-50 to-amber-50/30 border border-amber-200"
                              : "border border-examprep-kaabe-light-brown/10 hover:border-examprep-kaabe-light-brown/30 bg-white/50"
                          }`}
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="relative">
                            <Avatar
                              className={`h-10 w-10 sm:h-12 sm:w-12 ${
                                idx === 0
                                  ? "ring-2 ring-yellow-300 shadow-sm"
                                  : idx === 1
                                  ? "ring-1 ring-gray-300"
                                  : idx === 2
                                  ? "ring-1 ring-amber-300"
                                  : ""
                              }`}
                            >
                              <AvatarImage
                                src={
                                  getProfilePictureUrl(stu.profile_picture) ||
                                  "/placeholder.svg" ||
                                  "/placeholder.svg"
                                }
                                alt={stu.name}
                              />
                              <AvatarFallback
                                className={`font-bold text-base sm:text-lg ${
                                  idx === 0
                                    ? "bg-gradient-to-br from-yellow-200 to-yellow-400 text-yellow-800"
                                    : idx === 1
                                    ? "bg-gradient-to-br from-gray-200 to-gray-400 text-gray-800"
                                    : idx === 2
                                    ? "bg-gradient-to-br from-amber-200 to-amber-400 text-amber-800"
                                    : "bg-examprep-kaabe-cream text-examprep-kaabe-brown"
                                }`}
                              >
                                {stu.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                idx === 0
                                  ? "bg-gradient-to-br from-yellow-200 to-yellow-400 text-yellow-800 ring-2 ring-yellow-300"
                                  : idx === 1
                                  ? "bg-gradient-to-br from-gray-200 to-gray-400 text-gray-800 ring-1 ring-gray-300"
                                  : idx === 2
                                  ? "bg-gradient-to-br from-amber-200 to-amber-400 text-amber-800 ring-1 ring-amber-300"
                                  : "bg-examprep-kaabe-cream text-examprep-kaabe-brown"
                              }`}
                            >
                              {idx + 1}
                            </div>
                          </div>
                          <div>
                            <p
                              className={`font-medium ${
                                idx === 0
                                  ? "text-sm sm:text-base text-yellow-800"
                                  : idx === 1
                                  ? "text-xs sm:text-sm text-gray-800"
                                  : idx === 2
                                  ? "text-xs sm:text-sm text-amber-800"
                                  : "text-xs sm:text-sm text-examprep-kaabe-brown"
                              }`}
                            >
                              {stu.name}
                            </p>
                            <p
                              className={`text-xs ${
                                idx === 0
                                  ? "text-yellow-700"
                                  : idx === 1
                                  ? "text-gray-600"
                                  : idx === 2
                                  ? "text-amber-700"
                                  : "text-examprep-kaabe-light-brown"
                              }`}
                            >
                              {stu.school}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="text-right">
                            <p
                              className={`font-bold ${
                                idx === 0
                                  ? "text-base sm:text-lg text-yellow-700"
                                  : idx === 1
                                  ? "text-sm sm:text-base text-gray-700"
                                  : idx === 2
                                  ? "text-sm sm:text-base text-amber-700"
                                  : "text-sm text-examprep-kaabe-brown"
                              }`}
                            >
                              {stu.points.toLocaleString()}
                            </p>
                            <p className="text-xs text-examprep-kaabe-light-brown">
                              points
                            </p>
                          </div>

                          <div
                            className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full
                              ${
                                idx === 0
                                  ? "bg-yellow-100"
                                  : idx === 1
                                  ? "bg-gray-100"
                                  : idx === 2
                                  ? "bg-amber-100"
                                  : "bg-examprep-kaabe-cream/50"
                              }`}
                          >
                            <Award
                              className={`h-4 w-4 sm:h-5 sm:w-5 ${
                                idx === 0
                                  ? "text-yellow-600"
                                  : idx === 1
                                  ? "text-gray-600"
                                  : idx === 2
                                  ? "text-amber-600"
                                  : "text-examprep-kaabe-light-maroon"
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="relative border-t border-examprep-kaabe-light-maroon/10 bg-white/50 px-4 py-4">
                <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-xs sm:text-sm text-examprep-kaabe-light-brown text-center sm:text-left">
                    {is_pro
                      ? "Keep practicing to climb the leaderboard and earn rewards!"
                      : "Upgrade to Pro for exclusive rewards and competitions."}
                  </p>
                  {!is_pro && (
                    <Button
                      size="sm"
                      className="w-full sm:w-auto bg-examprep-kaabe-maroon hover:bg-examprep-kaabe-brown text-white transition-colors"
                      onClick={() => setShowPro(true)}
                    >
                      <Zap className="mr-1 h-4 w-4" />
                      Upgrade to Pro
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* ───────── Insights Tab ───────── */}
          <TabsContent value="insights" className="mt-0 md:mt-8">
            <div className="grid gap-6 grid-cols-1">
              {/* Weekly Activity Area Chart */}
              <Card className="border-none shadow-custom graph-card animate-fade-in">
                <CardHeader className="pb-2 px-4 pt-4">
                  <CardTitle className="text-lg text-examprep-kaabe-maroon flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Weekly Study Activity
                  </CardTitle>
                  <CardDescription>
                    Your study patterns over the past week
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2 px-0 pb-4 h-[250px] sm:h-[300px] overflow-hidden">
                  <div className="w-full h-full pl-0 pr-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={weeklyProgress}
                        margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient
                            id="colorQuestions"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#8d2c2c"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#8d2c2c"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(94, 71, 67, 0.1)"
                        />
                        <XAxis
                          dataKey="day"
                          tick={{ fill: "#5e4743", fontSize: "10px" }}
                          tickLine={{ stroke: "#5e4743" }}
                          axisLine={{ stroke: "#5e4743" }}
                        />
                        <YAxis
                          tick={{ fill: "#5e4743", fontSize: "10px" }}
                          tickLine={{ stroke: "#5e4743" }}
                          axisLine={{ stroke: "#5e4743" }}
                          width={30}
                        />
                        <ReTooltip
                          wrapperClassName="chart-tooltip"
                          labelClassName="chart-tooltip-label"
                          contentStyle={{ fontSize: "12px" }}
                        />
                        <Area
                          type="monotone"
                          dataKey="questions"
                          stroke="#8d2c2c"
                          fillOpacity={1}
                          fill="url(#colorQuestions)"
                          name="Questions Completed"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {/* Personalized Recommendations */}
                <Card className="border-none shadow-custom bg-gradient-to-br from-white/70 to-examprep-kaabe-cream/90 backdrop-blur animate-slide-in-left">
                  <CardHeader className="px-4 pt-4 pb-3">
                    <CardTitle className="text-lg text-examprep-kaabe-maroon flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Recommended Focus Areas
                    </CardTitle>
                    <CardDescription>
                      Based on your performance data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 py-2">
                    <div className="space-y-3">
                      {subjects.length > 0 ? (
                        subjects
                          .sort((a, b) => a.progress - b.progress)
                          .slice(0, 3)
                          .map((subject, index) => (
                            <div
                              key={index}
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg border border-examprep-kaabe-light-maroon/10 bg-white/50"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-examprep-kaabe-cream flex items-center justify-center">
                                  <span className="text-examprep-kaabe-maroon font-medium">
                                    {index + 1}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-examprep-kaabe-brown">
                                    {subject.name}
                                  </p>
                                  <p className="text-xs text-examprep-kaabe-light-brown">
                                    Current mastery: {subject.progress}%
                                  </p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-2 sm:mt-0 border-examprep-kaabe-maroon text-examprep-kaabe-maroon hover:bg-examprep-kaabe-maroon hover:text-white"
                                asChild
                              >
                                <Link href={`/subjects/${subject.id}`}>
                                  Study
                                </Link>
                              </Button>
                            </div>
                          ))
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 rounded-full bg-examprep-kaabe-cream mx-auto flex items-center justify-center mb-4">
                            <Target className="h-8 w-8 text-examprep-kaabe-maroon opacity-70" />
                          </div>
                          <p className="text-examprep-kaabe-brown font-medium mb-2">
                            No recommendations yet
                          </p>
                          <p className="text-sm text-examprep-kaabe-light-brown">
                            Complete more quizzes to get personalized
                            recommendations
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-examprep-kaabe-light-maroon/10 bg-white/50 px-4 py-3">
                    <Button
                      variant="link"
                      className="text-examprep-kaabe-maroon hover:text-examprep-kaabe-brown p-0"
                      asChild
                    >
                      <Link href="/insights">
                        View detailed analysis
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                {/* Study Streak */}
                <Card className="border-none shadow-custom bg-gradient-to-br from-white/70 to-examprep-kaabe-cream/90 backdrop-blur animate-slide-in-right">
                  <CardHeader className="px-4 pt-4 pb-3">
                    <CardTitle className="text-lg text-examprep-kaabe-maroon flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Study Streak
                    </CardTitle>
                    <CardDescription>Your learning consistency</CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 py-2">
                    {/* Consistency tracking */}
                    <div className="flex flex-col items-center justify-center py-4">
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-3">
                        <div className="absolute inset-0 rounded-full bg-examprep-kaabe-light-maroon/10 flex items-center justify-center">
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/80 flex items-center justify-center">
                            <div className="text-center">
                              <p className="text-3xl sm:text-4xl font-bold text-examprep-kaabe-maroon">
                                5
                              </p>
                              <p className="text-xs text-examprep-kaabe-light-brown">
                                days
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="absolute top-0 right-0">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-examprep-kaabe-light-maroon flex items-center justify-center">
                            <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                          </div>
                        </div>
                      </div>

                      <h3 className="text-base sm:text-lg font-semibold text-examprep-kaabe-brown mb-1">
                        Current Streak
                      </h3>
                      <p className="text-sm text-examprep-kaabe-light-brown mb-4">
                        Keep it going!
                      </p>

                      <div className="grid grid-cols-7 gap-1 w-full max-w-xs">
                        {Array.from({ length: 7 }).map((_, i) => (
                          <div
                            key={i}
                            className={`h-7 sm:h-8 rounded-md flex items-center justify-center text-xs font-medium ${
                              i < 5
                                ? "bg-examprep-kaabe-maroon text-white"
                                : "bg-examprep-kaabe-cream/50 text-examprep-kaabe-light-brown border border-dashed border-examprep-kaabe-light-brown/30"
                            }`}
                          >
                            {["M", "T", "W", "T", "F", "S", "S"][i]}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-examprep-kaabe-light-maroon/10 bg-white/50 px-4 py-3">
                    <div className="w-full">
                      <p className="text-xs text-examprep-kaabe-light-brown text-center">
                        Complete at least 5 quizzes daily to maintain your
                        streak
                      </p>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Pro modal */}
      <ProUpgradeModal
        open={showPro}
        onOpenChange={setShowPro}
        onUpgrade={handleUpgraded}
      />
    </div>
  );
}
