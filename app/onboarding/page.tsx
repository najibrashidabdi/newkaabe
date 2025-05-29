"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle,
  ArrowRight,
  BookOpen,
  Target,
  Award,
  Zap,
} from "lucide-react";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isCompleting, setIsCompleting] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await api("/api/auth/me/");
        setUserName(userData.full_name || "");
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleCompleteOnboarding = async () => {
    setIsCompleting(true);

    try {
      // Mark onboarding as complete
      await api("/api/auth/complete-onboarding/", "POST");

      toast({
        title: "Welcome to Kaabe! 🎉",
        description:
          "Your account setup is complete. Let's get you started with Pro features!",
      });

      // Redirect to subscribe page
      setTimeout(() => {
        router.push("/subscribe");
      }, 1500);
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast({
        title: "Error",
        description: "Failed to complete setup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-examprep-kaabe-beige flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-examprep-kaabe-maroon mb-4">
            Welcome to Kaabe, {userName.split(" ")[0]}! 🎉
          </h1>
          <p className="text-lg text-examprep-kaabe-brown">
            You're all set up! Here's what you can do with Kaabe:
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <FeatureCard
            icon={<BookOpen className="h-8 w-8 text-examprep-kaabe-maroon" />}
            title="Practice Questions"
            description="Access hundreds of practice questions across multiple subjects"
            completed={true}
          />
          <FeatureCard
            icon={<Target className="h-8 w-8 text-examprep-kaabe-maroon" />}
            title="Track Progress"
            description="Monitor your performance and identify areas for improvement"
            completed={true}
          />
          <FeatureCard
            icon={<Award className="h-8 w-8 text-examprep-kaabe-maroon" />}
            title="Compete & Win"
            description="Join leaderboards and participate in monthly reward giveaways"
            completed={false}
            proFeature={true}
          />
        </div>

        <Card className="border-none shadow-custom bg-white/90 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-examprep-kaabe-maroon">
              Ready to Get Started?
            </CardTitle>
            <p className="text-examprep-kaabe-brown mt-2">
              Complete your setup and unlock the full potential of Kaabe
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-examprep-kaabe-cream/50 rounded-full border border-examprep-kaabe-light-maroon/20">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-examprep-kaabe-brown">
                  Account Setup Complete
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-examprep-kaabe-light-brown">
                To access all features and join our community of successful
                students, consider upgrading to Pro.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                  className="border-examprep-kaabe-light-brown text-examprep-kaabe-brown hover:bg-examprep-kaabe-cream"
                >
                  Continue with Free Plan
                </Button>

                <Button
                  onClick={handleCompleteOnboarding}
                  disabled={isCompleting}
                  className="bg-examprep-kaabe-maroon hover:bg-examprep-kaabe-brown text-white"
                >
                  {isCompleting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Setting up...
                    </>
                  ) : (
                    <>
                      Explore Pro Features
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  completed,
  proFeature = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  completed: boolean;
  proFeature?: boolean;
}) {
  return (
    <Card className="border-none shadow-custom bg-white/70 backdrop-blur relative overflow-hidden">
      {proFeature && (
        <div className="absolute top-2 right-2">
          <div className="bg-examprep-kaabe-maroon text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Pro
          </div>
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">{icon}</div>
          <div className="flex-1">
            <h3 className="font-semibold text-examprep-kaabe-brown mb-2">
              {title}
            </h3>
            <p className="text-sm text-examprep-kaabe-light-brown">
              {description}
            </p>
          </div>
          <div className="flex-shrink-0">
            {completed ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <div className="h-5 w-5 rounded-full border-2 border-examprep-kaabe-light-maroon/30" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
