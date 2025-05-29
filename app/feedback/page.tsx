"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function FeedbackPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/feedback/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.detail === "received") {
        alert("Waan helnay fariintaada, jawaab celin Inshaa'Allaah waad naga sugin.");
        router.push("/dashboard");
      } else {
        alert(data.detail || "Wax qalad ah ayaa dhacay.");
      }
    } catch (error) {
      alert("Isku day mar kale. Wax baa khaldan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b backdrop-blur bg-background/80">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="bg-gradient-to-r from-[#3e2723] to-[#8d2c2c] bg-clip-text text-transparent">
              Kaabe
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="container flex-1 py-24 sm:py-32 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-10"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#8d2c2c] mb-4">Fariin iyo Jawaab Celin</h1>
            <p className="text-muted-foreground text-lg">
              Fadlan isticmaal foomkan si aad noogu soo sheegto cilladaha, talooyinka horumarineed,
              ama waxyaabaha aad ka heli lahayd Kaabe.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white/80 backdrop-blur rounded-xl shadow-md p-6 space-y-6 border border-[#8d2c2c]/20"
          >
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Magacaaga Buuxa
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8d2c2c]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Cinwaanka Email-ka
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8d2c2c]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="message">
                Fariintaada
              </label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={6}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8d2c2c]"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#8d2c2c] text-white px-6 py-2 rounded-md hover:bg-[#7a1d1d] transition-colors disabled:opacity-50"
            >
              {loading ? "Diraya..." : "Dir Fariinta"}
            </button>
          </form>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-background/95">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-bold text-[#8d2c2c]">Kaabe</span>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Kaabe. Dhammaan xuquuqdu way xafidan yihiin.
          </p>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-[#8d2c2c] transition-colors"
          >
            Bogga Hore
          </Link>
        </div>
      </footer>
    </div>
  );
}
