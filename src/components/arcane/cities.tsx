"use client";

import { useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { seeded } from "@/lib/use-media-query";
import { SectionHeading } from "./section-heading";

type CityInfo = {
  key: "piltover" | "zaun";
  name: string;
  epithet: string;
  text: string;
  tags: string[];
  accent: string;
  bg: string;
};

const cities: CityInfo[] = [
  {
    key: "piltover",
    name: "Piltover",
    epithet: "The City of Progress",
    text: "Gleaming towers, brass gates and councils in velvet chairs. Above the clouds, hextech promises a future of limitless wonder — for those who can afford it.",
    tags: ["Hextech", "The Council", "Enforcers"],
    accent: "text-gold",
    bg: "bg-[linear-gradient(180deg,#2b1f10_0%,#120d16_70%)]",
  },
  {
    key: "zaun",
    name: "Zaun",
    epithet: "The Undercity",
    text: "Neon haze, chem-tank fumes and a people forged in the dark. Below the bridge, shimmer flows, rebellion brews and survival is its own kind of genius.",
    tags: ["Shimmer", "Chem-Barons", "Firelights"],
    accent: "text-chem",
    bg: "bg-[linear-gradient(180deg,#0b1f1b_0%,#170a1f_70%)]",
  },
];

function Skyline({ variant }: { variant: "piltover" | "zaun" }) {
  // Deterministic pseudo-random skyline so SSR and client match.
  const buildings = useMemo(() => {
    const rand = seeded(variant === "piltover" ? 7 : 13);
    return Array.from({ length: 22 }, (_, i) => ({
      x: i * 20 + rand() * 4,
      w: 12 + rand() * 10,
      h: variant === "piltover" ? 80 + rand() * 150 : 40 + rand() * 90,
      spire: variant === "piltover" && rand() > 0.55,
      lights: Math.floor(rand() * 6) + 2,
    }));
  }, [variant]);

  const fill = variant === "piltover" ? "#e8b866" : "#7cf2b0";
  const glow = variant === "piltover" ? "#4fd8ff" : "#ff3fa4";

  return (
    <svg viewBox="0 0 440 260" preserveAspectRatio="xMidYMax slice" className="absolute inset-x-0 bottom-0 h-3/4 w-full" aria-hidden>
      <defs>
        <linearGradient id={`sky-${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={fill} stopOpacity="0.35" />
          <stop offset="1" stopColor="#07060b" stopOpacity="1" />
        </linearGradient>
      </defs>
      {buildings.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={260 - b.h} width={b.w} height={b.h} fill={`url(#sky-${variant})`} />
          {b.spire && <path d={`M${b.x} ${260 - b.h} L${b.x + b.w / 2} ${230 - b.h} L${b.x + b.w} ${260 - b.h}Z`} fill={fill} opacity="0.4" />}
          {Array.from({ length: b.lights }).map((_, j) => (
            <rect
              key={j}
              x={b.x + 3 + ((j * 5) % (b.w - 5))}
              y={260 - b.h + 12 + j * 14}
              width="2"
              height="3"
              fill={glow}
              opacity={0.85}
            >
              <animate attributeName="opacity" values="0.9;0.2;0.9" dur={`${2 + ((i + j) % 5)}s`} repeatCount="indefinite" />
            </rect>
          ))}
        </g>
      ))}
      {variant === "zaun" && (
        <>
          <path d="M0 200 C 80 170, 140 230, 220 200 S 360 180, 440 205" stroke="#7cf2b0" strokeWidth="3" fill="none" opacity="0.35" />
          <path d="M0 225 C 100 205, 160 250, 260 225 S 380 210, 440 230" stroke="#ff3fa4" strokeWidth="2" fill="none" opacity="0.35" />
        </>
      )}
    </svg>
  );
}

type CityKey = CityInfo["key"];

function CityPanel({
  c,
  x,
  opacity,
  active,
  setActive,
}: {
  c: CityInfo;
  x: MotionValue<string>;
  opacity: MotionValue<number>;
  active: CityKey | null;
  setActive: (k: CityKey | null) => void;
}) {
  const isActive = active === c.key;
  const dimmed = active !== null && !isActive;

  // Pointer position inside the panel (0..1), smoothed.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 120, damping: 20 });
  const sy = useSpring(py, { stiffness: 120, damping: 20 });
  const skyX = useTransform(sx, [0, 1], [18, -18]);
  const skyY = useTransform(sy, [0, 1], [10, -6]);
  const spotX = useTransform(sx, (v) => `${v * 100}%`);
  const spotY = useTransform(sy, (v) => `${v * 100}%`);
  const tint = c.key === "piltover" ? "232,184,102" : "255,63,164";
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${spotX} ${spotY}, rgba(${tint},0.22), transparent 60%)`;

  return (
    <motion.article
      style={{ x, opacity }}
      onPointerEnter={(e) => e.pointerType === "mouse" && setActive(c.key)}
      onPointerLeave={() => {
        setActive(null);
        px.set(0.5);
        py.set(0.5);
      }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
      }}
      className={cn(
        "group relative h-[460px] overflow-hidden rounded-3xl border transition-[border-color,box-shadow,transform] duration-500 sm:h-[520px] md:h-[560px]",
        "hover:-translate-y-1",
        c.bg,
        isActive
          ? c.key === "piltover"
            ? "border-gold/40 shadow-[0_30px_80px_-30px_rgba(232,184,102,0.45)]"
            : "border-shimmer/40 shadow-[0_30px_80px_-30px_rgba(255,63,164,0.45)]"
          : "border-white/10"
      )}
    >
      {/* skyline drifts against the cursor for depth */}
      <motion.div style={{ x: skyX, y: skyY }} className="absolute -inset-x-6 -bottom-2 top-0">
        <Skyline variant={c.key} />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
      <motion.div
        aria-hidden
        style={{ background: spotlight }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <div
        className={cn(
          "absolute -top-24 left-1/2 size-80 -translate-x-1/2 rounded-full blur-3xl transition-opacity duration-700",
          c.key === "piltover" ? "bg-gold/25" : "bg-shimmer/25",
          isActive ? "opacity-100" : "opacity-50"
        )}
      />

      <div className="relative flex h-full flex-col justify-end p-6 sm:p-8 lg:p-10">
        <span className={cn("text-xs tracking-[0.35em] uppercase", c.accent)}>{c.epithet}</span>
        <h3 className="mt-2 font-display text-[clamp(2.5rem,11vw,3.75rem)] leading-none font-black tracking-wide md:text-[clamp(2.5rem,5vw,4.5rem)]">
          {c.name}
        </h3>
        <span
          className={cn(
            "mt-4 block h-px w-12 origin-left transition-transform duration-500 group-hover:scale-x-[3]",
            c.key === "piltover" ? "bg-gold" : "bg-shimmer"
          )}
        />
        <p className="mt-4 max-w-md text-sm leading-relaxed text-foreground/70 sm:text-base">{c.text}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {c.tags.map((t, j) => (
            <span
              key={t}
              style={{ transitionDelay: `${j * 60}ms` }}
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-foreground/80 backdrop-blur transition-transform duration-300 group-hover:-translate-y-0.5"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* the other city recedes slightly instead of changing size */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 bg-ink transition-opacity duration-500",
          dimmed ? "opacity-40" : "opacity-0"
        )}
      />
    </motion.article>
  );
}

export function Cities() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState<CityKey | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const leftX = useTransform(scrollYProgress, [0, 1], ["-6%", "0%"]);
  const rightX = useTransform(scrollYProgress, [0, 1], ["6%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  return (
    <section id="cities" ref={ref} className="relative mx-auto max-w-7xl scroll-mt-20 px-4 py-24 sm:px-6 md:py-32">
      <SectionHeading
        eyebrow="The World"
        title={
          <>
            A tale of <span className="text-hextech">two cities</span>
          </>
        }
        description="Bound by a single bridge and divided by everything else."
      />

      <div className="relative mt-14 grid gap-4 md:grid-cols-2 md:gap-5">
        {cities.map((c, i) => (
          <CityPanel
            key={c.key}
            c={c}
            x={i === 0 ? leftX : rightX}
            opacity={opacity}
            active={active}
            setActive={setActive}
          />
        ))}

        {/* Bridge medallion */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80, damping: 12, delay: 0.3 }}
            className="hex-clip grid size-16 place-items-center bg-gradient-to-br from-gold via-hex to-shimmer p-[2px] sm:size-20"
          >
            <div className="hex-clip grid size-full place-items-center bg-ink font-display text-sm font-bold tracking-widest">
              VS
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
