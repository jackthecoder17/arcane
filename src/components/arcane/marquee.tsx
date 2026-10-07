"use client";

import { motion } from "framer-motion";

const words = ["Piltover", "Zaun", "Hextech", "Shimmer", "The Undercity", "Firelights", "Progress Day", "The Arcane"];

function Row({ reverse = false, className }: { reverse?: boolean; className?: string }) {
  const items = [...words, ...words];
  return (
    <div className="flex overflow-hidden">
      <motion.div
        className={`flex shrink-0 items-center gap-8 pr-8 ${className ?? ""}`}
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
      >
        {items.map((w, i) => (
          <span key={i} className="flex items-center gap-8 whitespace-nowrap">
            {w}
            <svg viewBox="0 0 10 10" className="size-2.5 fill-current opacity-60" aria-hidden>
              <path d="M5 0 10 5 5 10 0 5Z" />
            </svg>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function Marquee() {
  return (
    <div className="relative -my-6 py-10" aria-hidden>
      <div className="-rotate-2 border-y border-gold/20 bg-gold py-3 font-display text-xl font-bold tracking-[0.2em] text-ink uppercase sm:text-3xl">
        <Row />
      </div>
      <div className="-mt-3 rotate-1 border-y border-white/10 bg-ink py-3 font-display text-xl tracking-[0.2em] text-hex uppercase sm:text-3xl">
        <Row reverse />
      </div>
    </div>
  );
}
