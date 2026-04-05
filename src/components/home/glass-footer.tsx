import { motion } from "framer-motion";

export function GlassFooter() {
  return (
    <div className="relative w-full h-40 overflow-hidden bg-background flex items-center justify-center isolation-auto">
      {/* Liquid background shapes */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 180, 270, 360],
          borderRadius: ["40% 60% 70% 30%", "60% 40% 30% 70%", "40% 60% 70% 30%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute w-64 h-64 bg-primary/30 blur-2xl top-1/2 left-1/4 -translate-y-1/2 -z-10"
      />
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          rotate: [360, 270, 180, 90, 0],
          borderRadius: ["60% 40% 30% 70%", "40% 60% 70% 30%", "60% 40% 30% 70%"],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute w-72 h-72 bg-blue-500/30 blur-2xl top-1/2 right-1/4 -translate-y-1/2 -z-10"
      />
      
      {/* Glassmorphism content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 px-8 py-4 backdrop-blur-xl bg-background/20 border border-white/10 dark:border-white/5 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] select-none group hover:bg-background/30 transition-colors duration-500"
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <p className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500 flex items-center gap-2">
          Made by 
          <span className="font-bold text-foreground drop-shadow-sm">Kushal Goel</span> 
          <span className="text-sm px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono">
            24BCE2106
          </span>
        </p>
      </motion.div>
    </div>
  );
}
