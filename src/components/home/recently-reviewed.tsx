"use client"

import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Laptop, Smartphone, Headphones, ArrowRight, History } from "lucide-react"
import { Card } from "@/components/ui/card"
import { ScoreBadgePill } from "@/components/score-badge"
import { useSpecWise } from "@/lib/specwise-context"

import laptopsData from "@/data/laptops.json"
import phonesData from "@/data/phones.json"
import headphonesData from "@/data/headphones.json"

export function RecentlyReviewed() {
  const { formatPrice } = useSpecWise()

  const recentLaptops = laptopsData.slice(0, 2)
  const recentPhones = phonesData.slice(0, 2)
  const recentHeadphones = headphonesData.slice(0, 2)

  const sections = [
    { title: "Laptops", icon: Laptop, data: recentLaptops, href: "/laptops" },
    { title: "Phones", icon: Smartphone, data: recentPhones, href: "/phones" },
    { title: "Headphones", icon: Headphones, data: recentHeadphones, href: "/headphones" },
  ]

  return (
    <section className="relative z-10 border-t border-white/5 bg-background/5 py-24 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="mb-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 backdrop-blur-md">
              <History className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-display text-4xl font-bold tracking-tight">Recently <span className="text-primary">Logged</span></h2>
              <p className="text-muted-foreground mt-1 font-medium">Latest data entries into the SpecWise neural net</p>
            </div>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {sections.map((section, sIndex) => (
            <motion.div 
              key={section.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: sIndex * 0.1 }}
            >
              <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <section.icon className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-xl font-black uppercase tracking-widest">{section.title}</h3>
                </div>
                <Link to={section.href} className="group flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 transition-colors hover:text-primary">
                  View Registry <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {section.data.map((item, iIndex) => {
                  const score = 'score' in item ? item.score : Math.round((item as any).overallScore * 10)
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (sIndex * 0.1) + (iIndex * 0.1) }}
                    >
                      <Link to={`${section.href}/${item.id}`}>
                        <Card className="group relative flex items-center gap-5 border-white/5 bg-white/[0.02] p-5 transition-all hover:bg-white/[0.07] hover:border-white/10 backdrop-blur-xl">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-muted-foreground transition-all group-hover:scale-110 group-hover:border-primary/20 group-hover:text-primary">
                            <section.icon className="h-7 w-7" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-display text-lg font-bold tracking-tight">{item.name}</p>
                            <p className="mt-1 text-sm font-black text-muted-foreground/50">
                              {'price_inr' in item ? formatPrice(item.price_inr, (item as any).price_usd) : `$${(item as any).price.toLocaleString()}`}
                            </p>
                          </div>
                          <div className="shrink-0 transition-transform group-hover:scale-110">
                            <ScoreBadgePill score={score} />
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* HUD Decoration */}
        <div className="mt-24 pt-8 border-t border-white/5 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/20">
          <span>Database Sync: Optimized</span>
          <span>Buffer Status: Stable</span>
          <span>Registry: V2.4.0</span>
        </div>
      </div>
    </section>
  )
}

