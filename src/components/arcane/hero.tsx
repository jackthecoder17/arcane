"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { NETFLIX_URL } from "@/lib/arcane-data";
import { TrailerDialog } from "./trailer-dialog";

const HeroScene = dynamic(() => import("./hero-scene"), { ssr: false });

const ease = [0.22, 1, 0.36, 1] as const;

const letters = "ARCANE".split("");

const titleContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.55 } },
};

const letter: Variants = {
  hidden: { opacity: 0, y: "60%", rotateX: -80 },
  show: { opacity: 1, y: "0%", rotateX: 0, transition: { duration: 1.1, ease } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (d: number) => ({ opacity: 1, y: 0, transition: { delay: d, duration: 0.9, ease } }),
};

/** One of the two sisters framing the scene, drifting with the cursor. */
function SisterArt({
  src,
  alt,
  side,
  px,
  py,
  depth,
}: {
  src: string;
  alt: string;
  side: "left" | "right";
  px: MotionValue<number>;
  py: MotionValue<number>;
  depth: number;
}) {
  const x = useTransform(px, (v) => v * depth);
  const y = useTransform(py, (v) => v * depth * 0.5);
  const left = side === "left";

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, x: left ? -80 : 80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.8, ease, delay: 0.15 }}
      className={cn(
        "absolute h-[58%] w-full md:inset-y-0 md:h-full md:w-[56%]",
        left ? "top-0 left-0" : "right-0 bottom-0"
      )}
    >
      <motion.div style={{ x, y }} className="absolute -inset-8">
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(min-width: 768px) 56vw, 100vw"
          className={cn(
            "object-cover brightness-[0.62] saturate-[0.9]",
            left ? "object-[38%_25%]" : "object-[58%_25%]"
          )}
          style={{
            maskImage: left
              ? "linear-gradient(to right, black 15%, transparent 92%), linear-gradient(to bottom, black 55%, transparent)"
              : "linear-gradient(to left, black 15%, transparent 92%), linear-gradient(to top, black 55%, transparent)",
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
            WebkitMaskImage: left
              ? "linear-gradient(to right, black 15%, transparent 92%), linear-gradient(to bottom, black 55%, transparent)"
              : "linear-gradient(to left, black 15%, transparent 92%), linear-gradient(to top, black 55%, transparent)",
          }}
        />
      </motion.div>
      {/* colour grade: Vi in shimmer pink, Jinx in hextech blue */}
      <div
        className={cn(
          "absolute inset-0 opacity-50",
          left
            ? "bg-[radial-gradient(ellipse_at_20%_40%,rgba(255,63,164,0.35),transparent_60%)]"
            : "bg-[radial-gradient(ellipse_at_80%_40%,rgba(79,216,255,0.3),transparent_60%)]"
        )}
      />
    </motion.div>
  );
}

function SideLabel({ side, children }: { side: "left" | "right"; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 1.2 }}
      className={cn(
        "pointer-events-none absolute top-1/2 z-10 hidden items-center gap-4 text-[10px] tracking-[0.5em] text-foreground/45 uppercase [@media(min-height:820px)]:lg:flex",
        side === "left"
          ? "left-6 origin-left -translate-y-1/2 -rotate-90 translate-x-3"
          : "right-6 origin-right -translate-y-1/2 rotate-90 -translate-x-3"
      )}
    >
      <span className="h-px w-10 bg-foreground/30" />
      {children}
      <span className="h-px w-10 bg-foreground/30" />
    </motion.div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Pointer parallax for the painted backdrop (compositor-only transforms).
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, { stiffness: 50, damping: 20 });
  const py = useSpring(rawY, { stiffness: 50, damping: 20 });

  return (
    <section
      id="top"
      ref={ref}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        rawX.set((e.clientX / window.innerWidth) * 2 - 1);
        rawY.set((e.clientY / window.innerHeight) * 2 - 1);
      }}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink"
    >
      {/* Painted backdrop */}
      <motion.div style={{ opacity: fade }} className="absolute inset-0 -z-10">
        <SisterArt src="/characters/vi-splash.jpg" alt="Vi" side="left" px={px} py={py} depth={-18} />
        <SisterArt src="/characters/jinx-splash.jpg" alt="Jinx" side="right" px={px} py={py} depth={-28} />
        {/* centre seam of light where the two worlds meet */}
        <div className="absolute inset-y-0 left-1/2 w-[40vw] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(7,6,11,0.85),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,transparent_20%,rgba(7,6,11,0.75)_80%)]" />
      </motion.div>

      {/* 3D hextech core */}
      <motion.div style={{ opacity: fade }} className="absolute inset-0 -z-10">
        <HeroScene />
      </motion.div>

      <SideLabel side="left">Piltover · City of Progress</SideLabel>
      <SideLabel side="right">Zaun · The Undercity</SideLabel>

      {/* Copy */}
      <motion.div
        style={{ y: contentY, opacity: fade }}
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-end px-4 pt-32 pb-28 text-center sm:px-6 md:pb-32"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[70%] bg-[radial-gradient(50%_55%_at_50%_60%,rgba(7,6,11,0.8),transparent)]"
        />

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.3}
          className="flex items-center gap-3 text-[10px] tracking-[0.45em] text-gold uppercase sm:text-xs"
        >
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-shimmer opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-shimmer" />
          </span>
          Seasons 1 &amp; 2 streaming now
        </motion.p>

        <motion.h1
          variants={titleContainer}
          initial="hidden"
          animate="show"
          aria-label="Arcane"
          className="mt-5 flex font-display text-[clamp(3.6rem,18vw,12.5rem)] leading-[0.85] font-black tracking-[0.05em] [perspective:900px]"
        >
          {letters.map((l, i) => (
            <span key={i} className="inline-block overflow-hidden px-[0.01em] pb-[0.06em]">
              <motion.span
                variants={letter}
                aria-hidden
                className="text-hextech inline-block origin-bottom drop-shadow-[0_8px_40px_rgba(79,216,255,0.25)]"
              >
                {l}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1.2}
          className="mt-5 flex w-full max-w-md items-center gap-4 font-display text-xs tracking-[0.4em] text-foreground/80 uppercase sm:text-sm"
        >
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/60" />
          Two cities · One war
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/60" />
        </motion.div>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1.4}
          className="mt-5 max-w-lg text-sm leading-relaxed text-foreground/70 sm:text-base"
        >
          Two sisters. Two cities. Torn apart by hextech, shimmer and the choices they can never take back.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1.6}
          className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row"
        >
          <a
            href={NETFLIX_URL}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ size: "lg" }),
              "group relative h-12 w-full overflow-hidden rounded-full px-8 text-base font-semibold shadow-[0_10px_40px_-10px_rgba(232,184,102,0.8)] sm:w-auto"
            )}
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <Play className="size-4 fill-current" />
            Watch on Netflix
          </a>
          <TrailerDialog />
        </motion.div>
      </motion.div>

      {/* Bottom info rail */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.1, duration: 1 }}
        className="absolute inset-x-0 bottom-0 z-10 border-t border-white/10 bg-ink/40 backdrop-blur-sm"
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 text-[10px] tracking-[0.3em] text-foreground/55 uppercase sm:px-6 sm:text-[11px]">
          <span className="hidden sm:inline">S1 · 2021 &nbsp;/&nbsp; S2 · 2024</span>
          <a href="#cities" className="flex items-center gap-3 transition-colors hover:text-foreground" aria-label="Scroll to explore">
            <span className="relative flex h-7 w-4 justify-center rounded-full border border-foreground/40">
              <motion.span
                animate={{ y: [3, 11, 3], opacity: [1, 0.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                className="mt-0.5 h-1.5 w-0.5 rounded-full bg-foreground/80"
              />
            </span>
            Enter Runeterra
          </a>
          <span className="hidden sm:inline">18 episodes · Fortiche</span>
        </div>
      </motion.div>
    </section>
  );
}
