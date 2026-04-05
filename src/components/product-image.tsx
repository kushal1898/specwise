"use client"

import { useState, useEffect } from "react"
import { Smartphone, Laptop, Headphones, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductImageProps {
  src: string
  alt: string
  category: "laptop" | "phone" | "headphone" | "creator" | "gaming" | "ultrabook" | string
  seed: string
  className?: string
  fallbackStrategy?: "icon" | "unsplash"
}

export function ProductImage({
  src,
  alt,
  category,
  seed,
  className,
  fallbackStrategy = "unsplash",
}: ProductImageProps) {
  const [error, setError] = useState(false)
  const isExternal = src.startsWith("http")

  // Using deterministic unsplash collections or queries based on category
  const buildUnsplashUrl = () => {
    // Using high-quality specific Unsplash photo IDs for better fallbacks
    // These are known working IDs as of latest Unsplash
    const FALLBACK_IDS: any = {
      smartphone: "1511707171634-5f897ff02aa9", // iPhone
      laptop: "1517336714731-489689fd1ca8", // MacBook
      headphones: "1546435770-a3e426bf472b", // Silver headphones
      gaming: "1542751371-adc38448a05e", // Gaming setup
    }

    let query = "technology"
    const cat = category.toLowerCase()
    
    if (cat.includes("headphone") || cat.includes("iem") || cat.includes("tws") || cat.includes("over-ear")) query = "headphones"
    else if (cat.includes("phone")) query = "smartphone"
    else if (cat.includes("laptop") || cat.includes("ultrabook")) query = "laptop"
    else if (cat.includes("gaming")) query = "gaming"

    const photoId = FALLBACK_IDS[query] || "1417733126314-891962b9efec" // Default tech
    
    return `https://images.unsplash.com/photo-${photoId}?q=80&w=800&auto=format&fit=crop`
  }

  const [imgSrc, setImgSrc] = useState(src || buildUnsplashUrl())

  // Sync if src changes
  useEffect(() => {
    if (src) {
      setImgSrc(src)
      setError(false)
    } else if (fallbackStrategy === "unsplash") {
      setImgSrc(buildUnsplashUrl())
    }
  }, [src, fallbackStrategy])

  if (error && fallbackStrategy === "icon") {
    return (
      <div className={cn("flex items-center justify-center bg-muted/50 text-muted-foreground", className)}>
        {category.toLowerCase().includes("phone") ? (
          <Smartphone className="h-1/3 w-1/3 opacity-50" />
        ) : category.toLowerCase().includes("headphone") || category.toLowerCase().includes("iem") || category.toLowerCase().includes("tws") ? (
          <Headphones className="h-1/3 w-1/3 opacity-50" />
        ) : category.toLowerCase().includes("laptop") ? (
          <Laptop className="h-1/3 w-1/3 opacity-50" />
        ) : (
          <ImageIcon className="h-1/3 w-1/3 opacity-50" />
        )}
      </div>
    )
  }

  return (
    <div className={cn("relative overflow-hidden bg-muted/20", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={alt}
          className="h-full w-full object-cover transition-opacity duration-300"
          onError={() => {
            if (!error) {
              setError(true)
              if (fallbackStrategy === "unsplash" && imgSrc !== buildUnsplashUrl()) {
                setImgSrc(buildUnsplashUrl())
                setError(false) // Give it one more try with unsplash
              } else {
                 // Force icon fallback if unsplash also fails
                 setImgSrc("")
              }
            }
          }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted/50">
          <ImageIcon className="h-1/3 w-1/3 opacity-20" />
        </div>
      )}
    </div>
  )
}

