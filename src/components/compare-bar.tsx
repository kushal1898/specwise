"use client"

import { Link } from "react-router-dom"
import { X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSpecWise } from "@/lib/specwise-context"
import { cn } from "@/lib/utils"

import laptopsData from "@/data/laptops.json"
import phonesData from "@/data/phones.json"
import headphonesData from "@/data/headphones.json"

interface CompareBarProps {
  type: "laptops" | "phones" | "headphones"
}

export function CompareBar({ type }: CompareBarProps) {
  const {
    compareLaptops,
    comparePhones,
    compareHeadphones,
    removeFromCompareLaptops,
    removeFromComparePhones,
    removeFromCompareHeadphones,
    clearCompareLaptops,
    clearComparePhones,
    clearCompareHeadphones,
  } = useSpecWise()

  const compareIds = type === "laptops" ? compareLaptops : type === "phones" ? comparePhones : compareHeadphones
  const removeFromCompare = type === "laptops" ? removeFromCompareLaptops : type === "phones" ? removeFromComparePhones : removeFromCompareHeadphones
  const clearCompare = type === "laptops" ? clearCompareLaptops : type === "phones" ? clearComparePhones : clearCompareHeadphones

  const data = type === "laptops" ? laptopsData : type === "phones" ? phonesData : headphonesData
  const compareItems = compareIds.map(id => data.find(item => item.id === id)).filter(Boolean)

  if (compareItems.length === 0) return null

  const compareUrl = `/${type}/compare?ids=${compareIds.join(",")}`

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80",
        "translate-y-0 transition-transform duration-300"
      )}
    >
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-3 overflow-x-auto">
          <span className="shrink-0 text-sm font-medium text-muted-foreground">
            Compare ({compareItems.length}/3):
          </span>
          {compareItems.map((item) => (
            <div
              key={item!.id}
              className="flex shrink-0 items-center gap-2 rounded-full bg-secondary px-3 py-1.5"
            >
              <span className="text-sm font-medium">{item!.name}</span>
              <button
                onClick={() => removeFromCompare(item!.id)}
                className="rounded-full p-0.5 hover:bg-muted"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="ghost" size="sm" onClick={clearCompare}>
            Clear
          </Button>
          {compareItems.length >= 2 && (
            <Link to={compareUrl}>
              <Button size="sm" className="gap-2">
                Compare Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

