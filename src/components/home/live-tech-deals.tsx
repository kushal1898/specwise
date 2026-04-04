"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ExternalLink, Wifi, Sparkles, TrendingUp, Cpu } from "lucide-react"
import { Card } from "@/components/ui/card"

export function LiveTechDeals() {
  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchDeals() {
      try {
        const res = await fetch("https://dummyjson.com/products/category/smartphones?limit=4")
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setDeals(data.products)
      } catch (err) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchDeals()
  }, [])

  if (error || (!loading && deals.length === 0)) return null

  return (
    <section className="relative z-10 border-t border-white/5 bg-background/5 py-24 backdrop-blur-sm overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          <div className="flex items-center gap-4">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 backdrop-blur-md border border-blue-500/20">
              <Wifi className="h-6 w-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
            </div>
            <div>
              <h2 className="font-display text-4xl font-bold tracking-tight text-foreground">Live <span className="text-blue-500 font-black">Market</span> Deals</h2>
              <p className="text-muted-foreground mt-1">Real-time marketplace insights from the global grid</p>
            </div>
          </div>
          {/* Status HUD removed as requested */}
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse h-[400px] border-white/5 bg-white/[0.02] backdrop-blur-xl" />
            ))
          ) : (
            deals.map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group relative h-full overflow-hidden border-white/10 bg-white/[0.03] p-0 transition-all hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-blue-500/10 active:scale-[0.98] backdrop-blur-xl">
                  <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-1">
                    <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-blue-500 border border-blue-500/20 backdrop-blur-md">
                      -{Math.round(deal.discountPercentage)}% Off
                    </span>
                  </div>

                  <div className="relative aspect-square overflow-hidden border-b border-white/5 bg-white/[0.02]">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                    <img 
                      src={deal.thumbnail} 
                      alt={deal.title} 
                      className="absolute inset-0 h-full w-full object-contain p-8 transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between">
                       <span className="text-xs font-black uppercase tracking-[0.2em] text-white/60">
                        {deal.brand}
                      </span>
                      <div className="h-1 w-12 bg-white/20 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: "100%" }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                          className="h-full bg-blue-500" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold line-clamp-1 group-hover:text-blue-400 transition-colors">{deal.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground/80 line-clamp-2">{deal.description}</p>
                    
                    <div className="mt-8 flex items-end justify-between border-t border-white/5 pt-6">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <p className="font-display text-3xl font-black tracking-tighter text-white">
                            ${deal.price}
                          </p>
                          {deal.discountPercentage && (
                            <span className="text-sm font-bold text-muted-foreground/40 line-through">
                              ${(deal.price / (1 - deal.discountPercentage / 100)).toFixed(0)}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Market Price (USD)</p>
                      </div>
                      
                      <a 
                        href={`https://dummyjson.com/products/${deal.id}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="group/btn relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-white/40 border border-white/10 backdrop-blur-md transition-all hover:bg-blue-500 hover:text-white hover:border-blue-500"
                      >
                        <ExternalLink className="h-5 w-5" />
                        <motion.div 
                          className="absolute -inset-1 rounded-2xl border border-blue-500/50 opacity-0 group-hover/btn:opacity-100"
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </a>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

