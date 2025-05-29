"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, LogOut } from "lucide-react";
import Link from "next/link";

import { api } from "@/lib/api";

/**
 * Simple page that logs out immediately, then redirects to /login
 * Linked in nav as <Link href="/logout"> … </Link>
 */
export default function LogoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    async function doLogout() {
      const refresh = localStorage.getItem("refresh");

      /* ignore errors; we still clear local storage */
      if (refresh) {
        try {
          await api("/accounts/logout/", "POST", { refresh });
        } catch (_) {}
      }

      /* remove JWTs so api.ts stops sending them */
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      // Add a small delay for animation
      setTimeout(() => {
        router.replace("/login");
      }, 2000);
    }

    doLogout();
  }, [router]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/95">
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

      <div className="text-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center mb-8"
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
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 10, 0] }}
          transition={{
            scale: { duration: 0.5 },
            rotate: {
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            },
          }}
          className="mx-auto mb-6 bg-examprep-kaabe-maroon/10 rounded-full p-4 w-20 h-20 flex items-center justify-center"
        >
          <LogOut className="h-10 w-10 text-examprep-kaabe-maroon" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold mb-2"
        >
          Signing you out
        </motion.h2>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2 }}
          className="h-1 bg-kaabe-gradient rounded-full max-w-[200px] mx-auto mb-6"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground"
        >
          Thank you for using Kaabe
        </motion.p>
      </div>
    </div>
  );
}
