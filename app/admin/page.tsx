/* ─── app/admin/page.tsx ───────────────────────────────────────── */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Metrics {
  total_users: number;
  pro_users: number;
  daily_growth: number;
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="rounded-xl border bg-background/90 p-6 shadow-sm backdrop-blur-sm"
    >
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-3xl font-semibold">{value}</p>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();

  /* page-level state ------------------------------------------------ */
  const [loading, setLoading]   = useState(true);
  const [metrics, setMetrics]   = useState<Metrics | null>(null);
  const [error, setError]       = useState("");

  /* money-over-time state */
  const [moneySeries, setSeries] = useState<
    { t: string; money: number }[]
  >([]);

  /* helper: fetch metrics */
  const fetchMetrics = useCallback(async () => {
    try {
      const data = (await api("/api/auth/admin/metrics/")) as Metrics;
      setMetrics(data);
      setError("");

      /* money = pro_users × 10 000 SLSH */
      const money = data.pro_users * 10_000;
      const now   = new Date();
      const label = now.toLocaleTimeString("en-GB", { hour12: false });

      setSeries((prev) => {
        const next = [...prev, { t: label, money }];
        return next.slice(-30); // keep last 30 points
      });
    } catch {
      setError("Failed to fetch metrics.");
    } finally {
      setLoading(false);
    }
  }, []);

  /* initial auth + polling */
  useEffect(() => {
    (async () => {
      try {
        const me: any = await api("/api/auth/me/");
        if (!me.is_staff) router.replace("/admin/login");
        else fetchMetrics();
      } catch {
        router.replace("/admin/login");
      }
    })();

    const id = setInterval(fetchMetrics, 15_000); // every 15 s
    return () => clearInterval(id);
  }, [router, fetchMetrics]);

  /* render guards -------------------------------------------------- */
  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading admin panel…</p>
      </div>
    );
  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  if (!metrics) return null;

  /* derived -------------------------------------------------------- */
  const { total_users, pro_users, daily_growth } = metrics;
  const currentMoney = pro_users * 10_000;

  /* UI ------------------------------------------------------------- */
  return (
    <div className="relative min-h-screen px-6 py-10">
      {/* header */}
      <div className="flex items-center gap-2 mb-10">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
          <BookOpen className="h-7 w-7 text-examprep-kaabe-maroon" />
          <span className="bg-kaabe-gradient bg-clip-text text-transparent">
            Kaabe
          </span>
        </Link>
        <ShieldCheck className="ml-auto h-6 w-6 text-green-600" />
        <span className="text-sm text-muted-foreground">Admin Panel</span>
      </div>

      {/* KPI cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-6 md:grid-cols-4"
      >
        <Stat label="Total registered" value={total_users} />
        <Stat label="Active Pro users" value={pro_users} />
        <Stat label="Sign-ups (24 h)" value={daily_growth} />
        <Stat label="Revenue (SLSH)" value={currentMoney} />
      </motion.div>

      {/* live revenue chart */}
      <div className="mt-12 h-80 rounded-xl border bg-background/90 p-4 shadow-sm backdrop-blur-sm">
        <h3 className="mb-4 font-medium">Live revenue trend (SLSH)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={moneySeries}>
            <XAxis dataKey="t" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="money"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* manual refresh */}
      <button
        onClick={fetchMetrics}
        className="mt-10 inline-flex items-center gap-2 rounded-lg bg-examprep-kaabe-maroon px-4 py-2 text-white hover:bg-examprep-kaabe-maroon/90 transition-colors"
      >
        Refresh now
      </button>
    </div>
  );
}
