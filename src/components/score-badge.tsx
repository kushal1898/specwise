import { cn } from "@/lib/utils"

interface ScoreBadgeProps {
  score: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

export function ScoreBadge({ score, size = "md", showLabel = false }: ScoreBadgeProps) {
  const getScoreClass = () => {
    if (score >= 80) return "score-excellent"
    if (score >= 60) return "score-good"
    return "score-average"
  }

  const getScoreLabel = () => {
    if (score >= 90) return "Excellent"
    if (score >= 80) return "Great"
    if (score >= 70) return "Good"
    if (score >= 60) return "Fair"
    return "Average"
  }

  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-12 w-12 text-lg",
  }

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex items-center justify-center rounded-full font-bold",
          getScoreClass(),
          sizeClasses[size]
        )}
      >
        {score}
      </div>
      {showLabel && (
        <span className="text-sm text-muted-foreground">{getScoreLabel()}</span>
      )}
    </div>
  )
}

export function ScoreBadgePill({ score }: { score: number }) {
  const getScoreClass = () => {
    if (score >= 80) return "score-excellent"
    if (score >= 60) return "score-good"
    return "score-average"
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold",
        getScoreClass()
      )}
    >
      {score}/100
    </span>
  )
}

