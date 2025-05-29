"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface ImageQuestionProps {
  question: {
    id: number
    type: string
    subject: string
    question: string
    imageUrl: string
    options: string[]
    correctAnswer: string
    explanation: string
  }
  userAnswer: string | null
  onAnswer: (answer: string) => void
  showFeedback: boolean
}

export function ImageQuestion({ question, userAnswer, onAnswer, showFeedback }: ImageQuestionProps) {
  return (
    <div className="space-y-4">
      <div className="mb-4">
        <img
          src={question.imageUrl || "/placeholder.svg"}
          alt={question.question}
          className="rounded-md border mx-auto"
        />
      </div>

      <RadioGroup value={userAnswer || ""} onValueChange={onAnswer} className="space-y-3">
        {question.options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <RadioGroupItem
              value={option}
              id={`image-option-${index}`}
              className={
                showFeedback
                  ? option === question.correctAnswer
                    ? "text-green-500 border-green-500"
                    : option === userAnswer && option !== question.correctAnswer
                      ? "text-red-500 border-red-500"
                      : ""
                  : ""
              }
            />
            <Label
              htmlFor={`image-option-${index}`}
              className={`flex-1 cursor-pointer ${
                showFeedback
                  ? option === question.correctAnswer
                    ? "text-green-500 font-medium"
                    : option === userAnswer && option !== question.correctAnswer
                      ? "text-red-500 font-medium"
                      : ""
                  : ""
              }`}
            >
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
