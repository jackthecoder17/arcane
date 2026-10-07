"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Character } from "@/lib/arcane-data";

/**
 * Character portrait from /public, falling back to the hex sigil
 * when the image file is missing or fails to load.
 */
export function CharacterArt({
  c,
  src,
  sizes,
  priority,
  className,
  sigilClassName,
}: {
  c: Character;
  src?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  sigilClassName?: string;
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("absolute inset-0", className)}>
      {src && !failed && (
        <Image
          src={src}
          alt={c.name}
          fill
          sizes={sizes}
          priority={priority}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            "object-cover object-[50%_20%] transition-[opacity,transform] duration-700 group-hover:scale-110",
            loaded ? "opacity-100" : "opacity-0"
          )}
        />
      )}

      {/* colour wash keeps every portrait on-palette */}
      {loaded && (
        <div
          className="absolute inset-0 mix-blend-color opacity-25"
          style={{ background: c.color }}
        />
      )}

      {!loaded && (
        <>
          <div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(circle_at_50%_35%,black,transparent_70%)]" />
          <motion.div
            aria-hidden
            className={cn(
              "hex-clip absolute top-[14%] left-1/2 grid aspect-square w-[52%] -translate-x-1/2 place-items-center p-[2px]",
              sigilClassName
            )}
            style={{ background: `linear-gradient(140deg, ${c.color}, transparent 70%)` }}
            animate={{ rotate: [0, 6, 0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          >
            <div className="hex-clip grid size-full place-items-center bg-ink/85">
              <span
                className="font-display text-4xl font-black tracking-wider sm:text-5xl"
                style={{ color: c.color, textShadow: `0 0 30px ${c.glow}` }}
              >
                {c.sigil}
              </span>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
