"use client"

import type React from "react"

import { useState } from "react"
import { CheckCircle, XCircle } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface FillBlankQuestionProps {
  question: {
    id: number
    type: string
    subject: string
    question: string
    correctAnswer: string
    explanation: string
  }
  userAnswer: string | null
  onAnswer: (answer: string) => void
  showFeedback: boolean
}

export function FillBlankQuestion({ question, userAnswer, onAnswer, showFeedback }: FillBlankQuestionProps) {
  const [inputValue, setInputValue] = useState(userAnswer || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onAnswer(inputValue.trim())
    }
  }

  const isCorrect = userAnswer === question.correctAnswer

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your answer here"
          className={
            showFeedback
              ? isCorrect
                ? "border-green-500 focus-visible:ring-green-500"
                : "border-red-500 focus-visible:ring-red-500"
              : ""
          }
          disabled={showFeedback}
        />
        {!showFeedback && (
          <Button type="submit" disabled={!inputValue.trim()}>
            Submit
          </Button>
        )}
      </form>

      {showFeedback && (
        <div className={`flex items-start gap-2 p-3 rounded-md ${isCorrect ? "bg-green-50" : "bg-red-50"}`}>
          {isCorrect ? (
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
          )}
          <div>
            <p className={`font-medium ${isCorrect ? "text-green-600" : "text-red-600"}`}>
              {isCorrect ? "Correct!" : "Incorrect!"}
            </p>
            <p className="text-sm mt-1">
              {!isCorrect && (
                <span>
                  The correct answer is: <span className="font-medium">{question.correctAnswer}</span>.{" "}
                </span>
              )}
              {question.explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
