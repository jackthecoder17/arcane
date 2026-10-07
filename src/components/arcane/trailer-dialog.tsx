"use client";

import { motion } from "framer-motion";
import { ExternalLink, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NETFLIX_URL, TRAILER_URL } from "@/lib/arcane-data";

/** Paste an official YouTube trailer ID here to embed it in the dialog. */
const YOUTUBE_TRAILER_ID = "";

export function TrailerDialog() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="lg"
            className="h-12 w-full gap-3 rounded-full border-white/20 bg-white/5 px-6 text-base backdrop-blur hover:bg-white/10 sm:w-auto"
          />
        }
      >
        <span className="grid size-7 place-items-center rounded-full bg-hex/20 ring-1 ring-hex/50">
          <Play className="size-3 fill-hex text-hex" />
        </span>
        Play trailer
      </DialogTrigger>
      <DialogContent className="overflow-hidden border-white/10 bg-ink p-0 sm:max-w-3xl">
        <div className="relative aspect-video w-full bg-black">
          {YOUTUBE_TRAILER_ID ? (
            <iframe
              className="absolute inset-0 size-full"
              src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_TRAILER_ID}?autoplay=1&rel=0`}
              title="Arcane trailer"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(79,216,255,0.35),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(255,63,164,0.35),transparent_50%)]" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
                className="absolute size-[70%] rounded-full border border-dashed border-gold/30"
              />
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 2.4 }}
                className="hex-clip relative size-24 bg-gradient-to-br from-gold via-hex to-shimmer sm:size-32"
              />
            </div>
          )}
        </div>
        <div className="p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-xl tracking-wide">Enter the undercity</DialogTitle>
            <DialogDescription>
              Watch the official trailers, then binge both seasons on Netflix.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <a
              href={TRAILER_URL}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 flex-1 rounded-full")}
            >
              Trailers on YouTube <ExternalLink className="size-4" />
            </a>
            <a
              href={NETFLIX_URL}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ size: "lg" }), "h-11 flex-1 rounded-full")}
            >
              Stream on Netflix
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
