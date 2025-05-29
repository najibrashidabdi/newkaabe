"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (form.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    if (!form.schoolName.trim()) {
      newErrors.schoolName = "School name is required";
    } else if (form.schoolName.trim().length < 2) {
      newErrors.schoolName = "School name must be at least 2 characters";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast({
        title: "Please fix the errors",
        description: "Check the highlighted fields and try again.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!form.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^[+]?[0-9\s\-$$$$]{10,}$/.test(form.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast({
        title: "Please fix the errors",
        description: "Check the highlighted fields and try again.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast({
        title: "Please fix the errors",
        description: "Check the highlighted fields and try again.",
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
    setErrors({});

    try {
      console.log("🚀 Starting registration process...");

      const registrationData = {
        full_name: form.fullName.trim(),
        school_name: form.schoolName.trim(),
        email: form.email.trim().toLowerCase(),
        phone_number: form.phoneNumber.trim(),
        password: form.password,
      };

      console.log("📦 Registration data:", {
        ...registrationData,
        password: "[HIDDEN]",
      });

      const response = await api(
        "/api/auth/register/",
        "POST",
        registrationData
      );

      console.log("✅ Registration successful:", response);

      toast({
        title: "Registration successful! 🎉",
        description: "Please check your email for the verification code.",
      });

      // Store email for verification page
      if (typeof window !== "undefined") {
        localStorage.setItem("pending_email", form.email.trim().toLowerCase());
        sessionStorage.setItem(
          "registrationData",
          JSON.stringify({
            email: form.email.trim().toLowerCase(),
            timestamp: Date.now(),
          })
        );
      }

      // Add a small delay for better UX
      setTimeout(() => {
        router.push("/verify");
      }, 1500);
    } catch (error: any) {
      console.error("💥 Registration failed:", error);

      let errorMessage = "Something went wrong. Please try again.";
      const newErrors: Record<string, string> = {};

      if (error.status === 400 && error.data) {
        // Handle field-specific errors
        if (error.data.email) {
          newErrors.email = Array.isArray(error.data.email)
            ? error.data.email[0]
            : error.data.email;
        }
        if (error.data.full_name) {
          newErrors.fullName = Array.isArray(error.data.full_name)
            ? error.data.full_name[0]
            : error.data.full_name;
        }
        if (error.data.phone_number) {
          newErrors.phoneNumber = Array.isArray(error.data.phone_number)
            ? error.data.phone_number[0]
            : error.data.phone_number;
        }
        if (error.data.password) {
          newErrors.password = Array.isArray(error.data.password)
            ? error.data.password[0]
            : error.data.password;
        }

        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          errorMessage = "Please fix the highlighted errors and try again.";
        } else if (error.data.detail) {
          errorMessage = error.data.detail;
        } else if (error.data.non_field_errors) {
          errorMessage = Array.isArray(error.data.non_field_errors)
            ? error.data.non_field_errors[0]
            : error.data.non_field_errors;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Registration failed",
        description: errorMessage,
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

  const getFieldError = (fieldName: string) => errors[fieldName];
  const hasFieldError = (fieldName: string) => !!errors[fieldName];

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
        <motion.div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm hover:text-examprep-kaabe-maroon transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />{" "}
            Back to home
          </Link>
        </motion.div>

        <motion.div className="flex items-center justify-center mb-6">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
            <motion.div className="flex items-center gap-2 text-2xl font-bold">
              <BookOpen className="h-8 w-8 text-examprep-kaabe-maroon" />
              <motion.span className="bg-kaabe-gradient bg-clip-text text-transparent">
                Kaabe
              </motion.span>
            </motion.div>
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
                          className={`pl-3 border-examprep-kaabe-maroon/20 focus:border-examprep-kaabe-maroon focus:ring-examprep-kaabe-maroon/30 ${
                            hasFieldError("fullName")
                              ? "border-red-500 focus:border-red-500"
                              : ""
                          }`}
                          placeholder="Enter your full name"
                        />
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: form.fullName ? "100%" : "0%" }}
                          className="absolute bottom-0 left-0 w-0.5 bg-examprep-kaabe-maroon"
                        />
                      </div>
                      {hasFieldError("fullName") && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {getFieldError("fullName")}
                        </p>
                      )}
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
                          className={`pl-3 border-examprep-kaabe-maroon/20 focus:border-examprep-kaabe-maroon focus:ring-examprep-kaabe-maroon/30 ${
                            hasFieldError("schoolName")
                              ? "border-red-500 focus:border-red-500"
                              : ""
                          }`}
                          placeholder="Enter your school name"
                        />
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: form.schoolName ? "100%" : "0%" }}
                          className="absolute bottom-0 left-0 w-0.5 bg-examprep-kaabe-maroon"
                        />
                      </div>
                      {hasFieldError("schoolName") && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {getFieldError("schoolName")}
                        </p>
                      )}
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
                          className={`pl-3 border-examprep-kaabe-maroon/20 focus:border-examprep-kaabe-maroon focus:ring-examprep-kaabe-maroon/30 ${
                            hasFieldError("email")
                              ? "border-red-500 focus:border-red-500"
                              : ""
                          }`}
                          placeholder="Enter your email address"
                        />
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: form.email ? "100%" : "0%" }}
                          className="absolute bottom-0 left-0 w-0.5 bg-examprep-kaabe-maroon"
                        />
                      </div>
                      {hasFieldError("email") && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {getFieldError("email")}
                        </p>
                      )}
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
                          className={`pl-3 border-examprep-kaabe-maroon/20 focus:border-examprep-kaabe-maroon focus:ring-examprep-kaabe-maroon/30 ${
                            hasFieldError("phoneNumber")
                              ? "border-red-500 focus:border-red-500"
                              : ""
                          }`}
                          placeholder="Enter your phone number"
                        />
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: form.phoneNumber ? "100%" : "0%" }}
                          className="absolute bottom-0 left-0 w-0.5 bg-examprep-kaabe-maroon"
                        />
                      </div>
                      {hasFieldError("phoneNumber") && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {getFieldError("phoneNumber")}
                        </p>
                      )}
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
                          type={showPassword ? "text" : "password"}
                          minLength={8}
                          value={form.password}
                          onChange={onChange}
                          required
                          className={`pl-3 pr-10 border-examprep-kaabe-maroon/20 focus:border-examprep-kaabe-maroon focus:ring-examprep-kaabe-maroon/30 ${
                            hasFieldError("password")
                              ? "border-red-500 focus:border-red-500"
                              : ""
                          }`}
                          placeholder="Create a strong password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-examprep-kaabe-light-brown hover:text-examprep-kaabe-brown"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: form.password ? "100%" : "0%" }}
                          className="absolute bottom-0 left-0 w-0.5 bg-examprep-kaabe-maroon"
                        />
                      </div>
                      {hasFieldError("password") && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {getFieldError("password")}
                        </p>
                      )}
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
                          type={showConfirmPassword ? "text" : "password"}
                          value={form.confirmPassword}
                          onChange={onChange}
                          required
                          className={`pl-3 pr-10 border-examprep-kaabe-maroon/20 focus:border-examprep-kaabe-maroon focus:ring-examprep-kaabe-maroon/30 ${
                            hasFieldError("confirmPassword")
                              ? "border-red-500 focus:border-red-500"
                              : ""
                          }`}
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-3 text-examprep-kaabe-light-brown hover:text-examprep-kaabe-brown"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{
                            height: form.confirmPassword ? "100%" : "0%",
                          }}
                          className="absolute bottom-0 left-0 w-0.5 bg-examprep-kaabe-maroon"
                        />
                      </div>
                      {hasFieldError("confirmPassword") && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {getFieldError("confirmPassword")}
                        </p>
                      )}
                      {form.password &&
                        form.confirmPassword &&
                        form.password === form.confirmPassword && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-green-500 text-xs mt-1 flex items-center gap-1"
                          >
                            <CheckCircle className="h-3 w-3" />
                            Passwords match
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
                    disabled={isLoading}
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
            <motion.div className="text-sm text-center text-muted-foreground">
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

            <motion.div className="text-sm text-center">
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

        <motion.div className="flex justify-center mt-6">
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
