"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  Lock,
  BookOpen,
  Calendar,
  ChevronRight,
} from "lucide-react";

import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

/* fallback emoji if backend has no icon */
const defaultIcon = "📚";

/* ───────── Types ───────── */
interface YearItem {
  id: number;
  year: number;
  locked: boolean;
  progress: number;
  quiz_cnt: number;
}
interface SubjectMeta {
  id: number;
  name: string;
  icon: string;
}

export default function SubjectPage() {
  const { id: sid } = useParams<{ id: string }>();
  const { toast } = useToast();

  const [meta, setMeta] = useState<SubjectMeta | null>(null);
  const [years, setYears] = useState<YearItem[]>([]);
  const [loading, setLoad] = useState(true);

  /* fetch meta + years in parallel */
  useEffect(() => {
    (async () => {
      try {
        const [m, ys] = await Promise.all([
          api<SubjectMeta>(`/api/subjects/${sid}/meta/`),
          api<YearItem[]>(`/api/subjects/${sid}/years/`),
        ]);
        setMeta(m);
        setYears(ys);
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
  }, [sid, toast]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-examprep-kaabe-beige">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-examprep-kaabe-light-maroon opacity-25 rounded-full animate-ping"></div>
            <div className="w-16 h-16 border-4 border-t-examprep-kaabe-maroon border-l-examprep-kaabe-light-maroon border-r-examprep-kaabe-light-brown border-b-examprep-kaabe-brown rounded-full animate-spin"></div>
          </div>
          <p className="text-sm text-examprep-kaabe-brown font-medium animate-pulse-gentle">
            Loading subject details...
          </p>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen flex-col bg-examprep-kaabe-beige">
      {/* nav */}
      <header className="sticky top-0 z-50 w-full border-b border-examprep-kaabe-light-maroon/20 bg-examprep-kaabe-beige/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-examprep-kaabe-brown hover:text-examprep-kaabe-maroon transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>

          <div className="flex items-center gap-3 font-bold text-xl">
            <div className="h-9 w-9 bg-examprep-kaabe-light-maroon/10 rounded-full flex items-center justify-center text-examprep-kaabe-maroon">
              {meta?.icon ? (
                <span className="text-xl">{meta.icon}</span>
              ) : (
                <BookOpen className="h-5 w-5" />
              )}
            </div>
            <span className="bg-kaabe-gradient bg-clip-text text-transparent">
              {meta?.name || `Subject ${sid}`}
            </span>
          </div>

          <div className="w-10" />
        </div>
      </header>

      {/* years grid */}
      <main className="container flex-1 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center gap-3 animate-fade-in">
            <Calendar className="h-6 w-6 text-examprep-kaabe-maroon" />
            <h2 className="text-2xl font-bold text-examprep-kaabe-brown tracking-tight">
              Exam Years
            </h2>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {years.map((y, index) => (
              <Card
                key={y.id}
                className={`overflow-hidden relative border-none shadow-custom 
                  ${
                    y.locked
                      ? "bg-gradient-to-br from-white/60 to-examprep-kaabe-cream/70 grayscale-[30%]"
                      : "bg-gradient-to-br from-white/70 to-examprep-kaabe-cream/90 backdrop-blur"
                  } 
                  transition-all duration-300 hover:-translate-y-1 animate-scale-in`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute inset-0 bg-kaabe-gradient-light" />

                <CardHeader className="relative p-4 pb-2">
                  <CardTitle className="flex items-center justify-between text-xl text-examprep-kaabe-brown">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full 
                        ${
                          y.locked
                            ? "bg-examprep-kaabe-cream/70 text-examprep-kaabe-light-brown"
                            : "bg-examprep-kaabe-light-maroon/10 text-examprep-kaabe-maroon"
                        }`}
                      >
                        {y.year}
                      </div>
                      <span>Year {y.year}</span>
                    </div>

                    {y.locked ? (
                      <Lock className="h-4 w-4 text-examprep-kaabe-light-brown" />
                    ) : y.progress === 100 ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : null}
                  </CardTitle>
                </CardHeader>

                <CardContent className="relative p-4 pt-2">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span
                      className={
                        y.locked
                          ? "text-examprep-kaabe-light-brown"
                          : "text-examprep-kaabe-light-brown"
                      }
                    >
                      {y.quiz_cnt} quizzes
                    </span>
                    <span
                      className={`font-medium ${
                        y.locked
                          ? "text-examprep-kaabe-light-brown"
                          : "text-examprep-kaabe-maroon"
                      }`}
                    >
                      {y.progress}% complete
                    </span>
                  </div>

                  <Progress
                    value={y.progress}
                    className={`h-1.5 ${
                      y.locked
                        ? "bg-examprep-kaabe-cream/50"
                        : "bg-examprep-kaabe-cream progress-fill-maroon"
                    }`}
                  />
                </CardContent>

                <CardFooter className="relative p-4 pt-2">
                  {y.locked ? (
                    <Button
                      disabled
                      className="w-full bg-examprep-kaabe-light-maroon/50 text-white/70"
                    >
                      <Lock className="mr-1 h-3.5 w-3.5" />
                      Locked
                    </Button>
                  ) : (
                    <Button
                      asChild
                      className="w-full bg-examprep-kaabe-maroon hover:bg-examprep-kaabe-brown text-white transition-colors"
                    >
                      <Link href={`/subjects/${sid}/years/${y.id}`}>
                        Start Quizzes
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          {years.length === 0 && !loading && (
            <div className="text-center p-8 max-w-md mx-auto bg-white/70 backdrop-blur-sm rounded-xl shadow-custom border border-examprep-kaabe-light-maroon/20 animate-scale-in">
              <div className="w-16 h-16 bg-examprep-kaabe-light-maroon/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-examprep-kaabe-maroon opacity-70" />
              </div>
              <p className="text-lg font-semibold text-examprep-kaabe-maroon mb-2">
                No Years Available
              </p>
              <p className="text-sm text-examprep-kaabe-brown mb-4">
                This subject doesn't have any exam years yet.
              </p>
              <Button
                className="bg-examprep-kaabe-maroon hover:bg-examprep-kaabe-brown text-white transition-colors"
                asChild
              >
                <Link href="/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
