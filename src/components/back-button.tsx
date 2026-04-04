"use client"

import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { ReactNode, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function BackButton({ fallback, children, className }: { fallback: string; children: ReactNode; className?: string }) {
  const navigate = useNavigate()
  const [canGoBack, setCanGoBack] = useState(false)

  useEffect(() => {
    // Determine if there is actually a history stack to go back on within our app
    setCanGoBack(window.history.length > 2)
  }, [])

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault()
    if (canGoBack) {
      navigate(-1)
    } else {
      navigate(fallback)
    }
  }

  return (
    <button
      onClick={handleBack}
      className={cn("flex w-max items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground", className)}
    >
      <ArrowLeft className="h-4 w-4" />
      {children}
    </button>
  )
}

