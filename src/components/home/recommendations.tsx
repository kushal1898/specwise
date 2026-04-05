"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight, Fingerprint, Target, Zap } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScoreBadgePill } from "@/components/score-badge"
import { useAnalytics } from "@/lib/analytics-context"
import { useSpecWise } from "@/lib/specwise-context"

import laptopsData from "@/data/laptops.json"
import phonesData from "@/data/phones.json"
import headphonesData from "@/data/headphones.json"

export function Recommendations() {
  const { getRecentlyViewed } = useAnalytics()
  const { savedLaptops, savedPhones, savedHeadphones, formatPrice } = useSpecWise()
  const [recommendations, setRecommendations] = useState<any[]>([])

  useEffect(() => {
    // Generate context-aware recommendations
    const recent = getRecentlyViewed()
    const allSaved = [...savedLaptops, ...savedPhones, ...savedHeadphones]
    
    // @ts-ignore
    const allProducts = [
      ...laptopsData.map(l => ({ ...l, type: "laptop", href: `/laptops/${l.id}` })),
      ...phonesData.map(p => ({ ...p, type: "phone", href: `/phones/${p.id}` })),
      ...headphonesData.map(h => ({ ...h, type: "headphone", href: `/headphones/${h.id}` })),
    ]

    // Gather categories/types from what they've interacted with
    const interactedIds = new Set([...recent, ...allSaved])
    
    if (interactedIds.size === 0) {
      // Default fallback: top rated from each category
      setRecommendations([
        allProducts.filter(p => p.type === "laptop").sort((a, b) => (b as any).overallScore - (a as any).overallScore)[0],
        allProducts.filter(p => p.type === "phone").sort((a, b) => (b as any).score - (a as any).score)[0],
        allProducts.filter(p => p.type === "headphone").sort((a, b) => (b as any).score - (a as any).score)[0],
      ].filter(Boolean))
      return
    }

    const interactedProducts = allProducts.filter(p => interactedIds.has(p.id))
    
    // Find recommendations: not in interacted, high score, similar category or price range
    const suggested = allProducts
      .filter(p => !interactedIds.has(p.id))
      .filter(p => {
        // If it overlaps category or type with highly interacted stuff
        const sameType = interactedProducts.some(ip => ip.type === p.type)
        return sameType && ('score' in p ? p.score >= 80 : (p as any).overallScore >= 8.0)
      })
      .sort(() => Math.random() - 0.5) // Randomize top tier slightly
      .slice(0, 3)

    // If we didn't get enough, fallback
    if (suggested.length < 3) {
      const extra = allProducts
        .filter(p => !interactedIds.has(p.id))
        .filter(p => !suggested.some(s => s.id === p.id))
        .slice(0, 3 - suggested.length)
      setRecommendations([...suggested, ...extra].filter(Boolean))
    } else {
      setRecommendations(suggested.filter(Boolean))
    }

  }, [getRecentlyViewed, savedLaptops, savedPhones, savedHeadphones])

  if (recommendations.length === 0) return null

  return (
    <section className="relative z-10 border-t border-white/5 bg-white/[0.01] py-32 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-[2rem] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 backdrop-blur-xl">
              <Target className="h-8 w-8" />
            </div>
            <div>
              <h2 className="font-display text-4xl font-bold tracking-tight">Tailored <span className="text-yellow-500">For You</span></h2>
              <p className="mt-1 text-lg text-muted-foreground font-medium">Calibrated to your recent activity and saved profiles.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-full bg-white/5 px-4 py-2 border border-white/10 backdrop-blur-md">
             <Fingerprint className="h-4 w-4 text-primary" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Neural Matching: Active</span>
          </div>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={item.href}>
                <Card className="group relative h-full overflow-hidden border-white/10 bg-white/[0.03] p-0 transition-all hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-yellow-500/5 active:scale-[0.98] backdrop-blur-xl">
                  {/* Decorative Neural Pattern */}
                  <div className="absolute top-0 right-0 h-32 w-32 bg-yellow-500/5 rounded-full blur-3xl opacity-0 transition-opacity group-hover:opacity-100" />
                  
                  <div className="p-8">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-500/60">
                          {item.brand}
                        </p>
                        <h3 className="mt-3 font-display text-2xl font-bold leading-tight group-hover:text-yellow-400 transition-colors">
                          {item.name}
                        </h3>
                      </div>
                      <div className="shrink-0">
                        <ScoreBadgePill score={'score' in item ? item.score : Math.round(item.overallScore * 10)} />
                      </div>
                    </div>
                    
                    <div className="mt-10 flex items-end justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">Target Value</p>
                        <p className="mt-1 font-display text-3xl font-black">
                          {formatPrice(item.price_inr || (item.price * 83), item.price_usd || item.price)}
                        </p>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white/40 transition-all group-hover:bg-yellow-500 group-hover:text-black group-hover:border-yellow-500 group-hover:rotate-45">
                        <ArrowRight className="h-6 w-6" />
                      </div>
                    </div>

                    {/* Meta-tag flow */}
                    <div className="mt-8 flex gap-2">
                       <span className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                         <Zap className="h-3 w-3 text-yellow-500" />
                         Premium Build
                       </span>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

