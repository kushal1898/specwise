"use client"

import { useState, useEffect, useCallback } from "react"
import { Send, User, Trash2, Loader2, Wifi, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StarRating, StarRatingDisplay } from "@/components/star-rating"
import { useAuth } from "@/lib/auth-context"
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client"

export interface Review {
  id: string
  product_id: string
  user_name: string
  user_email: string
  rating: number
  comment: string
  created_at: string
}

// ─── localStorage fallback (used when Supabase is not configured) ───

function getLocalReviews(productId: string): Review[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(`specwise_reviews_${productId}`)
  return stored ? JSON.parse(stored) : []
}

function saveLocalReview(productId: string, review: Review) {
  const reviews = getLocalReviews(productId)
  reviews.unshift(review)
  localStorage.setItem(`specwise_reviews_${productId}`, JSON.stringify(reviews))
}

function deleteLocalReview(productId: string, reviewId: string) {
  const reviews = getLocalReviews(productId).filter(r => r.id !== reviewId)
  localStorage.setItem(`specwise_reviews_${productId}`, JSON.stringify(reviews))
}

// ─── Component ───

export function ReviewSection({ productId }: { productId: string }) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [isLive, setIsLive] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

  // ─── Fetch reviews ───
  const fetchReviews = useCallback(async () => {
    if (!isSupabaseConfigured() || !supabase) {
      // Fallback to localStorage
      setReviews(getLocalReviews(productId))
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false })

      if (error) throw error
      setReviews(data || [])
    } catch (err) {
      console.error("Failed to fetch reviews, falling back to localStorage:", err)
      setReviews(getLocalReviews(productId))
    } finally {
      setLoading(false)
    }
  }, [productId])

  // ─── Realtime subscription ───
  useEffect(() => {
    fetchReviews()

    if (!isSupabaseConfigured() || !supabase) return

    // Subscribe to realtime changes on the reviews table for this product
    const channel = supabase
      .channel(`reviews:${productId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "reviews",
          filter: `product_id=eq.${productId}`,
        },
        (payload) => {
          const newReview = payload.new as Review
          setReviews((prev) => {
            // Avoid duplicates (from optimistic updates)
            if (prev.some((r) => r.id === newReview.id)) return prev
            return [newReview, ...prev]
          })
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "reviews",
          filter: `product_id=eq.${productId}`,
        },
        (payload) => {
          const deletedId = payload.old?.id
          if (deletedId) {
            setReviews((prev) => prev.filter((r) => r.id !== deletedId))
          }
        }
      )
      .subscribe((status) => {
        setIsLive(status === "SUBSCRIBED")
      })

    return () => {
      if (supabase) supabase.removeChannel(channel)
    }
  }, [productId, fetchReviews])

  // ─── Submit review ───
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || rating === 0 || !comment.trim()) return

    setSubmitting(true)

    const review: Omit<Review, "id" | "created_at"> & { id?: string; created_at?: string } = {
      product_id: productId,
      user_name: user.name,
      user_email: user.email,
      rating,
      comment: comment.trim(),
    }

    if (!isSupabaseConfigured() || !supabase) {
      // localStorage fallback
      const localReview: Review = {
        ...review,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
      }
      saveLocalReview(productId, localReview)
      setReviews((prev) => [localReview, ...prev])
    } else {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .insert(review)
          .select()
          .single()

        if (error) throw error

        // Optimistic — add immediately (realtime will deduplicate)
        if (data) {
          setReviews((prev) => {
            if (prev.some((r) => r.id === data.id)) return prev
            return [data, ...prev]
          })
        }
      } catch (err) {
        console.error("Failed to submit review:", err)
        // Fallback: save locally
        const localReview: Review = {
          ...review,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
        }
        saveLocalReview(productId, localReview)
        setReviews((prev) => [localReview, ...prev])
      }
    }

    setRating(0)
    setComment("")
    setSubmitting(false)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  // ─── Delete review ───
  const handleDelete = async (reviewId: string) => {
    setDeletingId(reviewId)

    if (!isSupabaseConfigured() || !supabase) {
      deleteLocalReview(productId, reviewId)
      setReviews((prev) => prev.filter((r) => r.id !== reviewId))
      setDeletingId(null)
      return
    }

    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId)

      if (error) throw error

      // Optimistic removal (realtime will confirm)
      setReviews((prev) => prev.filter((r) => r.id !== reviewId))
    } catch (err) {
      console.error("Failed to delete review:", err)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-2xl font-bold">User Reviews</h2>
          {isSupabaseConfigured() && (
            <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              isLive
                ? "bg-green-500/10 text-green-400"
                : "bg-yellow-500/10 text-yellow-400"
            }`}>
              {isLive ? (
                <>
                  <Wifi className="h-3 w-3" />
                  Live
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3" />
                  Connecting
                </>
              )}
            </span>
          )}
        </div>
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
                disabled={rating === 0 || !comment.trim() || submitting}
                className="gap-2"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {submitting ? "Submitting..." : "Submit Review"}
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
      {loading ? (
        <div className="mt-6 flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Loading reviews...</span>
        </div>
      ) : reviews.length > 0 ? (
        <div className="mt-6 space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                    <span className="text-sm font-bold text-primary">
                      {review.user_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{review.user_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StarRating rating={review.rating} size="sm" />
                  {/* Delete button — only visible for the review author */}
                  {user && user.email === review.user_email && (
                    <button
                      onClick={() => handleDelete(review.id)}
                      disabled={deletingId === review.id}
                      className="ml-2 rounded-full p-1.5 text-muted-foreground/40 transition-all hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                      title="Delete your review"
                    >
                      {deletingId === review.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
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
