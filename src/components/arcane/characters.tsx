"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { characters, type Character } from "@/lib/arcane-data";
import { SectionHeading } from "./section-heading";
import { CharacterArt } from "./character-art";

type Filter = "all" | "Piltover" | "Zaun";

function TiltCard({ c, onOpen, index }: { c: Character; onOpen: () => void; index: number }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 200, damping: 20 });
  const sy = useSpring(my, { stiffness: 200, damping: 20 });
  const rotateY = useTransform(sx, [0, 1], [-14, 14]);
  const rotateX = useTransform(sy, [0, 1], [12, -12]);
  const glareX = useTransform(sx, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(sy, [0, 1], ["0%", "100%"]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.22), transparent 55%)`;

  return (
    <motion.button
      layout
      type="button"
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      onClick={onOpen}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="group relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-white/10 bg-card text-left outline-none focus-visible:ring-2 focus-visible:ring-gold"
      aria-label={`Learn more about ${c.name}`}
    >
      {/* art */}
      <div
        className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${c.glow}, transparent 60%), linear-gradient(160deg, #1a1424 0%, #0a0810 100%)`,
        }}
      />
      <CharacterArt c={c} src={c.image} priority={index < 4} sizes="(min-width: 1024px) 25vw, 50vw" />
      <motion.div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" style={{ background: glare }} />

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/85 to-transparent p-4 pt-16 sm:p-5 sm:pt-20">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: c.color }}>
            {c.city === "Both" ? "Both cities" : c.city}
          </span>
          <ArrowUpRight className="size-4 text-foreground/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
        </div>
        <h3 className="mt-1 font-display text-2xl font-bold sm:text-3xl">{c.name}</h3>
        <p className="mt-0.5 text-xs text-foreground/55 sm:text-sm">{c.title}</p>
        <p className="mt-3 hidden max-h-0 overflow-hidden text-sm text-foreground/80 italic opacity-0 transition-all duration-500 group-hover:max-h-16 group-hover:opacity-100 sm:block">
          “{c.line}”
        </p>
      </div>
      <span
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
        style={{ background: c.color }}
      />
    </motion.button>
  );
}

export function Characters() {
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Character | null>(null);

  const list = characters.filter(
    (c) => filter === "all" || c.city === filter || c.city === "Both"
  );

  return (
    <section id="characters" className="relative scroll-mt-20 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(155,92,255,0.12),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="The Players"
          title={
            <>
              Heroes, <span className="text-hextech">monsters</span> &amp; everyone between
            </>
          }
          description="Every choice leaves a scar. Meet the people pulling the strings — and the ones caught in them."
        />

        <div className="mt-10 flex justify-center">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
            <TabsList className="h-11! rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur">
              {(["all", "Piltover", "Zaun"] as const).map((f) => (
                <TabsTrigger
                  key={f}
                  value={f}
                  className="rounded-full px-4 text-xs tracking-widest uppercase data-active:bg-gold! data-active:text-ink! sm:px-6"
                >
                  {f === "all" ? "All" : f}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <motion.div layout className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.map((c, i) => (
              <TiltCard key={c.name} c={c} index={i} onOpen={() => setSelected(c)} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="overflow-hidden border-white/10 bg-ink p-0 sm:max-w-lg">
          {selected && (
            <>
              <div
                className="relative h-56 overflow-hidden sm:h-64"
                style={{
                  background: `radial-gradient(circle at 50% 60%, ${selected.glow}, transparent 70%), #0a0810`,
                }}
              >
                <CharacterArt
                  c={selected}
                  src={selected.splash}
                  sizes="(min-width: 640px) 512px, 100vw"
                  sigilClassName="top-1/2 w-28 -translate-y-1/2"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
              </div>
              <div className="p-5 sm:p-6">
                <DialogHeader>
                  <DialogTitle className="font-display text-3xl">{selected.name}</DialogTitle>
                  <DialogDescription style={{ color: selected.color }}>{selected.title}</DialogDescription>
                </DialogHeader>
                <p className="mt-4 text-sm leading-relaxed text-foreground/75">{selected.bio}</p>
                <blockquote className="mt-4 border-l-2 pl-4 text-sm text-foreground/90 italic" style={{ borderColor: selected.color }}>
                  “{selected.line}”
                </blockquote>
                <div className="mt-5 flex flex-wrap gap-2">
                  {selected.traits.map((t) => (
                    <Badge key={t} variant="outline" className="rounded-full border-white/15">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
