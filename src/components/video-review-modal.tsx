"use client"

import { useState } from "react"
import { Youtube, X } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"

interface VideoReviewModalProps {
  url: string
  reviewer?: string
  title?: string
}

export function VideoReviewModal({ url, reviewer = "Tech Reviewer", title = "Watch Full Review on YouTube" }: VideoReviewModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Extract video ID from various YouTube URL formats
  const getVideoId = (url: string) => {
    let videoId = "1BOL05dK-zk" // Fallback video (MKBHD iPhone 15 Pro)
    
    // Check if it's a placeholder
    if (url.includes("placeholder") || url.includes("phone1") || !url.includes("youtube.com")) {
      return videoId
    }

    try {
      const urlObj = new URL(url)
      if (urlObj.hostname.includes("youtube.com")) {
        videoId = urlObj.searchParams.get("v") || videoId
      } else if (urlObj.hostname.includes("youtu.be")) {
        videoId = urlObj.pathname.slice(1) || videoId
      }
    } catch (e) {
      // Ignored
    }

    return videoId
  }

  const videoId = getVideoId(url)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="flex w-full items-center gap-4 p-6 transition-colors hover:bg-muted/50 rounded-xl border border-border text-left">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
            <Youtube className="h-8 w-8 text-red-500" />
          </div>
          <div className="flex-1">
            <p className="font-medium">{title}</p>
            <p className="mt-1 text-sm text-muted-foreground">In-depth video review by {reviewer}</p>
          </div>
          <div className="ml-auto text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
            Watch Now
          </div>
        </button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-background border-border/50 shadow-2xl">
        <DialogTitle className="sr-only">Video Review</DialogTitle>
        <div className="relative pt-[56.25%] w-full bg-black">
          {isOpen && (
            <iframe
              className="absolute top-0 left-0 w-full h-full border-0"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

