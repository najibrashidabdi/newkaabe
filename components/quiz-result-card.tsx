import { CheckCircle, HelpCircle, XCircle } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface QuizResultCardProps {
  question: {
    id: number
    question: string
    options: string[]
    correctAnswer: string
    explanation: string
  }
  userAnswer: string | null
  questionNumber: number
}

export function QuizResultCard({ question, userAnswer, questionNumber }: QuizResultCardProps) {
  const isCorrect = userAnswer === question.correctAnswer

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              {isCorrect ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              Question {questionNumber}
            </CardTitle>
            <CardDescription>{question.question}</CardDescription>
          </div>
          {isCorrect ? (
            <span className="text-xs font-medium text-green-500 bg-green-50 px-2 py-1 rounded-full">Correct</span>
          ) : (
            <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded-full">Incorrect</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          {question.options.map((option, index) => (
            <div
              key={index}
              className={`px-3 py-2 rounded-md text-sm ${
                option === question.correctAnswer
                  ? "bg-green-50 border border-green-200"
                  : option === userAnswer
                    ? "bg-red-50 border border-red-200"
                    : "bg-muted"
              }`}
            >
              {option}
              {option === question.correctAnswer && (
                <span className="ml-2 text-xs text-green-500 font-medium">(Correct Answer)</span>
              )}
            </div>
          ))}
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-start gap-2">
            <HelpCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Explanation</p>
              <p className="text-sm text-muted-foreground">{question.explanation}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
