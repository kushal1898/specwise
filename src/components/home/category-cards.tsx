"use client"

import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Laptop, Smartphone, Headphones, ArrowUpRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import laptopsData from "@/data/laptops.json"
import phonesData from "@/data/phones.json"
import headphonesData from "@/data/headphones.json"

const categories = [
  {
    title: "Laptops",
    description: "Work, gaming, and everything in between",
    icon: Laptop,
    href: "/laptops",
    count: laptopsData.length,
    color: "from-blue-500/10 to-indigo-500/10",
    iconColor: "text-blue-500",
  },
  {
    title: "Phones",
    description: "Flagships, mid-range, and budget picks",
    icon: Smartphone,
    href: "/phones",
    count: phonesData.length,
    color: "from-emerald-500/10 to-teal-500/10",
    iconColor: "text-emerald-500",
  },
  {
    title: "Headphones",
    description: "IEMs, over-ears, and TWS reviewed",
    icon: Headphones,
    href: "/headphones",
    count: headphonesData.length,
    color: "from-purple-500/10 to-pink-500/10",
    iconColor: "text-purple-500",
  },
]

export function CategoryCards() {
  return (
    <section className="relative z-10 border-t border-white/5 bg-background/20 py-24 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl font-bold tracking-tight md:text-5xl"
          >
            Browse by Category
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            Deep-dive into specs, benchmarks, and real-world performance
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={category.href}>
                <Card className="group relative h-full overflow-hidden border-white/10 bg-white/[0.03] p-8 transition-all hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-primary/5 active:scale-[0.98] backdrop-blur-xl">
                  <div className="flex items-start justify-between">
                    <div className={`rounded-2xl bg-primary/10 p-4 ${category.iconColor} backdrop-blur-md`}>
                      <category.icon className="h-8 w-8" />
                    </div>
                    <ArrowUpRight className="h-6 w-6 text-muted-foreground/50 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-primary" />
                  </div>
                  <div className="mt-8">
                    <h3 className="font-display text-2xl font-bold tracking-tight">{category.title}</h3>
                    <p className="mt-3 text-base leading-relaxed text-muted-foreground">{category.description}</p>
                  </div>
                  <div className="mt-8 flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-primary" />
                    <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
                      {category.count} products
                    </span>
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


