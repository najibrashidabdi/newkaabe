"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bell, User, LogOut, Settings, Menu } from "lucide-react";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";

interface UserData {
  name: string;
  username: string;
  profile_picture: string | null;
  is_pro: boolean;
  unread_notifications: number;
}

export function DashboardHeader() {
  const router = useRouter();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await api<UserData>("/api/auth/me/");
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await api("/api/auth/logout/", "POST");
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-examprep-kaabe-light-maroon/20 bg-examprep-kaabe-beige/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-bold text-xl"
        >
          <div className="relative h-8 w-8">
            <Image
              src="/kaabe-logo.png"
              alt="Kaabe Logo"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain"
            />
          </div>
          <span className="bg-gradient-to-r from-[#3e2723] to-[#8d2c2c] bg-clip-text text-transparent">
            Kaabe
          </span>
        </Link>

        {/* Mobile menu */}
        <div className="flex md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 py-4">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 text-examprep-kaabe-brown hover:bg-examprep-kaabe-cream/30 hover:text-examprep-kaabe-maroon rounded-md"
                >
                  Dashboard
                </Link>
                <Link
                  href="/notifications"
                  className="flex items-center gap-2 px-4 py-2 text-examprep-kaabe-brown hover:bg-examprep-kaabe-cream/30 hover:text-examprep-kaabe-maroon rounded-md"
                >
                  Notifications
                  {userData?.unread_notifications ? (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-examprep-kaabe-maroon text-xs text-white">
                      {userData.unread_notifications}
                    </span>
                  ) : null}
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 px-4 py-2 text-examprep-kaabe-brown hover:bg-examprep-kaabe-cream/30 hover:text-examprep-kaabe-maroon rounded-md"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-examprep-kaabe-brown hover:bg-examprep-kaabe-cream/30 hover:text-examprep-kaabe-maroon rounded-md"
                >
                  Logout
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-4 md:flex">
          <Link
            href="/notifications"
            className="relative rounded-full p-2 text-examprep-kaabe-brown hover:bg-examprep-kaabe-cream/30 hover:text-examprep-kaabe-maroon"
          >
            <Bell className="h-5 w-5" />
            {userData?.unread_notifications ? (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-examprep-kaabe-maroon text-[10px] text-white">
                {userData.unread_notifications}
              </span>
            ) : null}
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                {userData?.profile_picture ? (
                  <Image
                    src={userData.profile_picture || "/placeholder.svg"}
                    alt="Profile"
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-examprep-kaabe-light-maroon/10">
                    <User className="h-4 w-4 text-examprep-kaabe-maroon" />
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex items-center gap-2 p-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-examprep-kaabe-light-maroon/10">
                  {userData?.profile_picture ? (
                    <Image
                      src={userData.profile_picture || "/placeholder.svg"}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-4 w-4 text-examprep-kaabe-maroon" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {userData?.name || userData?.username || "User"}
                  </span>
                  {userData?.is_pro && (
                    <span className="text-xs text-examprep-kaabe-maroon">
                      Pro Member
                    </span>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}
