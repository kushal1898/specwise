"use client"

import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useAnalytics } from "@/lib/analytics-context"

export function PageViewTracker() {
  const { pathname } = useLocation()
  const { trackPageView } = useAnalytics()

  useEffect(() => {
    // Only track actual product pages (e.g., /laptops/some-id)
    const match = pathname.match(/^\/(laptops|phones|headphones)\/([^/]+)$/)
    if (match && match[2] !== "compare") {
      trackPageView(match[2])
    }
  }, [pathname, trackPageView])

  return null
}

