"use client"

import { createContext, useContext, useEffect, useState, useMemo, useCallback, type ReactNode } from "react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client"

interface AnalyticsData {
  pageViews: Record<string, number>
  compareCount: Record<string, number>
  saveCount: Record<string, number>
  recentlyViewed: string[]
}

interface AnalyticsContextType {
  trackPageView: (productId: string) => void
  trackCompare: (productId: string) => void
  trackSave: (productId: string) => void
  getPageViews: (productId: string) => number
  getCompareCount: (productId: string) => number
  getSaveCount: (productId: string) => number
  getTopViewed: (limit?: number) => { id: string; count: number }[]
  getTopCompared: (limit?: number) => { id: string; count: number }[]
  getTopSaved: (limit?: number) => { id: string; count: number }[]
  getRecentlyViewed: () => string[]
  analytics: AnalyticsData
}

const defaultAnalytics: AnalyticsData = {
  pageViews: {},
  compareCount: {},
  saveCount: {},
  recentlyViewed: [],
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined)

// ─── Supabase helpers ───

async function fetchAllAnalytics(): Promise<AnalyticsData> {
  if (!isSupabaseConfigured() || !supabase) return defaultAnalytics

  try {
    const { data, error } = await supabase
      .from("product_analytics")
      .select("*")

    if (error) throw error

    const result: AnalyticsData = {
      pageViews: {},
      compareCount: {},
      saveCount: {},
      recentlyViewed: [],
    }

    for (const row of data || []) {
      result.pageViews[row.product_id] = row.view_count || 0
      result.compareCount[row.product_id] = row.compare_count || 0
      result.saveCount[row.product_id] = row.save_count || 0
    }

    return result
  } catch (err) {
    console.error("Failed to fetch analytics from Supabase:", err)
    return defaultAnalytics
  }
}

async function incrementSupabase(productId: string, field: "view_count" | "compare_count" | "save_count") {
  if (!isSupabaseConfigured() || !supabase) return

  try {
    // Use RPC for atomic increment
    const { error } = await supabase.rpc("increment_analytics", {
      p_product_id: productId,
      p_field: field,
    })

    if (error) {
      // Fallback: upsert manually
      console.warn("RPC failed, using upsert fallback:", error.message)
      
      // First try to get existing row
      const { data: existing } = await supabase
        .from("product_analytics")
        .select("*")
        .eq("product_id", productId)
        .single()

      if (existing) {
        await supabase
          .from("product_analytics")
          .update({ [field]: (existing[field] || 0) + 1 })
          .eq("product_id", productId)
      } else {
        await supabase
          .from("product_analytics")
          .insert({ product_id: productId, [field]: 1 })
      }
    }
  } catch (err) {
    console.error("Failed to increment analytics:", err)
  }
}

// ─── Provider ───

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [analytics, setAnalytics] = useState<AnalyticsData>(defaultAnalytics)
  const [isHydrated, setIsHydrated] = useState(false)

  // ─── Initial load: fetch from Supabase or localStorage ───
  useEffect(() => {
    async function init() {
      if (isSupabaseConfigured()) {
        const data = await fetchAllAnalytics()
        // Merge with localStorage recently viewed (local-only feature)
        const storedLocal = localStorage.getItem("specwise_analytics")
        if (storedLocal) {
          const local = JSON.parse(storedLocal)
          data.recentlyViewed = local.recentlyViewed || []
        }
        setAnalytics(data)
      } else {
        const stored = localStorage.getItem("specwise_analytics")
        if (stored) {
          setAnalytics(JSON.parse(stored))
        }
      }
      setIsHydrated(true)
    }
    init()
  }, [])

  // ─── Realtime subscription for analytics updates ───
  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) return

    const channel = supabase
      .channel("analytics_realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "product_analytics",
        },
        (payload) => {
          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            const row = payload.new as any
            setAnalytics((prev) => ({
              ...prev,
              pageViews: { ...prev.pageViews, [row.product_id]: row.view_count || 0 },
              compareCount: { ...prev.compareCount, [row.product_id]: row.compare_count || 0 },
              saveCount: { ...prev.saveCount, [row.product_id]: row.save_count || 0 },
            }))
          }
        }
      )
      .subscribe()

    return () => {
      if (supabase) supabase.removeChannel(channel)
    }
  }, [])

  // ─── Save localStorage (for recentlyViewed + offline fallback) ───
  useEffect(() => {
    if (!isHydrated) return
    localStorage.setItem("specwise_analytics", JSON.stringify(analytics))
  }, [analytics, isHydrated])

  // ─── Track functions ───

  const trackPageView = useCallback((productId: string) => {
    // Optimistic local update
    setAnalytics((prev) => ({
      ...prev,
      pageViews: {
        ...prev.pageViews,
        [productId]: (prev.pageViews[productId] || 0) + 1,
      },
      recentlyViewed: [productId, ...prev.recentlyViewed.filter((id) => id !== productId)].slice(0, 20),
    }))
    // Push to Supabase
    incrementSupabase(productId, "view_count")
  }, [])

  const trackCompare = useCallback((productId: string) => {
    setAnalytics((prev) => ({
      ...prev,
      compareCount: {
        ...prev.compareCount,
        [productId]: (prev.compareCount[productId] || 0) + 1,
      },
    }))
    incrementSupabase(productId, "compare_count")
  }, [])

  const trackSave = useCallback((productId: string) => {
    setAnalytics((prev) => ({
      ...prev,
      saveCount: {
        ...prev.saveCount,
        [productId]: (prev.saveCount[productId] || 0) + 1,
      },
    }))
    incrementSupabase(productId, "save_count")
  }, [])

  const getPageViews = (productId: string) => analytics.pageViews[productId] || 0
  const getCompareCount = (productId: string) => analytics.compareCount[productId] || 0
  const getSaveCount = (productId: string) => analytics.saveCount[productId] || 0

  const getTopViewed = (limit = 10) => {
    return Object.entries(analytics.pageViews)
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  }

  const getTopCompared = (limit = 10) => {
    return Object.entries(analytics.compareCount)
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  }

  const getTopSaved = (limit = 10) => {
    return Object.entries(analytics.saveCount)
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  }

  const getRecentlyViewed = () => analytics.recentlyViewed

  const value = useMemo(() => ({
    trackPageView,
    trackCompare,
    trackSave,
    getPageViews,
    getCompareCount,
    getSaveCount,
    getTopViewed,
    getTopCompared,
    getTopSaved,
    getRecentlyViewed,
    analytics,
  }), [
    trackPageView,
    trackCompare,
    trackSave,
    getPageViews,
    getCompareCount,
    getSaveCount,
    getTopViewed,
    getTopCompared,
    getTopSaved,
    getRecentlyViewed,
    analytics,
  ])

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (context === undefined) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider")
  }
  return context
}
