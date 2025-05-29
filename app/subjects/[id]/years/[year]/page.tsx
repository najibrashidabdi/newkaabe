"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Lightbulb,
  BookOpenCheck,
  GraduationCap,
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuizButton } from "@/components/quiz-button";

interface QuizItem {
  id: number;
  index: number;
  locked: boolean;
  completed: boolean;
  total_q: number;
}

export default function YearQuizzesPage() {
  const { id: subjectId, year: ysId } = useParams<{
    id: string;
    year: string;
  }>();
  const search = useSearchParams();
  const { toast } = useToast();

  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [subjectName, setSubjectName] = useState("");
  const [yearNumber, setYearNumber] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await api<QuizItem[]>(
        `/api/subjects/${subjectId}/years/${ysId}/quizzes/`
      );
      setQuizzes(data);

      // Get subject and year info
      try {
        const subjectData = await api<{ name: string }>(
          `/api/subjects/${subjectId}/meta/`
        );
        setSubjectName(subjectData.name);

        const yearData = await api<{ year: number }>(
          `/api/subjects/${subjectId}/years/${ysId}/meta/`
        );
        setYearNumber(yearData.year.toString());
      } catch (e) {
        // Fallback if metadata endpoints don't exist
        setSubjectName(`Subject ${subjectId}`);
        setYearNumber(`Year ${ysId}`);
      }
    } catch (e: any) {
      toast({
        title: "Unable to load quizzes",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [ysId, search.get("refresh")]);

  // Find the first non-completed, non-locked quiz
  const currentQuizIndex = quizzes.findIndex((q) => !q.completed && !q.locked);

  return (
    <div className="flex min-h-screen flex-col bg-[#f0e6d9]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-examprep-kaabe-light-maroon/20 bg-[#f0e6d9]/90 backdrop-blur-md shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link
            href={`/subjects/${subjectId}`}
            className="inline-flex items-center gap-2 text-sm text-examprep-kaabe-brown hover:text-examprep-kaabe-maroon transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {subjectName}
          </Link>

          <div className="flex items-center gap-3 font-bold text-xl">
            <div className="h-9 w-9 bg-examprep-kaabe-light-maroon/10 rounded-full flex items-center justify-center text-examprep-kaabe-maroon">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="bg-kaabe-gradient bg-clip-text text-transparent">
              {yearNumber} Quizzes
            </span>
          </div>

          <div className="w-10" />
        </div>
      </header>

      {/* Main content */}
      <main className="container flex-1 py-8">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex h-[400px] items-center justify-center">
              <div className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 border-4 border-examprep-kaabe-light-maroon opacity-25 rounded-full animate-ping"></div>
                  <div className="w-16 h-16 border-4 border-t-examprep-kaabe-maroon border-l-examprep-kaabe-light-maroon border-r-examprep-kaabe-light-brown border-b-examprep-kaabe-brown rounded-full animate-spin"></div>
                </div>
                <p className="text-sm text-examprep-kaabe-brown font-medium animate-pulse-gentle">
                  Loading quizzes...
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Quiz path */}
              <div className="flex flex-col items-center py-8">
                <div className="relative w-full sm:w-[70%] flex flex-col items-center">
                  {/* Path line */}
                  <div className="absolute top-12 bottom-12 w-1 bg-examprep-kaabe-cream z-0"></div>

                  {/* Quiz buttons */}
                  {quizzes.map((quiz, index) => (
                    <QuizButton
                      key={quiz.id}
                      id={quiz.id}
                      index={index}
                      totalCount={quizzes.length}
                      locked={quiz.locked}
                      current={index === currentQuizIndex}
                      completed={quiz.completed}
                      subjectId={subjectId}
                      yearId={ysId}
                      quizId={quiz.id}
                    />
                  ))}
                </div>
              </div>

              {/* Explanatory cards */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-examprep-kaabe-maroon flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      How Quizzes Work
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-examprep-kaabe-brown text-sm">
                      Follow the path and complete each quiz to master this
                      year's content. Each quiz focuses on specific topics and
                      builds upon previous knowledge. Complete quizzes in order
                      to unlock the next ones.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-examprep-kaabe-maroon flex items-center gap-2">
                      <BookOpenCheck className="h-5 w-5" />
                      Study Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-examprep-kaabe-brown text-sm">
                      Review your textbook materials before attempting each
                      quiz. Take notes during quizzes and revisit challenging
                      questions. You can retake completed quizzes anytime to
                      reinforce your learning.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-examprep-kaabe-maroon flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Year {yearNumber} Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-examprep-kaabe-brown text-sm mb-4">
                    This year covers essential concepts that build a strong
                    foundation for your studies. The curriculum includes
                    theoretical frameworks, practical applications, and critical
                    analysis of key topics.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-examprep-kaabe-maroon"></div>
                      <span className="text-examprep-kaabe-brown">
                        Core Principles
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-examprep-kaabe-maroon"></div>
                      <span className="text-examprep-kaabe-brown">
                        Advanced Techniques
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-examprep-kaabe-maroon"></div>
                      <span className="text-examprep-kaabe-brown">
                        Case Studies
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-examprep-kaabe-maroon"></div>
                      <span className="text-examprep-kaabe-brown">
                        Practical Applications
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
