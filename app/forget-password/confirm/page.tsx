"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Loader2,
  KeyRound,
  Lock,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface SavedEmail {
  email?: string;
}

export default function ResetConfirmPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [saved, setSaved] = useState<SavedEmail>({});
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [success, setSuccess] = useState(false);

  // pull the email from sessionStorage
  useEffect(() => {
    setMounted(true);
    const raw = sessionStorage.getItem("forgotEmail");
    setSaved(raw ? JSON.parse(raw) : {});
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!saved.email) {
      toast({
        title: "Missing email",
        description: "Start at the forgot-password page.",
        variant: "destructive",
      });
      return router.push("/forget-password");
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your new passwords match.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await api("/api/auth/password-reset/confirm/", "POST", {
        email: saved.email,
        code,
        new_password: newPassword,
      });

      setSuccess(true);

      toast({
        title: "Success",
        description: "Password reset. Please log in.",
        icon: <CheckCircle className="text-green-500" />,
      });

      // Delay redirect for animation
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || saved.email === undefined) {
    return null; // still loading
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
        className="w-full max-w-md z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-center mb-6"
        >
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <BookOpen className="h-8 w-8 text-examprep-kaabe-maroon" />
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-kaabe-gradient bg-clip-text text-transparent"
            >
              Kaabe
            </motion.span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <Link
            href="/forget-password"
            className="inline-flex items-center gap-2 text-sm hover:text-examprep-kaabe-maroon transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />{" "}
            Back to forgot password
          </Link>
        </motion.div>

        <Card className="border-examprep-kaabe-maroon/20 shadow-lg overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-examprep-kaabe-brown/5 to-examprep-kaabe-maroon/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />

          <CardHeader className="relative">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute top-0 left-0 h-1 bg-kaabe-gradient"
            />
            <CardTitle className="text-2xl font-bold">
              Reset Your Password
            </CardTitle>
            <CardDescription>
              Enter the code and create a new password
            </CardDescription>
          </CardHeader>

          <CardContent>
            <AnimatePresence mode="wait">
              {!success ? (
                <motion.div
                  key="reset-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <motion.p
                    className="text-sm mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    A code was sent to{" "}
                    <motion.span
                      className="font-semibold text-examprep-kaabe-maroon"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.3 }}
                    >
                      {saved.email}
                    </motion.span>
                    . Enter it below with your new password.
                  </motion.p>

                  <form className="space-y-5" onSubmit={submit}>
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Label className="flex items-center gap-2">
                        <KeyRound className="h-4 w-4 text-examprep-kaabe-maroon" />
                        Code
                      </Label>
                      <div className="relative">
                        <Input
                          maxLength={6}
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          required
                          className="pl-3 text-center text-lg tracking-widest border-examprep-kaabe-maroon/20 focus:border-examprep-kaabe-maroon focus:ring-examprep-kaabe-maroon/30"
                        />
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: code ? "100%" : "0%" }}
                          className="absolute bottom-0 left-0 w-0.5 bg-examprep-kaabe-maroon"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Label className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-examprep-kaabe-maroon" />
                        New Password
                      </Label>
                      <div className="relative">
                        <Input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          minLength={8}
                          required
                          className="pl-3 border-examprep-kaabe-maroon/20 focus:border-examprep-kaabe-maroon focus:ring-examprep-kaabe-maroon/30"
                        />
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: newPassword ? "100%" : "0%" }}
                          className="absolute bottom-0 left-0 w-0.5 bg-examprep-kaabe-maroon"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Label className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-examprep-kaabe-maroon" />
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          className="pl-3 border-examprep-kaabe-maroon/20 focus:border-examprep-kaabe-maroon focus:ring-examprep-kaabe-maroon/30"
                        />
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: confirmPassword ? "100%" : "0%" }}
                          className="absolute bottom-0 left-0 w-0.5 bg-examprep-kaabe-maroon"
                        />
                      </div>
                      {newPassword &&
                        confirmPassword &&
                        newPassword !== confirmPassword && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-500 text-xs mt-1"
                          >
                            Passwords don't match
                          </motion.p>
                        )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <Button
                        className="w-full bg-kaabe-gradient hover:opacity-90 transition-opacity relative overflow-hidden group"
                        disabled={
                          loading ||
                          (newPassword !== confirmPassword &&
                            confirmPassword !== "")
                        }
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Resetting...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            Reset Password
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </span>
                        )}
                        <motion.span
                          className="absolute bottom-0 left-0 h-[2px] bg-white/30"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{
                            duration: 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                          }}
                        />
                      </Button>
                    </motion.div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="reset-success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 flex flex-col items-center"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="rounded-full bg-green-100 p-3 mb-4"
                  >
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </motion.div>
                  <motion.h3
                    className="text-xl font-bold mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Password Reset Complete!
                  </motion.h3>
                  <motion.p
                    className="text-center text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Redirecting to login...
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

          <CardFooter className="flex justify-center pt-2 pb-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-sm text-center"
            >
              <Link
                href="/login"
                className="text-examprep-kaabe-maroon hover:text-examprep-kaabe-light-maroon transition-colors font-medium"
              >
                Back to login
              </Link>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
