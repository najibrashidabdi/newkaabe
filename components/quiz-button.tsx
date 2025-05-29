"use client";

import { Flag, Lightbulb, Trophy, Lock } from "lucide-react";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import "react-circular-progressbar/dist/styles.css";

type QuizButtonProps = {
  id: number;
  index: number;
  totalCount: number;
  locked?: boolean;
  current?: boolean;
  completed?: boolean;
  subjectId: string;
  yearId: string;
  quizId: number;
};

export const QuizButton = ({
  id,
  index,
  totalCount,
  locked,
  current,
  completed,
  subjectId,
  yearId,
  quizId,
}: QuizButtonProps) => {
  const cycleLength = 8;
  const cycleIndex = index % cycleLength;

  let indentationLevel;

  if (cycleIndex <= 2) {
    indentationLevel = cycleIndex;
  } else if (cycleIndex <= 4) {
    indentationLevel = 4 - cycleIndex;
  } else if (cycleIndex <= 6) {
    indentationLevel = 4 - cycleIndex;
  } else {
    indentationLevel = cycleIndex - 8;
  }

  const rightPosition = indentationLevel * 40;
  const isFirst = index === 0;
  const isLast = index === totalCount - 1;

  const Icon = completed ? Flag : isLast ? Trophy : Lightbulb;

  const href = locked
    ? "#"
    : `/subjects/${subjectId}/years/${yearId}/quiz/${quizId}`;

  return (
    <Link
      href={href}
      aria-disabled={locked}
      style={{ pointerEvents: locked ? "none" : "auto" }}
    >
      <div
        className="relative"
        style={{
          right: `${rightPosition}px`,
          marginTop: isFirst && !completed ? 60 : 24,
        }}
      >
        {current ? (
          <div className="h-[102px] w-[102px] relative">
            <div className="absolute -top-6 left-2.5 px-3 py-2.5 border-2 font-bold uppercase text-examprep-kaabe-maroon bg-white rounded-xl animate-bounce tracking-wide z-10">
              START
              <div className="absolute left-1/2 -bottom-2 w-0 h-0 border-x-8 border-x-transparent border-t-8 transform -translate-x-1/2" />
            </div>
            <CircularProgressbarWithChildren
              value={0}
              styles={{
                path: { stroke: "#8d2c2c" },
                trail: { stroke: "#e5e7eb" },
              }}
            >
              <Button
                size="icon"
                className={cn(
                  "h-[70px] w-[70px] rounded-full bg-examprep-kaabe-maroon text-white border-4 border-white shadow-lg",
                  locked && "cursor-not-allowed opacity-50"
                )}
                disabled={locked}
              >
                <Icon
                  className={cn(
                    "h-8 w-8",
                    locked
                      ? "fill-neutral-400 text-neutral-400 stroke-neutral-400"
                      : "fill-white text-white",
                    completed && "fill-none stroke-[4]"
                  )}
                />
              </Button>
            </CircularProgressbarWithChildren>
          </div>
        ) : (
          <Button
            size="icon"
            className={cn(
              "h-[70px] w-[70px] rounded-full shadow-md transition-all duration-300",
              locked &&
                "cursor-not-allowed bg-gray-200 text-gray-400 border-4 border-gray-100",
              completed &&
                "bg-white border-4 border-examprep-kaabe-maroon text-examprep-kaabe-maroon",
              !locked &&
                !completed &&
                "bg-examprep-kaabe-maroon text-white border-4 border-white",
              "hover:scale-105"
            )}
            disabled={locked}
          >
            {locked ? (
              <Lock className="h-8 w-8 text-gray-400" />
            ) : (
              <Icon
                className={cn(
                  "h-8 w-8",
                  completed
                    ? "fill-none stroke-[4] text-examprep-kaabe-maroon"
                    : "fill-white text-white"
                )}
              />
            )}
          </Button>
        )}
      </div>
    </Link>
  );
};
