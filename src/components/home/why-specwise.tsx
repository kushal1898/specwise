"use client"

import { motion } from "framer-motion"
import { Zap, TrendingUp, BarChart3, ShieldCheck, Cpu } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Performance-First",
    description: "Real benchmarks, real data. We test every device with industry-standard tools and real-world scenarios.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: TrendingUp,
    title: "Value Rated",
    description: "Every product gets a value score based on performance per dollar, helping you maximize your budget.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: BarChart3,
    title: "Data-Driven",
    description: "No fluff, no bias. Our reviews are based purely on specifications, benchmarks, and measurable metrics.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
]

export function WhySpecWise() {
  return (
    <section className="relative z-10 border-y border-white/5 bg-background/5 py-32 backdrop-blur-sm overflow-hidden">
      {/* Abstract Background Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary backdrop-blur-xl border border-primary/20"
          >
            <ShieldCheck className="h-8 w-8" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-5xl font-black tracking-tighter md:text-6xl"
          >
            Why <span className="gradient-text">SpecWise</span>?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-xl text-muted-foreground font-medium"
          >
            We cut through marketing noise to deliver raw, unadulterated tech intelligence.
          </motion.p>
        </div>

        <div className="grid gap-12 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div 
              key={feature.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative flex flex-col items-center text-center p-10 rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-2xl transition-all hover:bg-white/[0.05] hover:border-white/10"
            >
              <div className={`flex h-20 w-20 items-center justify-center rounded-[2rem] ${feature.bg} ${feature.color} backdrop-blur-md border border-white/5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                <feature.icon className="h-10 w-10" />
              </div>
              <h3 className="mt-8 font-display text-2xl font-black tracking-tight">{feature.title}</h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground/80 font-medium">
                {feature.description}
              </p>
              
              {/* Decorative corner element */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <Cpu className={`h-5 w-5 ${feature.color} opacity-20`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Statement */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-24 flex flex-col items-center gap-6"
        >
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <p className="font-display text-lg font-black uppercase tracking-[0.4em] text-primary/40">
            Data Is The New Standard
          </p>
        </motion.div>
      </div>
    </section>
  )
}

