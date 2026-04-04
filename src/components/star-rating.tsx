"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  interactive?: boolean
  onChange?: (rating: number) => void
}

export function StarRating({ rating, maxRating = 5, size = "md", interactive = false, onChange }: StarRatingProps) {
  const sizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxRating }, (_, i) => {
        const filled = i < Math.floor(rating)
        const halfFilled = !filled && i < rating
        
        return (
          <button
            key={i}
            type={interactive ? "button" : undefined}
            disabled={!interactive}
            onClick={() => interactive && onChange?.(i + 1)}
            className={cn(
              "transition-all",
              interactive && "cursor-pointer hover:scale-125 disabled:cursor-default",
              !interactive && "cursor-default"
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                "transition-colors",
                filled
                  ? "fill-amber-400 text-amber-400"
                  : halfFilled
                    ? "fill-amber-400/50 text-amber-400"
                    : "fill-transparent text-muted-foreground/40",
                interactive && "hover:text-amber-400"
              )}
            />
          </button>
        )
      })}
    </div>
  )
}

export function StarRatingDisplay({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <StarRating rating={rating} size="sm" />
      <span className="text-sm font-medium">{rating.toFixed(1)}</span>
      <span className="text-xs text-muted-foreground">({count} review{count !== 1 ? "s" : ""})</span>
    </div>
  )
}

