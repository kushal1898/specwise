"use client"

import { createContext, useContext, useEffect, useState, useMemo, useCallback, type ReactNode } from "react"

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

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [analytics, setAnalytics] = useState<AnalyticsData>(defaultAnalytics)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("specwise_analytics")
    if (stored) {
      setAnalytics(JSON.parse(stored))
    }
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return
    localStorage.setItem("specwise_analytics", JSON.stringify(analytics))
  }, [analytics, isHydrated])

  const trackPageView = useCallback((productId: string) => {
    setAnalytics((prev) => ({
      ...prev,
      pageViews: {
        ...prev.pageViews,
        [productId]: (prev.pageViews[productId] || 0) + 1,
      },
      recentlyViewed: [productId, ...prev.recentlyViewed.filter((id) => id !== productId)].slice(0, 20),
    }))
  }, [])

  const trackCompare = useCallback((productId: string) => {
    setAnalytics((prev) => ({
      ...prev,
      compareCount: {
        ...prev.compareCount,
        [productId]: (prev.compareCount[productId] || 0) + 1,
      },
    }))
  }, [])

  const trackSave = useCallback((productId: string) => {
    setAnalytics((prev) => ({
      ...prev,
      saveCount: {
        ...prev.saveCount,
        [productId]: (prev.saveCount[productId] || 0) + 1,
      },
    }))
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

