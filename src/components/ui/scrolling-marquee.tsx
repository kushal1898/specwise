"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollingMarqueeProps {
  children: ReactNode;
  speed?: number;
  direction?: "left" | "right";
  className?: string;
}

export function ScrollingMarquee({
  children,
  speed = 40,
  direction = "left",
  className = "",
}: ScrollingMarqueeProps) {
  const isLeft = direction === "left";

  return (
    <div className={`overflow-hidden whitespace-nowrap bg-primary/5 py-2 ${className} backdrop-blur-sm border-y border-white/5`}>
      <motion.div
        className="flex min-w-full"
        animate={{
          x: isLeft ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="flex shrink-0 items-center gap-12 px-6">
          {children}
        </div>
        <div className="flex shrink-0 items-center gap-12 px-6">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

