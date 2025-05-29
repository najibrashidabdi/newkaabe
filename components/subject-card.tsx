"use client";

import { Award, BookOpen, ChevronRight, Lock, Zap } from "lucide-react";
import Link from "next/link";
import type { JSX } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SubjectCardProps {
  subject: {
    id: number;
    name: string;
    icon: string;
    questions: number;
  };
  isPro: boolean;
  progress: number;
  onUpgradeClick: () => void;
}

const iconMap: Record<string, JSX.Element> = {
  book:  <BookOpen className="h-5 w-5" />,
  award: <Award    className="h-5 w-5" />,
};

export function SubjectCard({
  subject,
  isPro,
  progress,
  onUpgradeClick,
}: SubjectCardProps) {
  /* ⭐ NEW: every subject requires Pro, no exceptions */
  const requiresPro = !isPro;                            // ← changed line
  /* ──────────────────────────────────────────────── */

  return (
    <Card
      className={`h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 border-none shadow-custom animate-scale-in
        ${
          requiresPro
            ? "bg-gradient-to-br from-white/70 to-examprep-kaabe-cream/80 grayscale-[30%]"
            : "bg-gradient-to-br from-white/70 to-examprep-kaabe-cream/90"
        }`}
      style={{ animationDelay: `${subject.id * 50}ms` }}
    >
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div
            className={`flex items-center justify-center h-10 w-10 rounded-full
              ${
                requiresPro
                  ? "bg-examprep-kaabe-cream/70 text-examprep-kaabe-light-brown"
                  : "bg-examprep-kaabe-light-maroon/10 text-examprep-kaabe-maroon"
              }`}
          >
            {iconMap[subject.icon] ?? <BookOpen className="h-5 w-5" />}
          </div>

          {requiresPro && (
            <div className="bg-examprep-kaabe-cream/70 h-7 w-7 rounded-full flex items-center justify-center">
              <Lock className="h-3.5 w-3.5 text-examprep-kaabe-light-brown" />
            </div>
          )}
        </div>

        <h3
          className={`font-medium text-lg mb-1 ${
            requiresPro
              ? "text-examprep-kaabe-light-brown"
              : "text-examprep-kaabe-brown"
          }`}
        >
          {subject.name}
        </h3>

        <div className="flex items-center justify-between text-xs mb-3">
          <span className="text-examprep-kaabe-light-brown">
            {subject.questions} questions
          </span>
          <span
            className={`font-medium ${
              requiresPro
                ? "text-examprep-kaabe-light-brown"
                : "text-examprep-kaabe-maroon"
            }`}
          >
            {progress}% complete
          </span>
        </div>

        <Progress
          value={progress}
          className={`h-1.5 ${
            requiresPro
              ? "bg-examprep-kaabe-cream/50"
              : "bg-examprep-kaabe-cream progress-fill-maroon"
          }`}
        />
      </CardContent>

      <CardFooter className="pt-0 pb-5 px-5">
        {requiresPro ? (
          <Button
            className="w-full mt-2 bg-examprep-kaabe-light-maroon/80 hover:bg-examprep-kaabe-maroon text-white"
            onClick={onUpgradeClick}
          >
            <Zap className="mr-1 h-4 w-4" />
            Unlock with Pro
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full mt-2 border-examprep-kaabe-light-maroon text-examprep-kaabe-brown hover:bg-examprep-kaabe-light-maroon hover:text-white"
            asChild
          >
            <Link href={`/subjects/${subject.id}`}>
              Study Now
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
