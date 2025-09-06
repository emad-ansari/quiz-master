import { Suspense } from "react"
import ResultsContainer from "@/components/common/result-container"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

function ResultsPageContent() {
  return <ResultsContainer />
}

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <Card>
              <CardContent className="flex items-center gap-2 p-6">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="text-foreground">Loading results...</span>
              </CardContent>
            </Card>
          </div>
        }
      >
        <ResultsPageContent />
      </Suspense>
    </div>
  )
}
