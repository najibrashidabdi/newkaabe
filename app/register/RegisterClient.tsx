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
  User,
  School,
  Mail,
  Phone,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    fullName: "",
    schoolName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validateStep1 = () => {
    if (!form.fullName || !form.schoolName) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!form.email || !form.phoneNumber) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!form.password) {
      toast({
        title: "Missing password",
        description: "Please enter a password.",
        variant: "destructive",
      });
      return false;
    }

    if (form.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return false;
    }

    if (form.password !== form.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep3()) return;

    setIsLoading(true);

    try {
      await api("/api/auth/register/", "POST", {
        full_name: form.fullName,
        school_name: form.schoolName,
        email: form.email,
        phone_number: form.phoneNumber,
        password: form.password,
      });

      toast({
        title: "Verification code sent!",
        description: "Check your email and enter the 6-digit code.",
      });

      sessionStorage.setItem(
        "registrationData",
        JSON.stringify({ email: form.email })
      );

      // Add a small delay for better UX
      setTimeout(() => {
        router.push("/verify");
      }, 1000);
    } catch (err: any) {
      let msg = "Something went wrong. Please try again.";

      if (typeof err === "object" && err !== null) {
        if ("detail" in err) {
          msg = err.detail;
        } else if (Array.isArray(err.email)) {
          msg = err.email[0];
        } else if (Array.isArray(err.full_name)) {
          msg = err.full_name[0];
        }
      }

      toast({
        title: "Registration failed",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null; // Prevent hydration issues
  }

  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

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
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm hover:text-examprep-kaabe-maroon transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />{" "}
            Back to home
          </Link>
        </motion.div>

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
              animate={{ width: `${(currentStep / 3) * 100}%` }}
              transition={{ duration: 0.8 }}
              className="absolute top-0 left-0 h-1 bg-kaabe-gradient"
            />
            <CardTitle className="text-2xl font-bold">
              Create an account
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Step 1: Tell us about yourself"}
              {currentStep === 2 && "Step 2: Contact information"}
              {currentStep === 3 && "Step 3: Create your password"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={formVariants}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="fullName"
                        className="flex items-center gap-2"
                      >
                        <User className="h-4 w-4 text-examprep-kaabe-maroon" />
                        Full name
                      </Label>
                      <div className="relative">
                        <Input
                          id="fullName"
                          name="fullName"
                          value={form.fullName}
                          onChange={onChange}
                          required
                          className="pl-3 border-examprep-kaabe-maroon/20 focus:border-examprep-kaabe-maroon focus:ring-examprep-kaabe-maroon/30"
                        />
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: form.fullName ? "100%" : "0%" }}
                          className="absolute bottom-0 left-0 w-0.5 bg-examprep-kaabe-maroon"
                        />
                      </div>
                    </div>

                    {/* School Name */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="schoolName"
                        className="flex items-center gap-2"
                      >
                        <School className="h-4 w-4 text-examprep-kaabe-maroon" />
                        School name
                      </Label>
                      <div className="relative">
                        <Input
                          id="schoolName"
                          name="schoolName"
                          value={form.schoolName}
                          onChange={onChange}
                          required
                          className="pl-3 border-examprep-kaabe-maroon/20 focus:border-examprep-kaabe-maroon focus:ring-examprep-kaabe-maroon/30"
                        />
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: form.schoolName ? "100%" : "0%" }}
                          className="absolute bottom-0 left-0 w-0.5 bg-examprep-kaabe-maroon"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={formVariants}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {/* Email */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4 text-examprep-kaabe-maroon" />
                        Email
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={onChange}
                          required
                          className="pl-3 border-examprep-kaabe-maroon/20 focus:border-examprep-kaabe-maroon focus:ring-examprep-kaabe-maroon/30"
                        />
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: form.email ? "100%" : "0%" }}
                          className="absolute bottom-0 left-0 w-0.5 bg-examprep-kaabe-maroon"
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="phoneNumber"
                        className="flex items-center gap-2"
                      >
                        <Phone className="h-4 w-4 text-examprep-kaabe-maroon" />
                        Phone number
                      </Label>
                      <div className="relative">
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          value={form.phoneNumber}
                          onChange={onChange}
                          required
                          className="pl-3 border-examprep-kaabe-maroon/20 focus:border-examprep-kaabe-maroon focus:ring-examprep-kaabe-maroon/30"
                        />
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: form.phoneNumber ? "100%" : "0%" }}
                          className="absolute bottom-0 left-0 w-0.5 bg-examprep-kaabe-maroon"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={formVariants}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {/* Password */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="flex items-center gap-2"
                      >
                        <Lock className="h-4 w-4 text-examprep-kaabe-maroon" />
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          minLength={6}
                          value={form.password}
                          onChange={onChange}
                          required
                          className="pl-3 border-examprep-kaabe-maroon/20 focus:border-examprep-kaabe-maroon focus:ring-examprep-kaabe-maroon/30"
                        />
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: form.password ? "100%" : "0%" }}
                          className="absolute bottom-0 left-0 w-0.5 bg-examprep-kaabe-maroon"
                        />
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="flex items-center gap-2"
                      >
                        <Lock className="h-4 w-4 text-examprep-kaabe-maroon" />
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={form.confirmPassword}
                          onChange={onChange}
                          required
                          className="pl-3 border-examprep-kaabe-maroon/20 focus:border-examprep-kaabe-maroon focus:ring-examprep-kaabe-maroon/30"
                        />
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{
                            height: form.confirmPassword ? "100%" : "0%",
                          }}
                          className="absolute bottom-0 left-0 w-0.5 bg-examprep-kaabe-maroon"
                        />
                      </div>
                      {form.password &&
                        form.confirmPassword &&
                        form.password !== form.confirmPassword && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-500 text-xs mt-1"
                          >
                            Passwords don't match
                          </motion.p>
                        )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between mt-6">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="border-examprep-kaabe-maroon/20 hover:bg-examprep-kaabe-maroon/5 hover:text-examprep-kaabe-maroon"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                ) : (
                  <div></div>
                )}

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-kaabe-gradient hover:opacity-90 transition-opacity relative overflow-hidden group"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
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
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-kaabe-gradient hover:opacity-90 transition-opacity relative overflow-hidden group"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating account...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Create account
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
                )}
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pb-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-sm text-center text-muted-foreground"
            >
              By creating an account, you agree to our{" "}
              <Link
                href="/terms"
                className="text-examprep-kaabe-maroon hover:text-examprep-kaabe-light-maroon transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-examprep-kaabe-maroon hover:text-examprep-kaabe-light-maroon transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-sm text-center"
            >
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-examprep-kaabe-maroon hover:text-examprep-kaabe-light-maroon transition-colors font-medium"
              >
                Sign in
              </Link>
            </motion.div>
          </CardFooter>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex justify-center mt-6"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-examprep-kaabe-maroon/30"></div>
            <div className="w-2 h-2 rounded-full bg-examprep-kaabe-maroon/30"></div>
            <div className="w-2 h-2 rounded-full bg-examprep-kaabe-maroon/30"></div>
            <div
              className={`w-2 h-2 rounded-full ${
                currentStep >= 1
                  ? "bg-examprep-kaabe-maroon"
                  : "bg-examprep-kaabe-maroon/30"
              }`}
            ></div>
            <div
              className={`w-2 h-2 rounded-full ${
                currentStep >= 2
                  ? "bg-examprep-kaabe-maroon"
                  : "bg-examprep-kaabe-maroon/30"
              }`}
            ></div>
            <div
              className={`w-2 h-2 rounded-full ${
                currentStep >= 3
                  ? "bg-examprep-kaabe-maroon"
                  : "bg-examprep-kaabe-maroon/30"
              }`}
            ></div>
            <div className="w-2 h-2 rounded-full bg-examprep-kaabe-maroon/30"></div>
            <div className="w-2 h-2 rounded-full bg-examprep-kaabe-maroon/30"></div>
            <div className="w-2 h-2 rounded-full bg-examprep-kaabe-maroon/30"></div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
