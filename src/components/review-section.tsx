"use client"

import { useState } from "react"
import { Send, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StarRating, StarRatingDisplay } from "@/components/star-rating"
import { useAuth } from "@/lib/auth-context"

export interface Review {
  id: string
  productId: string
  userName: string
  userEmail: string
  rating: number
  comment: string
  date: string
}

function getReviews(productId: string): Review[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(`specwise_reviews_${productId}`)
  return stored ? JSON.parse(stored) : []
}

function saveReview(productId: string, review: Review) {
  const reviews = getReviews(productId)
  reviews.unshift(review)
  localStorage.setItem(`specwise_reviews_${productId}`, JSON.stringify(reviews))
}

export function ReviewSection({ productId }: { productId: string }) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>(() => getReviews(productId))
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || rating === 0 || !comment.trim()) return

    const review: Review = {
      id: Date.now().toString(),
      productId,
      userName: user.name,
      userEmail: user.email,
      rating,
      comment: comment.trim(),
      date: new Date().toISOString(),
    }

    saveReview(productId, review)
    setReviews([review, ...reviews])
    setRating(0)
    setComment("")
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">User Reviews</h2>
        {reviews.length > 0 && (
          <StarRatingDisplay rating={avgRating} count={reviews.length} />
        )}
      </div>

      {/* Review Form */}
      <Card className="mt-6 p-6">
        {user ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Your Rating</p>
              <StarRating rating={rating} size="lg" interactive onChange={setRating} />
            </div>

            <div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="submit"
                disabled={rating === 0 || !comment.trim()}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                Submit Review
              </Button>
              {submitted && (
                <span className="text-sm text-green-500 animate-in fade-in">
                  ✓ Review submitted!
                </span>
              )}
            </div>
          </form>
        ) : (
          <div className="py-4 text-center">
            <p className="text-sm text-muted-foreground">
              Please sign in to leave a review
            </p>
          </div>
        )}
      </Card>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="mt-6 space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                    <span className="text-sm font-bold text-primary">
                      {review.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{review.userName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <StarRating rating={review.rating} size="sm" />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {review.comment}
              </p>
            </Card>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-dashed border-border py-12 text-center">
          <p className="text-sm text-muted-foreground">No reviews yet. Be the first!</p>
        </div>
      )}
    </div>
  )
}

