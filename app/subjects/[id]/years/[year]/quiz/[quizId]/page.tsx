"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, Loader2 } from "lucide-react";

import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

/* ───────── Question‑type components ───────── */
import MultipleChoice from "@/components/questions/MultipleChoiceQuestion";
import FillGaps from "@/components/questions/FillGapsQuestion";
import Structured from "@/components/questions/StructuredQuestion";
import LabelDrawing from "@/components/questions/LabelDrawingQuestion";
import Synonym from "@/components/questions/SynonymQuestion";
import WordList from "@/components/questions/WordListQuestion";
import MatchWords from "@/components/questions/MatchWordsQuestion";
import Composition from "@/components/questions/CompositionQuestion";

/* ───────── Types ───────── */
export type QuestionType =
  | "MULTIPLE_CHOICE"
  | "FILL_GAPS"
  | "STRUCTURED"
  | "LABEL_DRAWING"
  | "SYNONYM"
  | "WORD_LIST"
  | "MATCH_WORDS"
  | "COMPOSITION";

interface QuestionStepPayload {
  total: number;
  question_type: QuestionType;
  question: { id: number; text: string; points: number };
  detail: any;
}

/* ───────── Component ───────── */
export default function QuizPage() {
  /* route params */
  const {
    id: subjectId,
    year: ysId,
    quizId,
  } = useParams<{
    id: string;
    year: string;
    quizId: string;
  }>();
  const router = useRouter();
  const { toast } = useToast();

  /* state */
  const [step, setStep] = useState<QuestionStepPayload | null>(null);
  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(0);
  const [ans, setAns] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [showEncouragement, setShowEncouragement] = useState(false);

  /* timers */
  const [elapsed, setElapsed] = useState(0);
  const quizStart = useRef<Date | null>(null);
  const qStart = useRef<Date | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  /* ───────── initial load + reset ping ───────── */
  useEffect(() => {
    (async () => {
      /* tell backend to wipe previous run */
      await api("/api/quiz/attempt/", "POST", {
        question_id: -2, // sentinel for "reset"
        restart: true,
        quiz_id: quizId,
      });

      /* then pull first question */
      await loadStep(0);
    })();

    quizStart.current = new Date();
    qStart.current = new Date();

    timerRef.current = setInterval(() => {
      if (quizStart.current) {
        setElapsed(
          Math.floor((Date.now() - quizStart.current.getTime()) / 1000)
        );
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Show encouragement message when halfway through */
  useEffect(() => {
    if (index > 0 && index === Math.floor(total / 2)) {
      setShowEncouragement(true);
      setTimeout(() => setShowEncouragement(false), 5000);
    }
  }, [index, total]);

  /* ───────── helpers ───────── */
  async function loadStep(i: number) {
    setLoading(true);
    try {
      const data = await api<QuestionStepPayload>(`/api/quiz/${quizId}/${i}/`);
      setStep(data);
      setTotal(data.total);
      setIndex(i);
      qStart.current = new Date();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  async function submitCurrent() {
    if (!step || qStart.current == null) return;
    setPosting(true);

    const secs = Math.floor((Date.now() - qStart.current.getTime()) / 1000);

    try {
      await api("/api/quiz/attempt/", "POST", {
        question_id: step.question.id,
        answer: ans[index],
        question_type: step.question_type, // Add question type to help backend validate
        time_sec: secs,
      });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setPosting(false);
    }
  }

  /* render specific question component */
  function renderQuestion() {
    if (!step) return null;
    const common = {
      answer: ans[index] ?? null,
      disabled: posting,
      onAnswer: (val: string) => setAns((p) => ({ ...p, [index]: val })),
    };
    switch (step.question_type) {
      case "MULTIPLE_CHOICE":
        return <MultipleChoice {...common} detail={step.detail} />;
      case "FILL_GAPS":
        return <FillGaps {...common} detail={step.detail} />;
      case "STRUCTURED":
        return <Structured {...common} detail={step.detail} />;
      case "LABEL_DRAWING":
        return <LabelDrawing {...common} detail={step.detail} />;
      case "SYNONYM":
        return <Synonym {...common} detail={step.detail} />;
      case "WORD_LIST":
        return <WordList {...common} detail={step.detail} />;
      case "MATCH_WORDS":
        return <MatchWords {...common} detail={step.detail} />;
      case "COMPOSITION":
        return <Composition {...common} detail={step.detail} />;
      default:
        return <p>Unsupported type.</p>;
    }
  }

  /* nav */
  const canNext = index + 1 < total;

  async function next() {
    if (ans[index] == null) {
      toast({ title: "Pick an answer first 👍" });
      return;
    }
    await submitCurrent();

    if (canNext) {
      loadStep(index + 1);
    } else {
      clearInterval(timerRef.current);

      await api("/api/quiz/attempt/", "POST", {
        question_id: -1,
        answer: "",
        time_sec: elapsed,
        finish: true,
      });

      router.push(`/subjects/${subjectId}/years/${ysId}/quiz/${quizId}/result`);
    }
  }

  /* clock mm:ss */
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  /* ───────── UI ───────── */
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top navigation bar */}
      <div className="border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="text-gray-500"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          {/* Progress bar */}
          <div className="flex-1 mx-4">
            <Progress
              value={total ? ((index + 1) / total) * 100 : 0}
              className="h-3 bg-gray-100"
              indicatorClassName="bg-examprep-kaabe-maroon"
            />
          </div>

          {/* Timer */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-examprep-kaabe-maroon font-bold">
              <Clock className="h-5 w-5" />
              <span>
                {mm}:{ss}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto px-4 py-6 w-full">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Quiz Challenge
        </h1>

        {/* Encouragement message */}
        {showEncouragement && (
          <div className="flex flex-col sm:flex-row items-start gap-4 mb-6 animate-fade-in">
            <div className="w-16 h-16 bg-examprep-kaabe-light-maroon/20 rounded-lg flex items-center justify-center">
              <div className="w-12 h-12 bg-examprep-kaabe-maroon rounded-lg flex items-center justify-center text-white text-2xl">
                😊
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm relative">
              <div className="absolute left-[-8px] top-4 w-4 h-4 bg-white border-l border-b border-gray-200 transform rotate-45 hidden sm:block"></div>
              <p className="text-gray-700">
                Halfway through this quiz! Keep it up!
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex-1 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-examprep-kaabe-maroon" />
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Question - centered */}
            <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm w-full">
                <p className="text-lg font-medium text-gray-800 mb-6">
                  {step?.question.text}
                </p>

                {/* Question content */}
                {step?.question_type === "COMPOSITION" ? (
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Write your answer here..."
                      className="min-h-[150px] border-gray-300 focus:border-examprep-kaabe-maroon focus:ring-examprep-kaabe-maroon"
                      value={ans[index] || ""}
                      onChange={(e) =>
                        setAns((p) => ({ ...p, [index]: e.target.value }))
                      }
                      disabled={posting}
                    />
                  </div>
                ) : (
                  renderQuestion()
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer with dividing line and button */}
      <footer className="mt-auto border-t border-gray-200 py-4 px-4 bg-white">
        <div className="max-w-4xl mx-auto flex justify-end">
          <Button
            onClick={next}
            disabled={posting || !ans[index]}
            className="bg-[#58cc02] hover:bg-[#58cc02]/90 text-white font-bold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            {canNext ? "CHECK" : "FINISH"}
          </Button>
        </div>
      </footer>
    </div>
  );
}
