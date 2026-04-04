"use client"

import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Zap, Shield, Cpu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollingMarquee } from "@/components/ui/scrolling-marquee"

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden pt-20">
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="flex flex-col items-center text-center">
          {/* Animated Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>The Future of Tech Reviews</span>
          </motion.div>

          {/* Bold Typography Statement */}
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-5xl font-extrabold tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl"
          >
            <span className="block leading-none opacity-90">SELECT.</span>
            <span className="block leading-none gradient-text">SPEC.</span>
            <span className="block leading-none opacity-90">SYST.</span>
          </motion.h1>

          {/* Floating Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative z-30 mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row"
          >
            <Link to="/laptops">
              <Button size="lg" className="h-16 gap-3 px-8 text-lg font-bold shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                Compare Laptops
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/phones">
              <Button variant="outline" size="lg" className="h-16 border-primary/20 bg-primary/5 px-8 text-lg font-bold backdrop-blur-xl transition-all hover:bg-primary/10">
                Explore Phones
              </Button>
            </Link>
          </motion.div>

          {/* Dynamic Interactive Description */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mx-auto mt-12 max-w-2xl text-pretty text-lg font-medium text-foreground/70 md:text-xl lg:text-2xl"
          >
            Cutting through the noise with raw benchmarks and direct data. 
            Built for those who care about what&apos;s inside.
          </motion.p>
        </div>
      </div>

      {/* Live Design Flow Marquee - Subtler & Smaller */}
      <div className="absolute bottom-8 w-full opacity-50 z-10 pointer-events-none">
        <ScrollingMarquee speed={50}>
          <div className="flex items-center gap-12 text-xs font-black uppercase tracking-[0.5em] text-muted-foreground/40">
            <span>Data Driven Insights</span>
            <Zap className="h-3 w-3 text-primary/30" />
            <span>Benchmark Performance</span>
            <Cpu className="h-3 w-3 text-primary/30" />
            <span>Verified Ratings</span>
            <Shield className="h-3 w-3 text-primary/30" />
            <span>Value Metrics</span>
            <Sparkles className="h-3 w-3 text-primary/30" />
          </div>
        </ScrollingMarquee>
      </div>
    </section>
  )
}

