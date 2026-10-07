import { Navbar } from "@/components/arcane/navbar";
import { Hero } from "@/components/arcane/hero";
import { Marquee } from "@/components/arcane/marquee";
import { Cities } from "@/components/arcane/cities";
import { Characters } from "@/components/arcane/characters";
import { Seasons } from "@/components/arcane/seasons";
import { Legacy } from "@/components/arcane/legacy";
import { CallToAction, Footer } from "@/components/arcane/cta-footer";
import { CursorGlow } from "@/components/arcane/cursor-glow";

export default function Home() {
  return (
    <>
      <CursorGlow />
      <Navbar />
      <main className="relative">
        <Hero />
        <Marquee />
        <Cities />
        <Characters />
        <Seasons />
        <Legacy />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
