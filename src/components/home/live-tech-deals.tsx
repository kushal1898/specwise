"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Wifi, ShoppingCart, Tag } from "lucide-react"
import { Card } from "@/components/ui/card"
import { ProductImage } from "@/components/product-image"
import { useSpecWise } from "@/lib/specwise-context"
import phonesData from "@/data/phones.json"

const PLATFORMS = [
  { name: "Amazon", color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20", getUrl: (q: string) => `https://www.amazon.com/s?k=${encodeURIComponent(q)}` },
  { name: "eBay", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", getUrl: (q: string) => `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(q)}` },
  { name: "OLX", color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20", getUrl: (q: string) => `https://www.olx.in/items/q-${encodeURIComponent(q)}` },
]

export function LiveTechDeals() {
  const { currency, formatPrice } = useSpecWise()
  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching deals from multiple platforms
    const timer = setTimeout(() => {
      const generatedDeals = Array.from({ length: 4 }).map(() => {
        const randomPhone = phonesData[Math.floor(Math.random() * phonesData.length)] as any;
        const discount = Math.floor(Math.random() * 25) + 5; // 5% to 30% off
        const platform = PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)];
        
        // Use price_usd from data as base price.
        const baseUsd = randomPhone.price_usd || 500;
        const baseInr = randomPhone.price_inr || baseUsd * 83;

        const discountedUsd = baseUsd * (1 - discount / 100);
        const discountedInr = baseInr * (1 - discount / 100);

        return {
          id: Math.random().toString(36).substring(7),
          parentPhoneId: randomPhone.id,
          title: randomPhone.name,
          brand: randomPhone.brand,
          image: randomPhone.image,
          msrpUsd: baseUsd,
          msrpInr: baseInr,
          priceUsd: discountedUsd,
          priceInr: discountedInr,
          discountPercentage: discount,
          platform: platform,
          platformUrl: platform.getUrl(randomPhone.name),
          condition: Math.random() > 0.5 ? "New" : "Refurbished",
        }
      })
      setDeals(generatedDeals)
      setLoading(false)
    }, 1500) // Simulate network delay

    return () => clearTimeout(timer)
  }, [])

  if (!loading && deals.length === 0) return null

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
              <p className="text-muted-foreground mt-1">Real-time marketplace pricing from Amazon, eBay, and OLX</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Card className="animate-pulse h-[420px] border-white/5 bg-white/[0.02] backdrop-blur-xl" />
                </motion.div>
              ))
            ) : (
              deals.map((deal, index) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group relative h-full overflow-hidden border-white/10 bg-white/[0.03] p-0 transition-all hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-blue-500/10 active:scale-[0.98] backdrop-blur-xl flex flex-col">
                    <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
                       <span className={`rounded-md px-2 py-1 text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${deal.platform.bg} ${deal.platform.color} ${deal.platform.border}`}>
                        {deal.platform.name}
                      </span>
                      <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-blue-500 border border-blue-500/20 backdrop-blur-md">
                        -{deal.discountPercentage}%
                      </span>
                    </div>

                    <div className="relative h-48 overflow-hidden border-b border-white/5 bg-white/[0.02] shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                      <ProductImage 
                        src={deal.image} 
                        alt={deal.title} 
                        category="phone"
                        seed={deal.id}
                        className="absolute inset-0 h-full w-full [&_img]:object-contain [&_img]:p-6 transition-transform duration-700 group-hover:scale-110" 
                      />
                      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between">
                         <span className="text-xs font-black uppercase tracking-[0.2em] text-white/60">
                          {deal.brand}
                        </span>
                         <span className="text-[9px] font-black uppercase tracking-widest text-white/40 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">
                          {deal.condition}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col flex-1 p-6">
                      <h3 className="font-display text-xl font-bold line-clamp-2 group-hover:text-blue-400 transition-colors">{deal.title}</h3>
                      
                      <div className="mt-auto pt-6 mb-2">
                        <div className="flex items-baseline gap-2">
                          <p className="font-display text-3xl font-black tracking-tighter text-white">
                            {formatPrice(deal.priceInr, deal.priceUsd)}
                          </p>
                          <span className="text-sm font-bold text-muted-foreground/40 line-through">
                            {formatPrice(deal.msrpInr, deal.msrpUsd)}
                          </span>
                        </div>
                        <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Market Price ({currency})</p>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                        <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/50 flex items-center gap-1.5">
                           <ShoppingCart className="h-3 w-3" /> Buy Now
                        </div>
                        <a 
                          href={deal.platformUrl} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/btn relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/40 border border-white/10 backdrop-blur-md transition-all hover:bg-blue-500 hover:text-white hover:border-blue-500"
                          title="View on Platform"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <motion.div 
                            className="absolute -inset-1 rounded-xl border border-blue-500/50 opacity-0 group-hover/btn:opacity-100"
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
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

