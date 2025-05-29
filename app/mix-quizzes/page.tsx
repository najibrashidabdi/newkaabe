"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { ProUpgradeModal } from "@/components/pro-upgrade-modal"
import { ImageQuestion } from "@/components/image-question"
import { FillBlankQuestion } from "@/components/fill-blank-question"

// Mock questions of different types
const mixedQuestions = [
  {
    id: 1,
    type: "multiple-choice",
    subject: "Geography",
    question: "What is the capital city of Somalia?",
    options: ["Mogadishu", "Hargeisa", "Kismayo", "Bosaso"],
    correctAnswer: "Mogadishu",
    explanation: "Mogadishu is the capital and most populous city of Somalia.",
  },
  {
    id: 2,
    type: "multiple-choice",
    subject: "History",
    question: "In which year did Somalia gain independence?",
    options: ["1950", "1960", "1970", "1980"],
    correctAnswer: "1960",
    explanation: "Somalia gained independence in 1960 when British Somaliland and Italian Somaliland merged.",
  },
  {
    id: 3,
    type: "fill-blank",
    subject: "English",
    question: "Complete the sentence: The quick brown fox _____ over the lazy dog.",
    correctAnswer: "jumps",
    explanation:
      "The complete sentence is 'The quick brown fox jumps over the lazy dog', which is a pangram containing all letters of the alphabet.",
  },
  {
    id: 4,
    type: "image",
    subject: "Biology",
    question: "Identify the labeled part of the cell marked 'X':",
    imageUrl: "/placeholder.svg?height=300&width=400&text=Cell+Diagram+with+X+Label",
    options: ["Nucleus", "Mitochondria", "Golgi Apparatus", "Endoplasmic Reticulum"],
    correctAnswer: "Nucleus",
    explanation: "The nucleus is the control center of the cell that contains genetic material.",
  },
  {
    id: 5,
    type: "multiple-choice",
    subject: "Math",
    question: "Solve for x: 2x + 5 = 15",
    options: ["x = 5", "x = 10", "x = 7.5", "x = 5.5"],
    correctAnswer: "x = 5",
    explanation: "2x + 5 = 15 → 2x = 10 → x = 5",
  },
  {
    id: 6,
    type: "fill-blank",
    subject: "Chemistry",
    question: "The chemical symbol for gold is _____.",
    correctAnswer: "Au",
    explanation: "Au is the chemical symbol for gold, derived from the Latin word 'aurum'.",
  },
  {
    id: 7,
    type: "image",
    subject: "Physics",
    question: "Which of the following circuit diagrams represents a parallel circuit?",
    imageUrl: "/placeholder.svg?height=300&width=400&text=Circuit+Diagrams",
    options: ["Circuit A", "Circuit B", "Circuit C", "Circuit D"],
    correctAnswer: "Circuit B",
    explanation:
      "In a parallel circuit, components are connected across the same voltage source, providing multiple paths for current flow.",
  },
  {
    id: 8,
    type: "multiple-choice",
    subject: "Islamic Studies",
    question: "How many pillars are there in Islam?",
    options: ["3", "4", "5", "6"],
    correctAnswer: "5",
    explanation: "The five pillars of Islam are Shahada, Salat, Zakat, Sawm, and Hajj.",
  },
  {
    id: 9,
    type: "fill-blank",
    subject: "Somali",
    question: "Xamar waa _____ Soomaaliya.",
    correctAnswer: "caasimadda",
    explanation: "'Xamar waa caasimadda Soomaaliya' means 'Mogadishu is the capital of Somalia' in Somali.",
  },
  {
    id: 10,
    type: "multiple-choice",
    subject: "Arabic",
    question: "Which of the following means 'peace' in Arabic?",
    options: ["حب", "سلام", "خير", "شكرا"],
    correctAnswer: "سلام",
    explanation: "سلام (salaam) means 'peace' in Arabic.",
  },
]

export default function MixQuizzesPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<(string | null)[]>(Array(mixedQuestions.length).fill(null))
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showProModal, setShowProModal] = useState(false)
  const [isPro, setIsPro] = useState(false)

  const currentQuestion = mixedQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / mixedQuestions.length) * 100

  // Timer
  useEffect(() => {
    if (quizCompleted) return

    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [quizCompleted])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = answer
    setAnswers(newAnswers)
    setShowFeedback(true)
  }

  const handleNext = () => {
    setShowFeedback(false)

    if (currentQuestionIndex < mixedQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      setQuizCompleted(true)

      // Show Pro upgrade modal after completing all 10 questions
      if (!isPro) {
        setTimeout(() => {
          setShowProModal(true)
        }, 1000)
      }
    }
  }

  const handlePrevious = () => {
    setShowFeedback(false)

    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const calculateScore = () => {
    return answers.reduce((score, answer, index) => {
      if (!answer) return score
      return answer === mixedQuestions[index].correctAnswer ? score + 1 : score
    }, 0)
  }

  const handleRetryQuiz = () => {
    setAnswers(Array(mixedQuestions.length).fill(null))
    setCurrentQuestionIndex(0)
    setTimeElapsed(0)
    setQuizCompleted(false)
    setShowFeedback(false)
  }

  const handleCompleteQuiz = () => {
    toast({
      title: "Quiz completed!",
      description: `You scored ${calculateScore()} out of ${mixedQuestions.length}.`,
    })
    router.push("/dashboard")
  }

  const isAnswerCorrect = () => {
    const currentAnswer = answers[currentQuestionIndex]
    if (!currentAnswer) return null
    return currentAnswer === currentQuestion.correctAnswer
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Exit Quiz
            </Link>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <span>Mixed Quiz</span>
            <span className="text-xs px-2 py-1 bg-muted rounded-full">{currentQuestion.subject}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Clock className="h-4 w-4" />
            <span>{formatTime(timeElapsed)}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {!quizCompleted ? (
            <>
              {/* Quiz Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    Question {currentQuestionIndex + 1} of {mixedQuestions.length}
                  </span>
                  <span>{progress.toFixed(0)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Question Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  {currentQuestion.type === "multiple-choice" && (
                    <RadioGroup
                      value={answers[currentQuestionIndex] || ""}
                      onValueChange={handleAnswer}
                      className="space-y-3"
                    >
                      {currentQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={option}
                            id={`option-${index}`}
                            className={
                              showFeedback
                                ? option === currentQuestion.correctAnswer
                                  ? "text-green-500 border-green-500"
                                  : option === answers[currentQuestionIndex] && option !== currentQuestion.correctAnswer
                                    ? "text-red-500 border-red-500"
                                    : ""
                                : ""
                            }
                          />
                          <Label
                            htmlFor={`option-${index}`}
                            className={`flex-1 cursor-pointer ${
                              showFeedback
                                ? option === currentQuestion.correctAnswer
                                  ? "text-green-500 font-medium"
                                  : option === answers[currentQuestionIndex] && option !== currentQuestion.correctAnswer
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
                  )}

                  {currentQuestion.type === "fill-blank" && (
                    <FillBlankQuestion
                      question={currentQuestion}
                      userAnswer={answers[currentQuestionIndex]}
                      onAnswer={handleAnswer}
                      showFeedback={showFeedback}
                    />
                  )}

                  {currentQuestion.type === "image" && (
                    <ImageQuestion
                      question={currentQuestion}
                      userAnswer={answers[currentQuestionIndex]}
                      onAnswer={handleAnswer}
                      showFeedback={showFeedback}
                    />
                  )}

                  {showFeedback && (
                    <div
                      className={`mt-4 p-3 rounded-md ${
                        isAnswerCorrect() ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                      }`}
                    >
                      <p className={`font-medium ${isAnswerCorrect() ? "text-green-600" : "text-red-600"}`}>
                        {isAnswerCorrect() ? "Correct!" : "Incorrect!"}
                      </p>
                      <p className="text-sm mt-1">{currentQuestion.explanation}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                    Previous
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={
                      !answers[currentQuestionIndex] || (!showFeedback && currentQuestion.type !== "fill-blank")
                    }
                  >
                    {currentQuestionIndex === mixedQuestions.length - 1 ? "Finish" : "Next"}
                  </Button>
                </CardFooter>
              </Card>
            </>
          ) : (
            <>
              {/* Quiz Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Quiz Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Score</p>
                      <p className="text-2xl font-bold">
                        {calculateScore()}/{mixedQuestions.length}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Time Taken</p>
                      <p className="text-2xl font-bold">{formatTime(timeElapsed)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Accuracy</p>
                      <p className="text-2xl font-bold">
                        {Math.round((calculateScore() / mixedQuestions.length) * 100)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handleRetryQuiz}>
                    Retry Quiz
                  </Button>
                  <Button onClick={handleCompleteQuiz}>Complete</Button>
                </CardFooter>
              </Card>

              {/* Question Review */}
              <h2 className="text-xl font-bold mt-8 mb-4">Review Questions</h2>
              <div className="space-y-4">
                {mixedQuestions.map((question, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-base flex items-center gap-2">
                            Question {index + 1}
                            <span className="text-xs px-2 py-0.5 bg-muted rounded-full">{question.subject}</span>
                          </CardTitle>
                          <p>{question.question}</p>
                        </div>
                        {answers[index] === question.correctAnswer ? (
                          <span className="text-xs font-medium text-green-500 bg-green-50 px-2 py-1 rounded-full">
                            Correct
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded-full">
                            Incorrect
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {question.type === "image" && (
                        <div className="mb-3">
                          <img
                            src={question.imageUrl || "/placeholder.svg"}
                            alt={question.question}
                            className="rounded-md border mx-auto"
                          />
                        </div>
                      )}

                      {(question.type === "multiple-choice" || question.type === "image") && (
                        <div className="space-y-1">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`px-3 py-2 rounded-md text-sm ${
                                option === question.correctAnswer
                                  ? "bg-green-50 border border-green-200"
                                  : option === answers[index] && option !== question.correctAnswer
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
                      )}

                      {question.type === "fill-blank" && (
                        <div className="space-y-2">
                          <div className="px-3 py-2 rounded-md text-sm bg-muted">
                            Your answer:{" "}
                            <span
                              className={
                                answers[index] === question.correctAnswer
                                  ? "text-green-500 font-medium"
                                  : "text-red-500 font-medium"
                              }
                            >
                              {answers[index] || "No answer"}
                            </span>
                          </div>
                          <div className="px-3 py-2 rounded-md text-sm bg-green-50 border border-green-200">
                            Correct answer: <span className="text-green-500 font-medium">{question.correctAnswer}</span>
                          </div>
                        </div>
                      )}

                      <div className="pt-2 border-t">
                        <p className="text-sm font-medium">Explanation</p>
                        <p className="text-sm text-muted-foreground">{question.explanation}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Pro Upgrade Modal */}
      <ProUpgradeModal open={showProModal} onOpenChange={setShowProModal} onUpgrade={() => setIsPro(true)} />
    </div>
  )
}
