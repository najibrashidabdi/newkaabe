"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Trophy,
  CheckCircle,
  Zap,
  CreditCard,
  Award,
  BookOpen,
  BrainCircuit,
  Target,
  ArrowLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ProUpgradePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [activationCode, setActivationCode] = useState("");
  const [isActivating, setActivating] = useState(false);
  const [step, setStep] = useState<"info" | "code" | "success">("info");
  const [showConfetti, setShowConfetti] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  // Check if user came from onboarding
  const fromOnboarding = searchParams.get("from") === "onboarding";

  /* ───────── submit activation code ───────── */
  async function handleActivate() {
    if (!activationCode.trim()) {
      toast({
        title: "Activation code required",
        description: "Please enter your activation code.",
        variant: "destructive",
      });
      return;
    }

    setActivating(true);
    try {
      /* ---- call backend ---- */
      await api("/api/activate/", "POST", { code: activationCode.trim() });

      // Show success state with confetti
      setShowConfetti(true);
      setStep("success");

      toast({
        title: "Upgrade successful!",
        description: "Enjoy full Pro access 🎉",
      });

      // Start countdown for auto-redirect
      let count = 5;
      const countdownInterval = setInterval(() => {
        count -= 1;
        setRedirectCountdown(count);

        if (count <= 0) {
          clearInterval(countdownInterval);
          // Always redirect to dashboard after successful upgrade
          router.push("/dashboard");
        }
      }, 1000);
    } catch (err: any) {
      toast({
        title: "Activation failed",
        description:
          typeof err?.message === "string"
            ? err.message
            : "Invalid or expired code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActivating(false);
    }
  }

  /* ───────── UI ───────── */
  return (
    <div className="min-h-screen bg-examprep-kaabe-beige">
      {showConfetti && <Confetti />}

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-examprep-kaabe-light-maroon/20 bg-examprep-kaabe-beige/80 backdrop-blur-md">
        <div className="container flex h-16 items-center">
          {step !== "success" && (
            <Button
              variant="ghost"
              onClick={() =>
                router.push(fromOnboarding ? "/onboarding" : "/dashboard")
              }
              className="text-examprep-kaabe-brown hover:text-examprep-kaabe-maroon"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="container py-12">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <h1 className="text-3xl font-bold text-examprep-kaabe-maroon sm:text-4xl md:text-5xl">
              Upgrade to{" "}
              <span className="relative inline-block">
                Pro
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="absolute -bottom-1 left-0 h-1 bg-gradient-to-r from-examprep-kaabe-maroon to-examprep-kaabe-light-maroon"
                />
              </span>
            </h1>
            <p className="mt-4 text-lg text-examprep-kaabe-light-brown">
              Unlock all features and 1000+ questions across 10 subjects
            </p>
          </motion.div>

          {step === "success" ? (
            <SuccessView
              redirectCountdown={redirectCountdown}
              onContinue={() => router.push("/dashboard")}
            />
          ) : (
            <div className="grid gap-8 md:grid-cols-5">
              {/* Left column - Benefits */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="md:col-span-3"
              >
                <Card className="overflow-hidden border-none bg-white/90 shadow-custom backdrop-blur">
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <h2 className="flex items-center gap-2 text-xl font-semibold text-examprep-kaabe-maroon">
                        <Award className="h-5 w-5" />
                        Pro Benefits
                      </h2>
                      <p className="mt-1 text-sm text-examprep-kaabe-light-brown">
                        Everything you need to excel in your exams
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <BenefitCard
                        icon={
                          <BookOpen className="h-5 w-5 text-examprep-kaabe-maroon" />
                        }
                        title="Complete Content Access"
                        description="Unlock all 1000+ practice questions across 10 subjects"
                      />
                      <BenefitCard
                        icon={
                          <BrainCircuit className="h-5 w-5 text-examprep-kaabe-maroon" />
                        }
                        title="AI-Powered Feedback"
                        description="Get detailed explanations and personalized learning insights"
                      />
                      <BenefitCard
                        icon={
                          <Target className="h-5 w-5 text-examprep-kaabe-maroon" />
                        }
                        title="Performance Tracking"
                        description="Track your progress with detailed analytics and insights"
                      />
                      <BenefitCard
                        icon={
                          <Trophy className="h-5 w-5 text-examprep-kaabe-maroon" />
                        }
                        title="Rewards Program"
                        description="Participate in monthly $10 reward giveaways"
                      />
                    </div>

                    <div className="mt-8">
                      <h3 className="mb-4 text-lg font-medium text-examprep-kaabe-brown">
                        Compare Plans
                      </h3>
                      <div className="overflow-hidden rounded-lg border border-examprep-kaabe-light-maroon/20">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-examprep-kaabe-cream/30">
                              <th className="p-3 text-left text-sm font-medium text-examprep-kaabe-brown">
                                Features
                              </th>
                              <th className="p-3 text-left text-sm font-medium text-examprep-kaabe-brown">
                                Free
                              </th>
                              <th className="p-3 text-left text-sm font-medium text-examprep-kaabe-maroon">
                                Pro
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-examprep-kaabe-light-maroon/10">
                            <ComparisonRow
                              feature="Practice Questions"
                              free="10 questions(Currently not available)"
                              pro="1000+ questions"
                            />
                            <ComparisonRow
                              feature="Subject Access"
                              free="Limited(Currently not available)"
                              pro="All 10 subjects"
                            />
                            <ComparisonRow
                              feature="AI Feedback"
                              free="Basic(Currently not available)"
                              pro="Advanced"
                            />
                            <ComparisonRow
                              feature="Analytics"
                              free="Basic stats"
                              pro="Detailed insights"
                            />
                            <ComparisonRow
                              feature="Rewards Program"
                              free="Not eligible"
                              pro="$10 monthly giveaways"
                            />
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Right column - Payment or Code */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="md:col-span-2"
              >
                <Card className="sticky top-24 overflow-hidden border-none bg-white/90 shadow-custom backdrop-blur">
                  <CardContent className="p-6">
                    {step === "info" ? (
                      <div className="space-y-6">
                        <div>
                          <h2 className="flex items-center gap-2 text-xl font-semibold text-examprep-kaabe-maroon">
                            <CreditCard className="h-5 w-5" />
                            Payment Details
                          </h2>
                          <p className="mt-1 text-sm text-examprep-kaabe-light-brown">
                            One-time payment for full access
                          </p>
                        </div>

                        <div className="rounded-lg bg-examprep-kaabe-cream/30 p-4">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-examprep-kaabe-brown">
                              Pro Plan
                            </span>
                            <div>
                              <span className="text-lg font-bold text-examprep-kaabe-maroon">
                                $1
                              </span>
                            </div>
                          </div>
                          <p className="mt-1 text-xs text-examprep-kaabe-light-brown">
                            Enjoy all Pro features for 14 days after payment.
                          </p>
                        </div>

                        <div className="rounded-lg bg-examprep-kaabe-light-maroon/10 p-4">
                          <h3 className="font-medium text-examprep-kaabe-brown mb-2">
                            Payment Instructions:
                          </h3>
                          <p className="text-sm text-examprep-kaabe-light-brown mb-2">
                            Ku Dir Lacagta Lambarkan Soo Socda
                          </p>
                          <div className="bg-white p-3 rounded text-center font-medium text-examprep-kaabe-maroon">
                            +252&nbsp;63&nbsp; 7515695
                          </div>
                          <p className="text-sm text-examprep-kaabe-light-brown mt-2">
                            U xaqiiji adeegahan lacagtaada adiga oo ugu diraya screenshotka receptiga lacagta whatsapp numberkan 252 63 7515695
                          </p>
                        </div>

                        <Button
                          className="w-full bg-examprep-kaabe-maroon hover:bg-examprep-kaabe-brown text-white"
                          onClick={() => setStep("code")}
                        >
                          I&apos;ve made the payment
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <h2 className="flex items-center gap-2 text-xl font-semibold text-examprep-kaabe-maroon">
                            <Zap className="h-5 w-5" />
                            Activate Pro
                          </h2>
                          <p className="mt-1 text-sm text-examprep-kaabe-light-brown">
                            Enter your activation code
                          </p>
                        </div>

                        <div className="rounded-lg bg-examprep-kaabe-cream/30 p-6">
                          <div className="space-y-4">
                            <Label
                              htmlFor="activationCode"
                              className="text-examprep-kaabe-brown"
                            >
                              Activation Code
                            </Label>
                            <Input
                              id="activationCode"
                              placeholder="e.g. ABC123"
                              value={activationCode}
                              onChange={(e) =>
                                setActivationCode(e.target.value)
                              }
                              className="text-center text-lg font-medium border-examprep-kaabe-light-maroon/20 focus:border-examprep-kaabe-maroon focus:ring-examprep-kaabe-maroon"
                              autoFocus
                            />
                          </div>

                          <p className="text-sm text-examprep-kaabe-light-brown mt-4 text-center">
                            Enter the code you received after payment.
                          </p>
                        </div>

                        <div className="flex space-x-4">
                          <Button
                            variant="outline"
                            className="flex-1 border-examprep-kaabe-light-brown text-examprep-kaabe-brown hover:bg-examprep-kaabe-cream"
                            onClick={() => setStep("info")}
                          >
                            Back
                          </Button>

                          <Button
                            className="flex-1 bg-examprep-kaabe-maroon hover:bg-examprep-kaabe-brown text-white"
                            onClick={handleActivate}
                            disabled={isActivating}
                          >
                            {isActivating ? (
                              <>
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Activating...
                              </>
                            ) : (
                              <>
                                Activate Pro
                                <Sparkles className="ml-2 h-4 w-4" />
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}

          {/* Testimonials */}
          {step !== "success" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-12"
            >
              <h2 className="mb-6 text-center text-2xl font-bold text-examprep-kaabe-maroon">
                What Our Pro Users Say
              </h2>
              <div className="grid gap-6 md:grid-cols-3">
                <TestimonialCard
                  name="Najib Rashid"
                  role="High School Student"
                  content="Waan ka ku faraxsanahay ka mid ahaanshaha kaabe, runtiina waa fikrad fiican oo kor loogu qaadi lahaa scoreka imtixaanka ee ardayda!"
                />
                <TestimonialCard
                  name="Aisha L."
                  role="Recent Graduate"
                  content="I used Kaabe for my final exams and got into my dream university. The Pro plan is definitely worth it!"
                />
                <TestimonialCard
                  name="David K."
                  role="High School Junior"
                  content="The AI feedback is amazing! It helped me understand where I was making mistakes and how to fix them."
                />
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

// Helper Components
function BenefitCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-examprep-kaabe-light-maroon/20 bg-white p-4 shadow-sm transition-all hover:shadow-md">
      <div className="mb-2 flex items-center gap-2">
        <div className="rounded-full bg-examprep-kaabe-light-maroon/10 p-2">
          {icon}
        </div>
        <h3 className="font-medium text-examprep-kaabe-brown">{title}</h3>
      </div>
      <p className="text-sm text-examprep-kaabe-light-brown">{description}</p>
    </div>
  );
}

function ComparisonRow({
  feature,
  free,
  pro,
}: {
  feature: string;
  free: string;
  pro: string;
}) {
  return (
    <tr className="hover:bg-examprep-kaabe-cream/10">
      <td className="p-3 text-sm text-examprep-kaabe-brown">{feature}</td>
      <td className="p-3 text-sm text-examprep-kaabe-light-brown">{free}</td>
      <td className="p-3 text-sm font-medium text-examprep-kaabe-maroon">
        {pro}
      </td>
    </tr>
  );
}

function TestimonialCard({
  name,
  role,
  content,
}: {
  name: string;
  role: string;
  content: string;
}) {
  return (
    <div className="rounded-lg border border-examprep-kaabe-light-maroon/20 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-examprep-kaabe-maroon to-examprep-kaabe-light-maroon text-white">
          {name.charAt(0)}
        </div>
        <div>
          <h3 className="font-medium text-examprep-kaabe-brown">{name}</h3>
          <p className="text-xs text-examprep-kaabe-light-brown">{role}</p>
        </div>
      </div>
      <p className="text-sm text-examprep-kaabe-light-brown italic">
        &ldquo;{content}&rdquo;
      </p>
    </div>
  );
}

function SuccessView({
  redirectCountdown,
  onContinue,
}: {
  redirectCountdown: number;
  onContinue: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-2xl"
    >
      <Card className="overflow-hidden border-none bg-white/90 shadow-custom backdrop-blur">
        <div className="absolute inset-0 bg-gradient-to-br from-examprep-kaabe-maroon/5 to-examprep-kaabe-light-maroon/5" />
        <CardContent className="relative p-8">
          <div className="mb-6 flex flex-col items-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-examprep-kaabe-maroon">
              Upgrade Successful!
            </h2>
            <p className="mt-1 text-examprep-kaabe-light-brown">
              You now have full access to all Pro features
            </p>
          </div>

          <div className="mb-6 rounded-lg bg-examprep-kaabe-cream/30 p-5 border border-examprep-kaabe-light-maroon/10">
            <h3 className="mb-3 font-medium text-examprep-kaabe-brown">
              What's included in your Pro plan:
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                <span className="text-examprep-kaabe-light-brown">
                  Access to 1000+ practice questions across all subjects
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                <span className="text-examprep-kaabe-light-brown">
                  Detailed explanations and solutions for all questions
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                <span className="text-examprep-kaabe-light-brown">
                  Advanced analytics and performance tracking
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                <span className="text-examprep-kaabe-light-brown">
                  Eligibility for monthly reward giveaways
                </span>
              </li>
            </ul>
          </div>

          <div className="text-center">
            <p className="mb-4 text-examprep-kaabe-brown">
              Redirecting to dashboard in{" "}
              <span className="font-bold text-examprep-kaabe-maroon">
                {redirectCountdown}
              </span>{" "}
              seconds...
            </p>
            <Button
              className="bg-examprep-kaabe-maroon hover:bg-examprep-kaabe-brown text-white"
              onClick={onContinue}
            >
              Go to Dashboard Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Confetti() {
  useEffect(() => {
    const confetti = {
      maxCount: 150,
      speed: 3,
      frameInterval: 15,
      alpha: 1.0,
      gradient: false,
      start: null as any,
      stop: null as any,
      toggle: null as any,
      pause: null as any,
      resume: null as any,
      togglePause: null as any,
      remove: null as any,
      isPaused: null as any,
      isRunning: null as any,
    };
    (() => {
      confetti.start = startConfetti;
      confetti.stop = stopConfetti;
      confetti.toggle = toggleConfetti;
      confetti.pause = pauseConfetti;
      confetti.resume = resumeConfetti;
      confetti.togglePause = toggleConfettiPause;
      confetti.isPaused = isConfettiPaused;
      confetti.remove = removeConfetti;
      confetti.isRunning = isConfettiRunning;
      const supportsAnimationFrame =
        window.requestAnimationFrame || window.webkitRequestAnimationFrame;
      const colors = [
        "rgba(141,44,44,",
        "rgba(173,76,76,",
        "rgba(245,242,234,",
        "rgba(62,39,35,",
      ];
      let streamingConfetti = false;
      const animationTimer: any = null;
      let pause = false;
      const lastFrameTime = Date.now();
      const particles: any[] = [];
      const waveAngle = 0;
      const context = (window as any).confetti?.context || null;

      let canvas: HTMLCanvasElement | null = document.createElement("canvas");
      canvas.style.position = "fixed";
      canvas.style.top = "0px";
      canvas.style.left = "0px";
      canvas.style.pointerEvents = "none";
      canvas.style.zIndex = "9999";
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      document.body.appendChild(canvas);
      const ctx = canvas.getContext("2d");

      function setCanvasSize() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        (window as any).confetti = { context: ctx };
      }

      window.addEventListener("resize", setCanvasSize, true);

      function toggleConfetti() {
        if (isConfettiRunning()) {
          stopConfetti();
        } else {
          startConfetti();
        }
      }

      function isConfettiRunning() {
        return streamingConfetti;
      }

      function startConfetti() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        window.requestAnimationFrame =
          window.requestAnimationFrame || window.webkitRequestAnimationFrame;
        let animationTimer: any = null;

        function runAnimation() {
          if (!canvas || !ctx) return;
          const now = Date.now();
          const delta = now - lastFrameTime;
          if (!streamingConfetti && particles.length === 0) {
            ctx.clearRect(0, 0, width, height);
            animationTimer = null;
            return;
          }
          if (animationTimer === null) {
            animationTimer = requestAnimationFrame(runAnimation);
            return;
          }
          const count = confetti.maxCount;
          if (streamingConfetti) {
            if (particles.length < count) {
              particles.push(resetParticle({}, width, height));
            }
          }
          ctx.clearRect(0, 0, width, height);
          particles.forEach((particle, index) => {
            if (!particle) return;
            particle.y += (particle.velocity.y * delta) / 1000;
            particle.x += (particle.velocity.x * delta) / 1000;
            particle.y += Math.cos(particle.wobble) * 5;
            particle.wobble += (0.1 * delta) / 1000;
            particle.velocity.y += 0.1 * (delta / 1000);
            if (particle.y >= height) {
              if (streamingConfetti) {
                particles[index] = resetParticle(particle, width, height);
              } else {
                particles.splice(index, 1);
              }
            }
            if (particle.x >= width || particle.x <= 0) {
              if (streamingConfetti) {
                particles[index] = resetParticle(particle, width, height);
              } else {
                particles.splice(index, 1);
              }
            }
            if (!particle) return;
            if (ctx) {
              ctx.fillStyle = particle.color;
              ctx.beginPath();
              ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
              ctx.closePath();
              ctx.fill();
            }
          });
          animationTimer = requestAnimationFrame(runAnimation);
        }

        for (let i = 0; i < confetti.maxCount; i++) {
          particles.push(resetParticle({}, width, height));
        }
        streamingConfetti = true;
        animationTimer = requestAnimationFrame(runAnimation);
      }

      function resetParticle(particle: any, width: number, height: number) {
        particle = particle || {};
        particle.color =
          colors[Math.floor(Math.random() * colors.length)] +
          (confetti.alpha + ")");
        particle.x = Math.random() * width;
        particle.y = Math.random() * height - height;
        particle.size = Math.random() * (30 - 10) + 10;
        particle.velocity = {
          x: (Math.random() - 0.5) * confetti.speed,
          y: Math.random() * confetti.speed,
        };
        particle.wobble = Math.random() * 10;
        return particle;
      }

      function stopConfetti() {
        streamingConfetti = false;
      }

      function removeConfetti() {
        stopConfetti();
        if (!canvas) return;
        ctx?.clearRect(0, 0, window.innerWidth, window.innerHeight);
        document.body.removeChild(canvas);
        canvas = null;
      }

      function toggleConfettiPause() {
        if (pause) resumeConfetti();
        else pauseConfetti();
      }

      function pauseConfetti() {
        pause = true;
      }

      function resumeConfetti() {
        pause = false;
      }

      function isConfettiPaused() {
        return pause;
      }

      startConfetti();

      setTimeout(() => {
        stopConfetti();
      }, 8000);
    })();

    return () => {
      const removeConfetti = (window as any).confetti?.remove;
      if (typeof removeConfetti === "function") {
        removeConfetti();
      }
    };
  }, []);

  return null;
}
