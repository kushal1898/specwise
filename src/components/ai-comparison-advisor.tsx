"use client"

import { useState } from "react"
import { Sparkles, Bot, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function AiComparisonAdvisor({ items, category }: { items: any[]; category: string }) {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<string | null>(null)

  const handleAskAI = () => {
    setLoading(true)
    // Simulated API call to Claude
    setTimeout(() => {
      if (items.length !== 2) {
        setResponse("I work best when comparing exactly two items side by side.")
        setLoading(false)
        return
      }

      const [item1, item2] = items
      const name1 = item1.name
      const name2 = item2.name

      let comparison = ""
      if (category === "laptops") {
        comparison = `Based on the specs, the **${item1.overallScore > item2.overallScore ? name1 : name2}** generally has the edge in raw performance and overall value. 
        
However, if you prioritize ${item1.battery_wh > item2.battery_wh ? 'battery life' : 'display quality'}, the **${item1.battery_wh > item2.battery_wh ? name1 : name2}** is a strong contender. 

**Verdict:** Go with the **${item1.overallScore > item2.overallScore ? name1 : name2}** for the best all-around experience, but pick the **${item1.overallScore > item2.overallScore ? name2 : name1}** if budget is your main constraint.`
      } else {
        comparison = `Comparing the **${name1}** and **${name2}**, both are excellent choices in the ${category} category.
        
The **${item1.score > item2.score ? name1 : name2}** stands out with its superior score and value proposition. It offers better overall specs for the price.

**Recommendation:** If you want the absolute best option between these two, the **${item1.score > item2.score ? name1 : name2}** is the clear winner.`
      }

      setResponse(comparison)
      setLoading(false)
    }, 2000)
  }

  return (
    <Card className="mt-8 overflow-hidden border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20">
              <Bot className="h-5 w-5 text-indigo-500" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold">Ask SpecWise AI</h3>
              <p className="text-sm text-muted-foreground">Powered by Claude</p>
            </div>
          </div>
          {!response && !loading && (
            <Button onClick={handleAskAI} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
              <Sparkles className="h-4 w-4" />
              Analyze Comparison
            </Button>
          )}
        </div>

        {loading && (
          <div className="mt-6 flex flex-col items-center justify-center py-6">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-indigo-500"></span>
              </span>
              <p className="text-sm font-medium text-indigo-500">Analyzing specifications and value...</p>
            </div>
          </div>
        )}

        {response && (
          <div className="mt-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="rounded-xl bg-background/50 p-6 backdrop-blur-sm">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {response.split('\n').map((line, i) => (
                  <p key={i} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <p className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                AI recommendations are generated based on spec data. Always consider your specific needs.
              </p>
              <button onClick={handleAskAI} className="hover:text-indigo-500 transition-colors">
                Regenerate
              </button>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

