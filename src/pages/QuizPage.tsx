import { Suspense } from "react"
import QuizContainer from "@/components/common/quiz-container"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

function QuizPageContent() {
  return <QuizContainer />
}

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <Card>
              <CardContent className="flex items-center gap-2 p-6">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="text-foreground">Loading quiz...</span>
              </CardContent>
            </Card>
          </div>
        }
      >
        <QuizPageContent />
      </Suspense>
    </div>
  )
}
