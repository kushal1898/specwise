"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, Cpu, HardDrive, Monitor, Laptop, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScoreBadgePill } from "@/components/score-badge"
import { ProductImage } from "@/components/product-image"
import { useSpecWise } from "@/lib/specwise-context"
import { cn } from "@/lib/utils"
import laptopsData from "@/data/laptops.json"

const getBudgetFilters = (currency: string) => {
  if (currency === "INR") {
    return [
      { label: "All", value: "all" },
      { label: "Under ₹83,000", value: "under-1000" },
      { label: "Under ₹1,25,000", value: "under-1500" },
      { label: "₹1,66,000+", value: "over-2000" },
    ]
  }
  return [
    { label: "All", value: "all" },
    { label: "Under $1000", value: "under-1000" },
    { label: "Under $1500", value: "under-1500" },
    { label: "$2000+", value: "over-2000" },
  ]
}

export function TopPicks() {
  const [activeFilter, setActiveFilter] = useState("all")
  const { currency, formatPrice } = useSpecWise()

  const filteredLaptops = laptopsData
    .filter((laptop) => {
      if (activeFilter === "all") return true
      if (activeFilter === "under-1000") return laptop.price < 1000
      if (activeFilter === "under-1500") return laptop.price >= 1000 && laptop.price < 1500
      if (activeFilter === "over-2000") return laptop.price >= 2000
      return true
    })
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 6)

  return (
    <section className="relative z-10 border-t border-white/5 bg-background/10 py-24 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary"
            >
              <Sparkles className="h-3 w-3" />
              <span>Editors' Choices</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl font-bold tracking-tight md:text-5xl"
            >
              Best Laptops <span className="gradient-text">Right Now</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-lg text-muted-foreground"
            >
              Top-rated picks meticulously selected based on performance metrics and value.
            </motion.p>
          </div>
          <Link to="/laptops">
            <Button variant="ghost" className="h-14 gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 text-base font-bold hover:bg-white/10">
              View Collection
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Filter Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-wrap gap-3"
        >
          {getBudgetFilters(currency).map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={cn(
                "h-12 rounded-2xl border px-6 text-sm font-bold tracking-wide transition-all duration-300",
                activeFilter === filter.value
                  ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10"
              )}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        {/* Laptop Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLaptops.map((laptop, index) => {
            const score = Math.round(laptop.overallScore * 10)
            return (
              <motion.div
                key={laptop.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/laptops/${laptop.id}`}>
                  <Card className="group h-full overflow-hidden border-white/10 bg-white/[0.03] p-0 transition-all hover:bg-white/[0.07] hover:shadow-2xl hover:shadow-primary/5 active:scale-[0.98] backdrop-blur-xl">
                    <div className="relative aspect-[16/10] overflow-hidden border-b border-white/5">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                      <ProductImage src={laptop.image} alt={laptop.name} category={laptop.category} seed={laptop.id} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute bottom-4 left-4 z-20">
                        <ScoreBadgePill score={score} />
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                            {laptop.brand}
                          </p>
                          <h3 className="mt-2 font-display text-2xl font-bold leading-tight decoration-primary/30 decoration-2 transition-all group-hover:underline">
                            {laptop.name}
                          </h3>
                        </div>
                      </div>

                      <div className="mt-8 flex items-end justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Starting At</p>
                          <p className="font-display text-3xl font-black tracking-tighter">
                            {formatPrice(laptop.price_inr, laptop.price_usd)}
                          </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary backdrop-blur-md transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                          <ArrowRight className="h-6 w-6" />
                        </div>
                      </div>

                      <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/5 pt-8">
                        <div className="space-y-1.5">
                          <Cpu className="h-4 w-4 text-primary/60" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">CPU</p>
                          <p className="truncate text-xs font-bold leading-none">{laptop.specs.processor.split(" ").slice(-2).join(" ")}</p>
                        </div>
                        <div className="space-y-1.5">
                          <HardDrive className="h-4 w-4 text-primary/60" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">RAM</p>
                          <p className="text-xs font-bold leading-none">{laptop.specs.ram}</p>
                        </div>
                        <div className="space-y-1.5">
                          <Monitor className="h-4 w-4 text-primary/60" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">GPU</p>
                          <p className="text-xs font-bold leading-none">{laptop.specs.gpu.split(' ').slice(0, 2).join(' ')}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

