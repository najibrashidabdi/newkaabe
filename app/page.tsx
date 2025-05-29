"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle,
  Lock,
  GraduationCap,
  BarChart3,
  Brain,
  Trophy,
  Users,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatItem {
  value: string
  label: string
  icon: React.ElementType
}

interface TestimonialItem {
  name: string
  role: string
  content: string
}

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const heroRef = useRef<HTMLElement | null>(null)
  const featuresRef = useRef<HTMLElement | null>(null)
  const statsRef = useRef<HTMLElement | null>(null)
  const plansRef = useRef<HTMLElement | null>(null)
  const testimonialsRef = useRef<HTMLElement | null>(null)
  const ctaRef = useRef<HTMLElement | null>(null)

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const heroOpacity = useTransform(heroProgress, [0, 1], [1, 0])
  const heroScale = useTransform(heroProgress, [0, 1], [1, 0.95])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const stats: StatItem[] = [
    { value: "10+", label: "Subjects", icon: BookOpen },
    { value: "1000+", label: "Practice Questions", icon: Brain },
    { value: "94+", label: "Students", icon: Users },
    { value: "$10", label: "Rewards", icon: Trophy },
  ]

  const testimonials: TestimonialItem[] = [
    {
      name: "Najib Rashid.",
      role: "Al Jazeera Secondary School",
      content:
        "Waan ka ku faraxsanahay ka mid ahaanshaha kaabe, runtiina waa fikrad fiican oo kor loogu qaadi lahaa scoreka imtixaanka ee ardayda!",
    },
    {
      name: "Hamze Mohamed",
      role: "Future Secondry school",
    content: "runta markaan sheego mudo kooban oo aan ku practice gareenayay websitekan imtixanadii, wax badan wuu igu baraarujiyay",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background/95">
      {/* Navigation */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b backdrop-blur transition-all duration-300",
          isScrolled
            ? "bg-background/80 supports-[backdrop-filter]:bg-background/60"
            : "bg-transparent border-transparent",
        )}
      >
        <div className="container flex h-16 items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 font-bold text-xl"
          >
            <div className="relative h-8 w-8">
              <Image
                src="/placeholder.svg?height=32&width=32"
                alt="Kaabe Logo"
                fill
                sizes="32px"
                className="object-contain"
              />
            </div>
            <span className="bg-gradient-to-r from-[#3e2723] to-[#8d2c2c] bg-clip-text text-transparent">Kaabe</span>
          </motion.div>
          <nav className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                Login
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button
                asChild
                variant="default"
                className="bg-gradient-to-r from-[#3e2723] to-[#8d2c2c] hover:from-[#4e3733] hover:to-[#9d3c3c] text-white border-none"
              >
                <Link href="/register">Get Started</Link>
              </Button>
            </motion.div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative overflow-hidden"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#3e2723]/10 to-transparent pointer-events-none" />
        <div className="container py-24 sm:py-32 relative z-10">
          <div className="flex flex-col items-center text-center gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Master Your Exams with{" "}
                <span className="bg-gradient-to-r from-[#3e2723] to-[#8d2c2c] bg-clip-text text-transparent relative">
                  Kaabe
                  <motion.span
                    className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#3e2723] to-[#8d2c2c]"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </span>
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="max-w-[700px] text-lg text-muted-foreground md:text-xl"
            >
              Practice with real exam questions, get AI-powered feedback, and track your progress to ace your exams.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 mt-6"
            >
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-[#3e2723] to-[#8d2c2c] hover:from-[#4e3733] hover:to-[#9d3c3c] text-white border-none group relative overflow-hidden"
              >
                <Link href="/register">
                  Start Learning
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="group">
                <Link href="#features">
                  Learn More
                  <motion.span
                    className="absolute bottom-0 left-0 h-[2px] bg-[#8d2c2c]/30"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                      delay: 0.5,
                    }}
                  />
                </Link>
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-16 relative mx-auto max-w-5xl"
          >
            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-[#8d2c2c]/20">
              <div className="aspect-[16/9] bg-gradient-to-br from-[#3e2723]/10 to-[#8d2c2c]/10 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full max-w-3xl bg-background/95 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-[#8d2c2c]/20">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-[#8d2c2c]" />
                        <span className="font-medium">Mathematics - Final Exam Practice</span>
                      </div>
                      <div className="text-sm text-muted-foreground">Question 3 of 10</div>
                    </div>
                    <div className="space-y-4">
                      <div className="font-medium">If f(x) = 3x² - 4x + 2, find the value of f(2).</div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="border rounded-md p-3 hover:bg-[#8d2c2c]/5 hover:border-[#8d2c2c]/30 cursor-pointer transition-colors">
                          A. 6
                        </div>
                        <div className="border rounded-md p-3 hover:bg-[#8d2c2c]/5 hover:border-[#8d2c2c]/30 cursor-pointer transition-colors">
                          B. 8
                        </div>
                        <div className="border rounded-md p-3 bg-[#8d2c2c]/10 border-[#8d2c2c]/40 cursor-pointer">
                          C. 10
                        </div>
                        <div className="border rounded-md p-3 hover:bg-[#8d2c2c]/5 hover:border-[#8d2c2c]/30 cursor-pointer transition-colors">
                          D. 12
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button className="bg-[#8d2c2c] hover:bg-[#7d1c1c]">Next Question</Button>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.div
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-[#8d2c2c] border border-[#8d2c2c]/20 shadow-md"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  Pro Feature
                </motion.div>

                <motion.div
                  className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-[#8d2c2c] border border-[#8d2c2c]/20 shadow-md flex items-center gap-1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  <BarChart3 className="h-3 w-3" />
                  Track Progress
                </motion.div>
              </div>
            </div>

            <motion.div
              className="absolute -bottom-6 -right-6 h-32 w-32 bg-gradient-to-br from-[#3e2723] to-[#8d2c2c] rounded-full opacity-20 blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />

            <motion.div
              className="absolute -top-6 -left-6 h-32 w-32 bg-gradient-to-br from-[#3e2723] to-[#8d2c2c] rounded-full opacity-20 blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: 2,
              }}
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section ref={statsRef} className="container py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background/50 backdrop-blur-sm border rounded-xl p-4 text-center flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-2 rounded-full bg-[#8d2c2c]/10">
                <stat.icon className="h-5 w-5 text-[#8d2c2c]" />
              </div>
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#3e2723] to-[#8d2c2c] bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        ref={featuresRef}
        className="py-24 sm:py-32 bg-gradient-to-b from-[#3e2723]/5 to-transparent"
      >
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center gap-4 mb-12"
          >
            <div className="inline-flex items-center justify-center rounded-full bg-[#8d2c2c]/10 px-3 py-1 text-sm font-medium text-[#8d2c2c] mb-2">
              Features
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why Choose Kaabe?</h2>
            <p className="max-w-[700px] text-lg text-muted-foreground">
              Platformkayagan waxa uu u diyaarsan yahay hab casri ah kuwaas oo ardayday u heli karaan dhammaan imtixaanadii hore loo qaaday iyaga oo practice gareen kara
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-[#8d2c2c]/20 hover:border-[#8d2c2c]/40 transition-colors h-full overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#3e2723]/5 to-[#8d2c2c]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-[#8d2c2c]" />
                    Real Exam Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Ku Practice gareen su,alaha dhamaan imtixanadii hore loo qaaday 2018 illa 2024
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-[#8d2c2c]/20 hover:border-[#8d2c2c]/40 transition-colors h-full overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#3e2723]/5 to-[#8d2c2c]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-[#8d2c2c]" />
                    Rewards & Leaderboards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Kula tartan ardayda su,alaha oo ku guulayso hadiyad dhan 10$(14) cisho kasta
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-[#8d2c2c]/20 hover:border-[#8d2c2c]/40 transition-colors h-full overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#3e2723]/5 to-[#8d2c2c]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-[#8d2c2c]" />
                    AI-Powered Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Get instant, personalized feedback on your answers to improve your understanding and performance.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="container py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center gap-4 mb-12"
        >
          <div className="inline-flex items-center justify-center rounded-full bg-[#8d2c2c]/10 px-3 py-1 text-sm font-medium text-[#8d2c2c] mb-2">
            Testimonials
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What Our Students Say</h2>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            Join thousands of students who have improved their grades with Kaabe.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background/50 backdrop-blur-sm border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative"
            >
              <div className="absolute top-0 right-0 -mt-2 -mr-2 h-12 w-12 bg-gradient-to-br from-[#3e2723]/10 to-[#8d2c2c]/10 rounded-full blur-xl" />
              <div className="relative">
                <p className="text-muted-foreground mb-4">{testimonial.content}</p>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#3e2723] to-[#8d2c2c] flex items-center justify-center text-white font-medium">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Plans Comparison */}
      <section ref={plansRef} className="py-24 sm:py-32 bg-gradient-to-b from-[#3e2723]/5 to-transparent">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center gap-4 mb-12"
          >
            <div className="inline-flex items-center justify-center rounded-full bg-[#8d2c2c]/10 px-3 py-1 text-sm font-medium text-[#8d2c2c] mb-2">
              Pricing
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Choose Your Plan</h2>
            <p className="max-w-[700px] text-lg text-muted-foreground">
              Start with our Pro plan for full access to all features and subjects.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {/* Free Plan - Crossed Out */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-2 h-full relative overflow-hidden opacity-60">
                <div className="absolute inset-0 bg-gray-100/50 z-10" />
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg">
                    <X className="h-4 w-4" />
                    Currently Unavailable
                  </div>
                </div>
                <CardHeader className="relative z-0">
                  <CardTitle className="text-2xl line-through">Free Plan</CardTitle>
                  <CardDescription className="text-xl line-through">$0</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 relative z-0">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 line-through text-muted-foreground">
                      <CheckCircle className="h-5 w-5" />
                      <span>Access to 10 practice questions</span>
                    </li>
                    <li className="flex items-center gap-2 line-through text-muted-foreground">
                      <CheckCircle className="h-5 w-5" />
                      <span>Basic statistics tracking</span>
                    </li>
                    <li className="flex items-center gap-2 line-through text-muted-foreground">
                      <CheckCircle className="h-5 w-5" />
                      <span>Leaderboard access</span>
                    </li>
                    <li className="flex items-center gap-2 line-through text-muted-foreground">
                      <Lock className="h-5 w-5" />
                      <span>Full subject access (10 subjects)</span>
                    </li>
                    <li className="flex items-center gap-2 line-through text-muted-foreground">
                      <Lock className="h-5 w-5" />
                      <span>AI-powered feedback</span>
                    </li>
                    <li className="flex items-center gap-2 line-through text-muted-foreground">
                      <Lock className="h-5 w-5" />
                      <span>Reward giveaways</span>
                    </li>
                  </ul>
                  <Button className="w-full" disabled>
                    Not Available
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pro Plan - Updated Pricing */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <motion.div
                className="absolute -top-3 -right-3 bg-gradient-to-br from-[#3e2723] to-[#8d2c2c] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                RECOMMENDED
              </motion.div>

              <Card className="border-2 border-[#8d2c2c] h-full relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#3e2723]/5 to-[#8d2c2c]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="bg-gradient-to-r from-[#3e2723] to-[#8d2c2c] text-white">
                  <CardTitle className="text-2xl">Pro Plan</CardTitle>
                  <CardDescription className="text-xl text-white/90">
                    <span className="text-3xl font-bold">$1</span>
                    <span className="text-lg"> / 14 days</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Access to 1000+ practice questions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Comprehensive statistics tracking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Leaderboard access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Full access to all 10 subjects</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>AI-powered feedback and explanations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>$10 reward giveaways</span>
                    </li>
                  </ul>
                  <div className="bg-[#8d2c2c]/10 border border-[#8d2c2c]/20 rounded-lg p-3 text-sm text-[#8d2c2c]">
                    <strong>Recurring billing:</strong> Automatically renews every 14 days. Cancel anytime.
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-[#3e2723] to-[#8d2c2c] hover:from-[#4e3733] hover:to-[#9d3c3c] text-white border-none group relative overflow-hidden"
                    variant="default"
                    asChild
                  >
                    <Link href="/register">
                      Start Pro Plan
                      <motion.span
                        className="absolute bottom-0 left-0 h-[2px] bg-white/30"
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                        }}
                      />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-24 sm:py-32 bg-gradient-to-r from-[#3e2723] to-[#8d2c2c] text-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center gap-4"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to Ace Your Exams?</h2>
            <p className="max-w-[700px] text-lg text-white/90 md:text-xl">
              Join thousands of students who are improving their grades with Kaabe Pro.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button size="lg" variant="secondary" className="mt-6 group relative overflow-hidden" asChild>
                <Link href="/register">
                  Start Your Pro Journey
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  <motion.span
                    className="absolute bottom-0 left-0 h-[2px] bg-secondary-foreground/30"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-background/95">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-bold">
            <div className="relative h-6 w-6">
              <Image
                src="/kaabe-logo.png"
                alt="Kaabe Logo"
                fill
                sizes="24px"
                className="object-contain"
              />
            </div>
            <span className="bg-gradient-to-r from-[#3e2723] to-[#8d2c2c] bg-clip-text text-transparent">Kaabe</span>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Kaabe. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-[#8d2c2c] transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-[#8d2c2c] transition-colors">
              Privacy
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-[#8d2c2c] transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
