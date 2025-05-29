/* ─── app/admin/login/page.tsx ─────────────────────────────────── */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, Mail, KeyRound } from "lucide-react";
import { api } from "@/lib/api";

/* Tailwind helpers */
const inputClass =
  "mt-1 w-full rounded-md border px-3 py-2 text-sm " +
  "focus:outline-none focus:ring-2 focus:ring-accent";
const btnClass =
  "bg-examprep-kaabe-maroon text-white py-2 rounded-md " +
  "hover:bg-examprep-kaabe-maroon/90 flex items-center justify-center gap-2 w-full";

export default function AdminLoginPage() {
  const router = useRouter();

  const [step, setStep]   = useState<"cred" | "code">("cred");
  const [email, setEmail] = useState("");
  const [pwd, setPwd]     = useState("");
  const [code, setCode]   = useState("");
  const [msg, setMsg]     = useState("");

  /* 1️⃣ send credentials → server e-mails OTP */
  async function handleCred(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res: any = await api(
        "/api/auth/staff-login/",     // <-- FULL path
        "POST",
        { email, password: pwd }
      );

      if (res.otp_required) {
        setMsg("Code sent! Check your inbox.");
        setStep("code");
      } else {
        localStorage.setItem("access",  res.access);
        localStorage.setItem("refresh", res.refresh);
        router.replace("/admin");
      }
    } catch {
      setMsg("Invalid e-mail or password.");
    }
  }

  /* 2️⃣ verify the 6-digit code */
  async function handleCode(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res: any = await api(
        "/api/auth/staff-login/verify/",   // <-- FULL path
        "POST",
        { email, code }
      );
      localStorage.setItem("access",  res.access);
      localStorage.setItem("refresh", res.refresh);
      router.replace("/admin");
    } catch {
      setMsg("Wrong or expired code.");
    }
  }

  /* ── UI ────────────────────────────────────────────── */
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm rounded-xl border bg-background/80 p-8 shadow-lg backdrop-blur"
      >
        <div className="flex items-center gap-2 mb-6">
          <ShieldCheck className="text-green-600" />
          <h1 className="text-xl font-semibold">Kaabe Admin Login</h1>
        </div>

        {/* ── STEP 1 – credentials ── */}
        {step === "cred" && (
          <form onSubmit={handleCred} className="space-y-4">
            <label className="block">
              <span className="text-sm">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="text-sm">Password</span>
              <input
                type="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                required
                className={inputClass}
              />
            </label>
            <button className={btnClass}>
              <Mail size={16} /> Send code
            </button>
          </form>
        )}

        {/* ── STEP 2 – verify code ── */}
        {step === "code" && (
          <form onSubmit={handleCode} className="space-y-4">
            <label className="block">
              <span className="text-sm">6-digit code</span>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                pattern="\d{6}"
                required
                className={inputClass + " tracking-widest text-center"}
              />
            </label>
            <button className={btnClass}>
              <KeyRound size={16} /> Verify &amp; enter
            </button>
          </form>
        )}

        {msg && (
          <p className="mt-4 text-center text-sm text-muted-foreground">{msg}</p>
        )}
      </motion.div>
    </div>
  );
}
