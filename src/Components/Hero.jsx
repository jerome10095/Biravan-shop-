import { placeholder } from "../data";

/**
 * Full-bleed hero with a looping video background.
 * Drop your own clip into /public/videos/hero-loop.mp4 — it will play
 * automatically once present. Until then, the photo behind it is shown.
 */
export default function Hero() {
  return (
    <section id="home" className="relative h-[640px] sm:h-[760px] overflow-hidden flex items-end justify-center">
      {/* Fallback image, always present underneath */}
      <img
        src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=1600&q=80&auto=format&fit=crop"
        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholder("B"); }}
        alt="BIRAVAN Line Boutique"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Drop your own loop here: /public/videos/hero-loop.mp4 — plays on top of the fallback image once added */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => { e.currentTarget.style.display = "none"; }}
      >
        <source src="/videos/hero-loop.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(11,10,9,0.15) 0%, rgba(11,10,9,0.35) 45%, rgba(11,10,9,0.92) 100%)" }} />

      <div className="relative z-10 text-center px-6 pb-16 sm:pb-20 max-w-2xl animate-fadeUp">
        <p className="text-xs tracking-[0.35em] uppercase mb-4" style={{ color: "var(--gold-bright)" }}>Gisenyi · Rwanda · Menswear</p>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-stone-50 mb-6">
          Tailored for the <span className="italic" style={{ color: "var(--gold-bright)" }}>Modern Man</span>
        </h1>
        <div className="flex items-center justify-center gap-10 text-base sm:text-lg font-medium">
          <a href="#shop" className="underline underline-offset-8 hover:text-amber-300 transition" style={{ color: "var(--ivory)" }}>Shop Now</a>
          <a href="#location" className="underline underline-offset-8 hover:text-amber-300 transition" style={{ color: "var(--ivory)" }}>Visit Us</a>
        </div>
      </div>
    </section>
  );
}
