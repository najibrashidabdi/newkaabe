"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, ArrowRight, Loader2, User, Lock } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";



export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // ⬅️ NEW

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ───────── submit ───────── */
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);                // clear any previous error
    setLoading(true);

    try {
      const data = await api<{ access: string; refresh: string }>(
        "/api/auth/login/",
        "POST",
        form
      );

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      toast({
        title: "Login successful",
        description: "Redirecting to dashboard...",
      });

      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (err: any) {
      /* ── dig the best message out of the backend response ───────── */
      let msg = "Please check your credentials.";

      if (typeof err === "object" && err !== null) {
        if ("detail" in err) {
          msg = err.detail;
        } else if (Array.isArray(err.email)) {
          msg = err.email[0];
        } else if (Array.isArray(err.password)) {
          msg = err.password[0];
        }
      }

      setErrorMsg(msg);               // ⬅️ show inline
      toast({
        title: "Login failed",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) return null; // prevent hydration issues

  /* ───────── UI ───────── */
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/95 p-4">
      {/* background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-kaabe-gradient opacity-10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-kaabe-gradient opacity-10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        {/* logo */}
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

        {/* card */}
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
            <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
            <CardDescription>
              Welcome back! Enter your email and password.
            </CardDescription>
          </CardHeader>

          <CardContent className="relative">
            {/* inline error message */}
            {errorMsg && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 text-sm text-red-600"
              >
                {errorMsg}
              </motion.p>
            )}

            <form className="space-y-5" onSubmit={onSubmit}>
              {/* email */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Label className="flex items-center gap-2">
                  <User className="h-4 w-4 text-examprep-kaabe-maroon" />
                  Email
                </Label>
                <div className="relative">
                  <Input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="pl-3 border-examprep-kaabe-maroon/20 focus:border-examprep-kaabe-maroon focus:ring-examprep-kaabe-maroon/30"
                  />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: form.email ? "100%" : "0%" }}
                    className="absolute bottom-0 left-0 w-0.5 bg-examprep-kaabe-maroon"
                  />
                </div>
              </motion.div>

              {/* password */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Label className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-examprep-kaabe-maroon" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="pl-3 border-examprep-kaabe-maroon/20 focus:border-examprep-kaabe-maroon focus:ring-examprep-kaabe-maroon/30"
                  />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: form.password ? "100%" : "0%" }}
                    className="absolute bottom-0 left-0 w-0.5 bg-examprep-kaabe-maroon"
                  />
                </div>
              </motion.div>

              {/* submit */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Button
                  className="w-full bg-kaabe-gradient hover:opacity-90 transition-opacity relative overflow-hidden group"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Sign in
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
          </CardContent>

          {/* footer */}
          <CardFooter className="flex flex-col space-y-4 pb-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-sm text-center"
            >
              Don&rsquo;t have an account?{" "}
              <Link
                href="/register"
                className="text-examprep-kaabe-maroon hover:text-examprep-kaabe-light-maroon transition-colors font-medium"
              >
                Register
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-xs text-muted-foreground text-center"
            >
              <Link href="/forget-password" className="hover:underline">
                Forgot your password?
              </Link>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
