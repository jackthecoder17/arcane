"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NETFLIX_URL } from "@/lib/arcane-data";
import { HexMark } from "./hex-mark";

const links = [
  { href: "#cities", label: "Cities" },
  { href: "#characters", label: "Characters" },
  { href: "#seasons", label: "Seasons" },
  { href: "#legacy", label: "Legacy" },
];

export function Navbar() {
  const { scrollY, scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 40);
  });

  return (
    <header className="animate-in fade-in slide-in-from-top-4 fixed inset-x-0 top-0 z-50 duration-700">
      <div
        className={cn(
          "mx-auto flex h-16 max-w-7xl items-center justify-between px-4 transition-all duration-500 sm:px-6 md:h-20",
          scrolled &&
            "mt-2 h-14 max-w-[calc(100%-1rem)] rounded-2xl border border-white/10 bg-ink/60 backdrop-blur-xl md:mt-3 md:h-16 md:max-w-6xl"
        )}
      >
        <a href="#top" className="flex items-center gap-2.5" aria-label="Arcane home">
          <HexMark className="size-8" />
          <span className="font-display text-lg font-bold tracking-[0.3em]">ARCANE</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative px-4 py-2 text-sm text-foreground/70 transition-colors hover:text-foreground"
            >
              {l.label}
              <span className="absolute inset-x-4 bottom-1 h-px origin-left scale-x-0 bg-gradient-to-r from-gold to-hex transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={NETFLIX_URL}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ size: "lg" }),
              "hidden h-10 rounded-full px-5 font-semibold sm:inline-flex"
            )}
          >
            Watch now
          </a>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" className="size-10 md:hidden" aria-label="Open menu" />}
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] border-white/10 bg-ink/95 backdrop-blur-xl">
              <SheetHeader>
                <SheetTitle className="font-display tracking-[0.3em]">ARCANE</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {links.map((l, i) => (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, x: 30 }}
                    animate={open ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.08 * i + 0.1 }}
                  >
                    <SheetClose
                      render={
                        <a
                          href={l.href}
                          className="block border-b border-white/5 py-4 font-display text-2xl tracking-wide"
                        />
                      }
                      nativeButton={false}
                    >
                      {l.label}
                    </SheetClose>
                  </motion.div>
                ))}
              </nav>
              <div className="mt-auto p-4">
                <a
                  href={NETFLIX_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(buttonVariants({ size: "lg" }), "h-12 w-full rounded-full text-base")}
                >
                  Watch on Netflix
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="absolute inset-x-0 top-0 h-[2px] origin-left bg-gradient-to-r from-gold via-hex to-shimmer"
      />
    </header>
  );
}
