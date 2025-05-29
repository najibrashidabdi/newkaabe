"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Loader2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function VerificationPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Get email from localStorage or sessionStorage
    const pendingEmail =
      localStorage.getItem("pending_email") ||
      JSON.parse(sessionStorage.getItem("registrationData") || "{}")?.email ||
      "";

    if (pendingEmail) {
      setEmail(pendingEmail);
    } else {
      // If no email found, redirect to register
      toast({
        title: "No pending verification",
        description: "Please register first.",
        variant: "destructive",
      });
      router.push("/register");
    }
  }, [router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("🔍 Form submitted with:", { email, code });

    if (!email || !code) {
      toast({
        title: "Missing information",
        description: "Please enter the verification code.",
        variant: "destructive",
      });
      return;
    }

    if (code.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Verification code must be 6 digits.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("🚀 Verifying email with code:", { email, code });
      console.log("🌐 API URL:", process.env.NEXT_PUBLIC_API_URL);

      const response = await api("/api/auth/verify/", "POST", {
        email: email.trim().toLowerCase(),
        code: code.trim(),
      });

      console.log("✅ Verification successful:", response);

      // Store tokens
      if (response.access && response.refresh) {
        localStorage.setItem("access_token", response.access);
        localStorage.setItem("refresh_token", response.refresh);
        console.log("🔑 Tokens stored successfully");
      } else {
        console.warn("⚠️ No tokens received in response");
      }

      // Clear pending email
      localStorage.removeItem("pending_email");
      sessionStorage.removeItem("registrationData");

      toast({
        title: "Email verified! 🎉",
        description: "Welcome to Kaabe! Let's set up your profile...",
      });

      // Redirect to onboarding instead of dashboard
      console.log("🔄 Redirecting to onboarding...");
      setTimeout(() => {
        router.push("/onboarding/profile");
      }, 1500);
    } catch (error: any) {
      console.error("💥 Verification failed:", error);
      console.error("💥 Error details:", {
        message: error.message,
        status: error.status,
        data: error.data,
      });

      let errorMessage = "Verification failed. Please try again.";

      if (error.status === 400) {
        if (error.message.includes("Invalid verification code")) {
          errorMessage =
            "Invalid verification code. Please check and try again.";
        } else if (error.message.includes("expired")) {
          errorMessage =
            "Verification code has expired. Please request a new one.";
        } else if (error.message.includes("already verified")) {
          errorMessage = "This email is already verified. You can log in now.";
          setTimeout(() => router.push("/login"), 2000);
        }
      } else if (error.status === 404) {
        errorMessage = "User not found. Please register again.";
        setTimeout(() => router.push("/register"), 2000);
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Verification failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast({
        title: "No email found",
        description: "Please register again.",
        variant: "destructive",
      });
      return;
    }

    setIsResending(true);

    try {
      console.log("🔄 Resending verification code to:", email);

      await api("/api/auth/resend-verification/", "POST", {
        email: email.trim().toLowerCase(),
      });

      toast({
        title: "Code sent!",
        description: "A new verification code has been sent to your email.",
      });
    } catch (error: any) {
      console.error("💥 Resend failed:", error);

      toast({
        title: "Failed to resend",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  if (!mounted) {
    return null; // Prevent hydration issues
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/95 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-kaabe-gradient opacity-10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-kaabe-gradient opacity-10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 4,
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-20 relative"
      >
        <motion.div className="mb-6">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 text-sm hover:text-examprep-kaabe-maroon transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />{" "}
            Back to registration
          </Link>
        </motion.div>

        <Card className="border-examprep-kaabe-maroon/20 shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-examprep-kaabe-brown/5 to-examprep-kaabe-maroon/5 pointer-events-none" />

          <CardHeader className="relative text-center z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-examprep-kaabe-cream flex items-center justify-center"
            >
              <Mail className="h-8 w-8 text-examprep-kaabe-maroon" />
            </motion.div>
            <CardTitle className="text-2xl font-bold">
              Verify your email
            </CardTitle>
            <CardDescription>
              We've sent a 6-digit verification code to{" "}
              <span className="font-medium text-examprep-kaabe-maroon">
                {email}
              </span>
            </CardDescription>
          </CardHeader>

          <CardContent className="relative z-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-examprep-kaabe-brown">
                  Verification Code
                </Label>
                <Input
                  id="code"
                  name="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => {
                    // Only allow numbers and limit to 6 digits
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setCode(value);
                  }}
                  className="text-center text-lg font-mono tracking-widest border-examprep-kaabe-maroon/20 focus:border-examprep-kaabe-maroon focus:ring-examprep-kaabe-maroon/30"
                  maxLength={6}
                  autoComplete="one-time-code"
                  autoFocus
                />
                <p className="text-xs text-examprep-kaabe-light-brown text-center">
                  Enter the 6-digit code from your email
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-kaabe-gradient hover:opacity-90 transition-opacity"
                disabled={isLoading || code.length !== 6}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Verify Email
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-examprep-kaabe-light-brown mb-3">
                Didn't receive the code?
              </p>
              <Button
                variant="outline"
                onClick={handleResendCode}
                disabled={isResending}
                className="border-examprep-kaabe-maroon/20 text-examprep-kaabe-maroon hover:bg-examprep-kaabe-maroon/5"
              >
                {isResending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Resend Code
                  </span>
                )}
              </Button>
            </div>

            <div className="mt-6 p-4 bg-examprep-kaabe-cream/30 rounded-lg border border-examprep-kaabe-light-maroon/10">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-examprep-kaabe-maroon mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-examprep-kaabe-brown mb-1">
                    Check your email
                  </p>
                  <p className="text-examprep-kaabe-light-brown">
                    The verification code will expire in 10 minutes. If you
                    don't see the email, check your spam folder.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          {process.env.NODE_ENV === "development" && (
            <div className="p-4 bg-gray-100 text-xs">
              <p>
                <strong>Debug Info:</strong>
              </p>
              <p>Email: {email}</p>
              <p>Code: {code}</p>
              <p>Code Length: {code.length}</p>
              <p>API URL: {process.env.NEXT_PUBLIC_API_URL}</p>
            </div>
          )}
        </Card>

        <motion.div className="mt-6 text-center">
          <p className="text-sm text-examprep-kaabe-light-brown">
            Wrong email?{" "}
            <Link
              href="/register"
              className="text-examprep-kaabe-maroon hover:text-examprep-kaabe-light-maroon transition-colors font-medium"
            >
              Register again
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
