"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { NETFLIX_URL } from "@/lib/arcane-data";
import { HexMark } from "./hex-mark";

export function CallToAction() {
  const [side, setSide] = useState<"piltover" | "zaun">("zaun");
  const [done, setDone] = useState(false);

  return (
    <section className="relative px-4 py-20 sm:px-6 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 p-[1px]"
      >
        {/* rotating conic border */}
        <motion.div
          aria-hidden
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          className="absolute top-1/2 left-1/2 aspect-square w-[200%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0%,#e8b866_10%,transparent_20%,transparent_50%,#ff3fa4_60%,transparent_70%)]"
        />
        <div className="relative overflow-hidden rounded-[calc(2rem-1px)] bg-ink px-5 py-12 text-center sm:px-12 sm:py-16">
          <motion.div
            aria-hidden
            animate={{ backgroundColor: side === "zaun" ? "rgba(255,63,164,0.18)" : "rgba(79,216,255,0.18)" }}
            className="absolute -top-32 left-1/2 size-96 -translate-x-1/2 rounded-full blur-3xl"
          />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold text-balance sm:text-5xl">
              Choose your <span className="text-hextech">side</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-foreground/60 sm:text-base">
              Pick a city, drop your email, and get notified about every new drop from the world of Runeterra.
            </p>

            <div className="mx-auto mt-8 inline-flex rounded-full border border-white/10 bg-white/5 p-1">
              {(["piltover", "zaun"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSide(s)}
                  className="relative rounded-full px-5 py-2 font-display text-sm tracking-widest uppercase sm:px-7"
                >
                  {side === s && (
                    <motion.span
                      layoutId="side-pill"
                      className={cn(
                        "absolute inset-0 rounded-full",
                        s === "zaun" ? "bg-shimmer" : "bg-hex"
                      )}
                      transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    />
                  )}
                  <span className={cn("relative", side === s ? "text-ink" : "text-foreground/70")}>{s}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {done ? (
                <motion.p
                  key="done"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mx-auto mt-6 flex max-w-md items-center justify-center gap-2 text-chem"
                >
                  <Check className="size-5" /> Welcome to {side === "zaun" ? "the undercity" : "the city of progress"}.
                </motion.p>
              ) : (
                <motion.form
                  key="form"
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    setDone(true);
                  }}
                  className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row"
                >
                  <Input
                    type="email"
                    required
                    placeholder="you@example.com"
                    aria-label="Email address"
                    className="h-12 rounded-full border-white/15 bg-white/5 px-5 text-base"
                  />
                  <Button type="submit" size="lg" className="h-12 rounded-full px-6 text-base">
                    <Sparkles className="size-4" /> Join
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 pt-14 pb-10 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <HexMark className="size-10" />
            <span className="font-display text-2xl font-bold tracking-[0.3em]">ARCANE</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-foreground/50">
            Two cities. One war. Both seasons streaming now.
          </p>
        </div>
        <a
          href={NETFLIX_URL}
          target="_blank"
          rel="noreferrer"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 w-full rounded-full px-6 md:w-auto")}
        >
          Watch on Netflix
        </a>
      </div>
      <Separator className="mx-auto my-8 max-w-7xl bg-white/10" />
      <p className="mx-auto max-w-7xl text-xs leading-relaxed text-foreground/40">
        Unofficial fan-made page. Arcane, League of Legends and related marks are property of Riot Games.
        Character art © Riot Games. Animation by Fortiche. Not affiliated with Riot Games or Netflix.
      </p>
    </footer>
  );
}
