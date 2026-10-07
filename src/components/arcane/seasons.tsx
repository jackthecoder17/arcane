"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { seasons } from "@/lib/arcane-data";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/lib/use-media-query";
import { SectionHeading } from "./section-heading";

type Panel =
  | { kind: "season"; label: string; year: string; tagline: string; index: number }
  | { kind: "act"; act: string; title: string; text: string; season: number; n: number };

const panels: Panel[] = seasons.flatMap((s, si) => [
  { kind: "season" as const, label: s.label, year: s.year, tagline: s.tagline, index: si },
  ...s.acts.map((a, ai) => ({ kind: "act" as const, ...a, season: si, n: ai })),
]);

function PanelCard({ p, className }: { p: Panel; className?: string }) {
  if (p.kind === "season") {
    const pink = p.index === 1;
    return (
      <div
        className={cn(
          "relative flex flex-col justify-between overflow-hidden rounded-3xl border p-7 sm:p-9",
          pink ? "border-shimmer/30 bg-shimmer/[0.06]" : "border-hex/30 bg-hex/[0.06]",
          className
        )}
      >
        <div
          className={cn(
            "absolute -top-24 -right-24 size-72 rounded-full blur-3xl",
            pink ? "bg-shimmer/30" : "bg-hex/30"
          )}
        />
        <span className="relative text-xs tracking-[0.35em] text-foreground/60 uppercase">{p.label}</span>
        <div className="relative">
          <div className="text-hextech font-display text-[clamp(3.5rem,18vw,7rem)] leading-none lg:text-[min(7rem,7.5vw)] font-black">
            {p.year}
          </div>
          <p className="mt-3 font-display text-2xl tracking-wide sm:text-3xl">{p.tagline}</p>
        </div>
      </div>
    );
  }
  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-card/60 p-7 backdrop-blur transition-colors hover:border-gold/40 sm:p-9",
        className
      )}
    >
      <span className="pointer-events-none absolute -right-4 -bottom-10 font-display text-[11rem] leading-none font-black text-white/[0.04] transition-colors group-hover:text-gold/10">
        {["I", "II", "III"][p.n]}
      </span>
      <div className="relative flex items-center gap-3">
        <span className="hex-clip grid size-10 place-items-center bg-gold/15 font-display text-sm font-bold text-gold">
          {p.n + 1}
        </span>
        <span className="text-xs tracking-[0.3em] text-foreground/60 uppercase">
          Season {p.season + 1} · {p.act}
        </span>
      </div>
      <div className="relative mt-10 lg:mt-16">
        <h3 className="font-display text-2xl font-bold sm:text-3xl">{p.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-foreground/65 sm:text-base">{p.text}</p>
      </div>
    </div>
  );
}

function HorizontalTrack() {
  const ref = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const x = useTransform(smooth, [0, 1], [0, -distance]);

  useEffect(() => {
    const measure = () => {
      if (track.current) setDistance(track.current.scrollWidth - window.innerWidth + 48);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div ref={ref} style={{ height: `calc(100vh + ${distance}px)` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-6">
          <SectionHeading align="left" eyebrow="The Story" title={<>Six acts. <span className="text-hextech">One fuse.</span></>} />
        </div>
        <motion.div ref={track} style={{ x }} className="mt-10 flex gap-6 pr-6 pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]">
          {panels.map((p, i) => (
            <PanelCard key={i} p={p} className="h-[52vh] max-h-[440px] min-h-[340px] w-[min(440px,36vw)] shrink-0" />
          ))}
        </motion.div>
        <div className="mx-auto mt-8 w-full max-w-7xl px-6">
          <div className="h-px w-full bg-white/10">
            <motion.div style={{ scaleX: smooth }} className="h-px origin-left bg-gradient-to-r from-gold via-hex to-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StackedTrack() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6">
      <SectionHeading eyebrow="The Story" title={<>Six acts. <span className="text-hextech">One fuse.</span></>} />
      <div className="relative mt-12 flex flex-col gap-4">
        {panels.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50, rotateX: -15 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformPerspective: 800 }}
          >
            <PanelCard p={p} className={p.kind === "season" ? "min-h-64" : "min-h-56"} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function Seasons() {
  const desktop = useMediaQuery("(min-width: 1024px)");
  return (
    <section id="seasons" className="relative scroll-mt-0">
      {desktop ? <HorizontalTrack /> : <StackedTrack />}
    </section>
  );
}
