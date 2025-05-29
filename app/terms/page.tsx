"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b backdrop-blur bg-background/80">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="relative h-8 w-8">
              <Image src="/kaabe-logo.png" alt="Kaabe Logo" fill className="object-contain" />
            </div>
            <span className="bg-gradient-to-r from-[#3e2723] to-[#8d2c2c] bg-clip-text text-transparent">
              Kaabe
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Terms Content */}
      <main className="container flex-1 py-24 sm:py-32 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <h1 className="text-4xl font-bold text-[#8d2c2c]">Shuruudaha iyo Xaaladaha</h1>

          <p className="text-muted-foreground text-lg">
            Ku soo dhowow Kaabe! Markaad isticmaaleyso degelkeenna iyo adeegyadayada, waxaad aqbashaa shuruudaha iyo xaaladaha hoos ku xusan. Fadlan si taxaddar leh u akhri.
          </p>

          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold">1. Isticmaalka Adeegyada</h2>
              <p className="text-muted-foreground mt-1">
                Kaabe waxaa loo isticmaali karaa ujeeddooyin waxbarasho iyo shaqsiyadeed kaliya. Waxaad ogolaatay inaadan adeegyada u isticmaalin si xun ama si aan habboonayn.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">2. Diiwaangelinta Akoonka</h2>
              <p className="text-muted-foreground mt-1">
                Fadlan hubi in xogta akoonkaaga ay ahaato mid ammaan ah. Waxaan kugula talineynaa inaad isticmaasho eray sir ah oo adag si loo ilaaliyo xogtaada.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">3. Helitaanka Astaanta Pro</h2>
              <p className="text-muted-foreground mt-1">
                Accountkaagu wuxuu noqon karaa Pro, marka la xaqiijiyo in aad si sax ah aad u iibsatay astaantaas, hadiise ay kugu cadaato in aad ku heshey qaab sharci darro ah, waa la terminate(delete) gareenayaa gabi aahba accountkaas
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">4. Hantida Platformkan</h2>
              <p className="text-muted-foreground mt-1">
                Dhammaan hantida guud ee Kaabe, oo ay ku jiraan qaab dhismeedka platformka, waxaa iska leh Kaabe ama adeegyada ay saaxibada dhow yihiin. Looma oggola in la faafiyo ama la koobiyeeyo nuxurka iyadoon oggolaansho laga haysan kaabe.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">5. Asturnaanta</h2>
              <p className="text-muted-foreground mt-1">
                Waxaan si weyn u qadarinaynaa asturnaantaada. Fadlan eeg Siyaasadda Asturnaanta si aad u aragto sida aan u maamulno xogtaada.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">6. Isbedelada Shuruudaha</h2>
              <p className="text-muted-foreground mt-1">
                Waxaan cusboonaysiin karnaa shuruudahan mararka qaar. Isticmaalka sii socda ee Kaabe wuxuu muujinayaa inaad oggolaatay isbedeladaas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">7. Nala Soo Xiriir</h2>
              <p className="text-muted-foreground mt-1">
                Haddii aad qabto su’aalo ama walaac ku saabsan shuruudahan, fadlan nala soo xiriir: support@kaabe.com.
              </p>
            </section>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-background/95">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-bold">
            <div className="relative h-6 w-6">
              <Image
                src="/kaabe-logo.png"
                alt="Kaabe Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="bg-gradient-to-r from-[#3e2723] to-[#8d2c2c] bg-clip-text text-transparent">
              Kaabe
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Kaabe. Dhammaan xuquuqdu way xafidan yihiin.
          </p>
          <div className="flex gap-4">
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-[#8d2c2c] transition-colors"
            >
              Shuruudo
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-[#8d2c2c] transition-colors"
            >
              Asturnaanta
            </Link>
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-[#8d2c2c] transition-colors"
            >
              Bogga Hore
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}