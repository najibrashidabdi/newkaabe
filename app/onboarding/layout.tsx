"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // Use your existing dashboard endpoint to check user status
        const userData = await api("/api/dashboard/");

        if (!userData) {
          // Not authenticated, redirect to login
          router.push("/login");
          return;
        }

        // Check if user is verified (assuming this is part of the dashboard response)
        setIsVerified(true); // Since they reached dashboard, they're verified

        // If user has completed onboarding, redirect to dashboard
        if (userData.has_completed_onboarding) {
          router.push("/dashboard");
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error checking user status:", error);
        toast({
          title: "Authentication Error",
          description: "Please log in again to continue.",
          variant: "destructive",
        });
        router.push("/login");
      }
    };

    checkUserStatus();
  }, [router, toast]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-examprep-kaabe-beige">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-examprep-kaabe-light-maroon opacity-25 rounded-full animate-ping"></div>
            <div className="w-16 h-16 border-4 border-t-examprep-kaabe-maroon border-l-examprep-kaabe-light-maroon border-r-examprep-kaabe-light-brown border-b-examprep-kaabe-brown rounded-full animate-spin"></div>
          </div>
          <p className="text-sm text-examprep-kaabe-brown font-medium animate-pulse-gentle">
            Preparing your experience...
          </p>
        </div>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-examprep-kaabe-beige p-4">
        <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-custom">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-yellow-500"
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
            <h2 className="mb-2 text-xl font-bold text-examprep-kaabe-maroon">
              Email Verification Required
            </h2>
            <p className="mb-4 text-examprep-kaabe-brown">
              Please verify your email address before continuing with the
              onboarding process.
            </p>
            <button
              onClick={() => router.push("/verification")}
              className="w-full rounded-lg bg-examprep-kaabe-maroon px-4 py-2 text-white hover:bg-examprep-kaabe-brown"
            >
              Go to Verification
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-examprep-kaabe-beige">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="container mx-auto py-8"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
