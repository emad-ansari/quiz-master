import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, RotateCcw, Home, CheckCircle, XCircle, Star, Award } from "lucide-react"
import { getHighScores, getBestScore } from "@/lib/high-scores"
import { useNavigate } from "react-router-dom"

interface QuizResults {
  questions: Array<{
    id: number
    question: string
    options: string[]
    correctAnswer: number
    category: string
    difficulty: string
  }>
  answers: (number | null)[]
  score: number
  difficulty: string
  isNewHighScore?: boolean
}

export default function ResultsContainer() {
  const navigate = useNavigate();
  const [results, setResults] = useState<QuizResults | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showHighScores, setShowHighScores] = useState(false)

  useEffect(() => {
    // Load results from localStorage
    const storedResults = localStorage.getItem("quizResults")
    if (storedResults) {
      setResults(JSON.parse(storedResults))
    }
    setIsLoading(false)
  }, [])

  const handleRetakeQuiz = () => {
    if (results) {
      navigate(`/quiz?difficulty=${results.difficulty}`)
    }
  }

  const handleBackHome = () => {
    navigate("/")
  }

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100
    if (percentage >= 80) return "text-secondary"
    if (percentage >= 60) return "text-primary"
    return "text-destructive"
  }

  const getScoreMessage = (score: number, total: number) => {
    const percentage = (score / total) * 100
    if (percentage >= 90) return "Outstanding! You're a quiz master!"
    if (percentage >= 80) return "Excellent work! You really know your stuff!"
    if (percentage >= 70) return "Great job! You did very well!"
    if (percentage >= 60) return "Good effort! Keep practicing!"
    if (percentage >= 50) return "Not bad! There's room for improvement!"
    return "Keep studying and try again!"
  }

  const highScores = getHighScores()
  const bestScore = results ? getBestScore(results.difficulty) : null

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="animate-fade-in">
          <CardContent className="p-6">
            <div className="text-center">Loading results...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="animate-fade-in">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">No quiz results found.</p>
            <Button onClick={handleBackHome} className="transition-all duration-200 hover:scale-105">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const scorePercentage = (results.score / results.questions.length) * 100

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="relative">
          <Trophy className="h-16 w-16 text-primary mx-auto mb-4 animate-bounce" />
          {results.isNewHighScore && (
            <div className="absolute -top-2 -right-2">
              <Star className="h-8 w-8 text-secondary animate-pulse" />
            </div>
          )}
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Quiz Complete!</h1>
        {results.isNewHighScore && (
          <Badge variant="secondary" className="mb-2 animate-pulse">
            <Award className="h-4 w-4 mr-1" />
            New High Score!
          </Badge>
        )}
        <p className="text-muted-foreground">Here are your results</p>
      </div>

      {/* Score Summary */}
      <Card className="mb-8 animate-slide-in">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">
            <span className={getScoreColor(results.score, results.questions.length)}>
              {results.score}/{results.questions.length}
            </span>
          </CardTitle>
          <div className="space-y-2">
            <Progress value={scorePercentage} className="h-3 transition-all duration-1000" />
            <p className="text-lg text-muted-foreground">{scorePercentage.toFixed(0)}% Correct</p>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary" className="text-sm">
                {results.difficulty.toUpperCase()} DIFFICULTY
              </Badge>
              {bestScore && (
                <Badge variant="outline" className="text-sm">
                  Best: {bestScore.percentage}%
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-lg text-foreground font-medium">
            {getScoreMessage(results.score, results.questions.length)}
          </p>
        </CardContent>
      </Card>

      {highScores.length > 0 && (
        <Card className="mb-8 animate-slide-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                High Scores
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHighScores(!showHighScores)}
                className="transition-all duration-200"
              >
                {showHighScores ? "Hide" : "Show"}
              </Button>
            </div>
          </CardHeader>
          {showHighScores && (
            <CardContent>
              <div className="space-y-2">
                {highScores.slice(0, 5).map((score, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 transition-all duration-200 hover:bg-muted"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={index === 0 ? "default" : "outline"}
                        className="w-8 h-8 rounded-full p-0 flex items-center justify-center"
                      >
                        {index + 1}
                      </Badge>
                      <div>
                        <div className="font-medium">{score.percentage}%</div>
                        <div className="text-sm text-muted-foreground">
                          {score.score}/{score.totalQuestions} • {score.difficulty}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">{new Date(score.date).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Question Review */}
      <Card className="mb-8 animate-slide-in">
        <CardHeader>
          <CardTitle>Question Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {results.questions.map((question, index) => {
            const userAnswer = results.answers[index]
            const isCorrect = userAnswer === question.correctAnswer
            const wasAnswered = userAnswer !== null

            return (
              <div
                key={question.id}
                className="border-b border-border pb-6 last:border-b-0 transition-all duration-200 hover:bg-muted/20 rounded-lg p-4 -m-4"
              >
                <div className="flex items-start gap-3 mb-3">
                  {isCorrect ? (
                    <CheckCircle className="h-6 w-6 text-secondary mt-1 flex-shrink-0 animate-pulse" />
                  ) : (
                    <XCircle className="h-6 w-6 text-destructive mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-foreground">Question {index + 1}</span>
                      <Badge variant="outline" className="text-xs">
                        {question.category}
                      </Badge>
                    </div>
                    <p className="text-foreground mb-3">{question.question}</p>

                    <div className="space-y-2 text-sm">
                      {wasAnswered && (
                        <div className={`flex items-center gap-2 ${isCorrect ? "text-secondary" : "text-destructive"}`}>
                          <span className="font-medium">Your answer:</span>
                          <span>{question.options[userAnswer]}</span>
                        </div>
                      )}

                      {!wasAnswered && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span className="font-medium">Your answer:</span>
                          <span>No answer selected</span>
                        </div>
                      )}

                      {!isCorrect && (
                        <div className="flex items-center gap-2 text-secondary">
                          <span className="font-medium">Correct answer:</span>
                          <span>{question.options[question.correctAnswer]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={handleRetakeQuiz}
          className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
          aria-label="Retake the quiz with the same difficulty"
        >
          <RotateCcw className="h-4 w-4" />
          Retake Quiz
        </Button>
        <Button
          variant="outline"
          onClick={handleBackHome}
          className="flex items-center gap-2 transition-all duration-200 hover:scale-105 bg-transparent"
          aria-label="Go back to home page"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Button>
      </div>
    </div>
  )
}
