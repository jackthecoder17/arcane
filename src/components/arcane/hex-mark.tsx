import { cn } from "@/lib/utils";

export function HexMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("shrink-0", className)} aria-hidden>
      <defs>
        <linearGradient id="hexmark" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0" stopColor="#e8b866" />
          <stop offset="0.55" stopColor="#4fd8ff" />
          <stop offset="1" stopColor="#ff3fa4" />
        </linearGradient>
      </defs>
      <path d="M24 2 43 13v22L24 46 5 35V13L24 2Z" stroke="url(#hexmark)" strokeWidth="2" />
      <path d="M24 11 35 17.5v13L24 37l-11-6.5v-13L24 11Z" stroke="url(#hexmark)" strokeWidth="1.5" opacity=".6" />
      <path d="M24 17 29 24 24 31 19 24 24 17Z" fill="url(#hexmark)" />
    </svg>
  );
}
