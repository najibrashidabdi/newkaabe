"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Award, Clock, CheckCircle, XCircle } from "lucide-react";
import Confetti from "react-confetti";

import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

/* ───────── types mirroring backend ───────── */
interface ResultItem {
  id: number;
  question_type: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  user_answer: string | null;
  is_correct: boolean;
}
interface ResultPayload {
  total_time_sec: number;
  score: number; // 0‑100
  items: ResultItem[];
}
/* ──────────────────────────────────────────── */

export default function QuizResultPage() {
  /* route params */
  const {
    id: subjectId,
    year: ysId,
    quizId,
  } = useParams<{
    id?: string;
    year?: string;
    quizId?: string;
  }>();

  const router = useRouter();
  const { toast } = useToast();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [res, setRes] = useState<ResultPayload | null>(null);
  const [loading, setLoad] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);

  /* guard against bad URL */
  const checkRouteParams = () => {
    if (!quizId || !subjectId || !ysId) {
      toast({
        title: "Invalid URL",
        description: "Missing route parameters",
        variant: "destructive",
      });
      router.back();
    }
  };

  useEffect(() => {
    checkRouteParams();
  }, [quizId, subjectId, ysId, toast]);

  /* fetch */
  useEffect(() => {
    (async () => {
      try {
        const data = await api<ResultPayload>(`/api/quiz/${quizId}/result/`);
        setRes(data);
      } catch (e: any) {
        toast({
          title: "Error",
          description: e.message,
          variant: "destructive",
        });
      } finally {
        setLoad(false);
      }
    })();

    // Set window size for confetti
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);

    // Hide confetti after 8 seconds
    const timer = setTimeout(() => setShowConfetti(false), 8000);

    return () => {
      window.removeEventListener("resize", updateWindowSize);
      clearTimeout(timer);
    };
  }, [quizId, toast]);

  /* loading spinner */
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-examprep-kaabe-beige">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-examprep-kaabe-light-maroon opacity-25 rounded-full animate-ping"></div>
            <div className="w-16 h-16 border-4 border-t-examprep-kaabe-maroon border-l-examprep-kaabe-light-maroon border-r-examprep-kaabe-light-brown border-b-examprep-kaabe-brown rounded-full animate-spin"></div>
          </div>
          <p className="text-sm text-examprep-kaabe-brown font-medium animate-pulse-gentle">
            Calculating your results...
          </p>
        </div>
      </div>
    );
  if (!res) return null;

  /* pass / fail badge (≥50 %) */
  const passed = res.score >= 50;

  /* format time */
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  /* de‑duplicate any accidental repeats */
  const uniqueItems = Array.from(
    new Map(res.items.map((i) => [i.id, i])).values()
  );

  /* ───────── render ───────── */
  return (
    <div className="min-h-screen bg-examprep-kaabe-beige flex flex-col">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={passed ? 500 : 100}
          tweenDuration={10000}
          colors={
            passed
              ? ["#8d2c2c", "#ad4c4c", "#5e4743", "#3e2723", "#b25f5f"]
              : ["#8d2c2c"]
          }
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-examprep-kaabe-light-maroon/20 bg-examprep-kaabe-beige/80 backdrop-blur-md">
        <div className="container flex h-16 items-center">
          <Button
            variant="ghost"
            onClick={() => router.push(`/subjects/${subjectId}/years/${ysId}`)}
            className="text-examprep-kaabe-brown hover:text-examprep-kaabe-maroon"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to quizzes
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="container flex-1 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Results summary card */}
          <Card className="overflow-hidden relative border-none shadow-custom bg-white animate-scale-in">
            <div className="absolute inset-0 bg-kaabe-gradient-light opacity-30" />
            <CardHeader className="relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="text-2xl text-examprep-kaabe-maroon flex items-center gap-2">
                  <Award className="h-6 w-6" />
                  Quiz Results
                  <span
                    className={`ml-2 text-xs font-semibold px-2 py-1 rounded-full ${
                      passed
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {passed ? "PASSED" : "FAILED"}
                  </span>
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent className="relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Score card */}
                <div className="bg-white/70 rounded-xl border border-examprep-kaabe-light-maroon/10 p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-examprep-kaabe-light-maroon/10 flex items-center justify-center">
                      <Award className="h-5 w-5 text-examprep-kaabe-maroon" />
                    </div>
                    <div>
                      <h3 className="font-medium text-examprep-kaabe-brown">
                        Score
                      </h3>
                      <p className="text-2xl font-bold text-examprep-kaabe-maroon">
                        {Math.round(res.score)}%
                      </p>
                    </div>
                  </div>
                  <Progress
                    value={res.score}
                    className="h-2 bg-examprep-kaabe-cream"
                    indicatorClassName="bg-examprep-kaabe-maroon"
                  />
                </div>

                {/* Time card */}
                <div className="bg-white/70 rounded-xl border border-examprep-kaabe-light-maroon/10 p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-examprep-kaabe-light-maroon/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-examprep-kaabe-maroon" />
                    </div>
                    <div>
                      <h3 className="font-medium text-examprep-kaabe-brown">
                        Total Time
                      </h3>
                      <p className="text-2xl font-bold text-examprep-kaabe-maroon">
                        {formatTime(res.total_time_sec)}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-examprep-kaabe-light-brown">
                    {res.total_time_sec < 60
                      ? "Impressive speed!"
                      : res.total_time_sec < 180
                      ? "Good pace!"
                      : "Take your time to learn thoroughly."}
                  </div>
                </div>
              </div>

              {/* Summary stats */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white/70 rounded-lg border border-examprep-kaabe-light-maroon/10 p-3 text-center">
                  <p className="text-sm text-examprep-kaabe-light-brown">
                    Total Questions
                  </p>
                  <p className="text-xl font-bold text-examprep-kaabe-brown">
                    {uniqueItems.length}
                  </p>
                </div>
                <div className="bg-white/70 rounded-lg border border-examprep-kaabe-light-maroon/10 p-3 text-center">
                  <p className="text-sm text-examprep-kaabe-light-brown">
                    Correct
                  </p>
                  <p className="text-xl font-bold text-green-600">
                    {uniqueItems.filter((i) => i.is_correct).length}
                  </p>
                </div>
                <div className="bg-white/70 rounded-lg border border-examprep-kaabe-light-maroon/10 p-3 text-center">
                  <p className="text-sm text-examprep-kaabe-light-brown">
                    Incorrect
                  </p>
                  <p className="text-xl font-bold text-red-600">
                    {uniqueItems.filter((i) => !i.is_correct).length}
                  </p>
                </div>
                <div className="bg-white/70 rounded-lg border border-examprep-kaabe-light-maroon/10 p-3 text-center">
                  <p className="text-sm text-examprep-kaabe-light-brown">
                    Avg. Time
                  </p>
                  <p className="text-xl font-bold text-examprep-kaabe-brown">
                    {formatTime(
                      Math.round(res.total_time_sec / uniqueItems.length)
                    )}
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="relative border-t border-examprep-kaabe-light-maroon/10 bg-white/50 flex flex-col sm:flex-row gap-4 justify-between">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-examprep-kaabe-maroon text-examprep-kaabe-maroon hover:bg-examprep-kaabe-maroon hover:text-white"
                onClick={() =>
                  router.push(`/subjects/${subjectId}/years/${ysId}`)
                }
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Quizzes
              </Button>
              <Button
                className="w-full sm:w-auto bg-examprep-kaabe-maroon hover:bg-examprep-kaabe-brown text-white"
                onClick={() =>
                  router.push(
                    `/subjects/${subjectId}/years/${ysId}/quiz/${quizId}`
                  )
                }
              >
                Retry Quiz
              </Button>
            </CardFooter>
          </Card>

          {/* Question review */}
          <h2 className="text-xl font-bold text-examprep-kaabe-brown mt-8 mb-4">
            Question Review
          </h2>
          <div className="space-y-6">
            {uniqueItems.map((item, idx) => (
              <Card
                key={`${item.id}-${idx}`}
                className="overflow-hidden relative border-none shadow-custom bg-white animate-fade-in"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="absolute inset-0 bg-kaabe-gradient-light opacity-30" />
                <CardHeader className="relative border-b border-examprep-kaabe-light-maroon/10 pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg text-examprep-kaabe-brown">
                      Question {idx + 1}
                    </CardTitle>
                    {item.is_correct ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-5 w-5 mr-1" />
                        <span className="text-sm font-medium">Correct</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <XCircle className="h-5 w-5 mr-1" />
                        <span className="text-sm font-medium">Incorrect</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="relative pt-4">
                  <p className="font-medium text-examprep-kaabe-brown mb-4">
                    {item.question_text}
                  </p>

                  <div className="space-y-3 mb-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-examprep-kaabe-light-brown mb-1">
                        Your Answer:
                      </span>
                      <div
                        className={`p-2 rounded-md ${
                          item.is_correct
                            ? "bg-green-50 border border-green-200"
                            : "bg-red-50 border border-red-200"
                        }`}
                      >
                        <p
                          className={`text-sm ${
                            item.is_correct ? "text-green-700" : "text-red-700"
                          }`}
                        >
                          {item.user_answer || "No answer provided"}
                        </p>
                      </div>
                    </div>

                    {!item.is_correct && (
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-examprep-kaabe-light-brown mb-1">
                          Correct Answer:
                        </span>
                        <div className="p-2 rounded-md bg-green-50 border border-green-200">
                          <p className="text-sm text-green-700">
                            {item.correct_answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {item.explanation && (
                    <div className="mt-4 p-3 bg-examprep-kaabe-cream/30 rounded-md border border-examprep-kaabe-light-maroon/10">
                      <h4 className="text-sm font-medium text-examprep-kaabe-maroon mb-1">
                        Explanation:
                      </h4>
                      <p className="text-sm text-examprep-kaabe-brown">
                        {item.explanation}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
