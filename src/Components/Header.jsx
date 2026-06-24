import React from "react";
import { ShoppingBag, X, Menu, User } from "lucide-react";
import { SHOP } from "../data";

/**
 * Top announcement bar + sticky navigation bar.
 *
 * Props:
 *  - totalQty: number of items in the cart (shown as a badge)
 *  - mobileMenuOpen, setMobileMenuOpen: mobile nav drawer state
 *  - showAnnouncement, setShowAnnouncement: dismissible top bar state
 *  - onOpenCart: () => void
 *  - onOpenSizeGuide: () => void
 */
  export default function Header({
  totalQty,
  mobileMenuOpen,
  setMobileMenuOpen,
  showAnnouncement,
  setShowAnnouncement,
  onOpenCart,
  onOpenSizeGuide,
}) {
  return (
    <>
      {/* ============================== ANNOUNCEMENT BAR ============================== */}
      {showAnnouncement && (
        <div className="relative z-50 text-center text-[11px] sm:text-xs tracking-wide py-2.5 px-10" style={{ backgroundColor: "#070605", color: "#e7e2d6" }}>
          FREE DELIVERY IN GISENYI ON ORDERS OVER <strong style={{ color: "var(--gold-bright)" }}>100,000 RWF</strong> · MOBILE MONEY ACCEPTED
          <button
            onClick={() => setShowAnnouncement(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-70"
            aria-label="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ============================== MAIN NAV ============================== */}
      <header className="sticky top-0 z-40 backdrop-blur-md border-b" style={{ background: "rgba(11,10,9,0.85)", borderColor: "rgba(212,175,55,0.15)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full border flex items-center justify-center font-display text-lg" style={{ borderColor: "var(--gold)", color: "var(--gold)" }}>
              BV L
            </div>
            <div className="leading-tight hidden sm:block">
              <div className="font-display text-xl sm:text-2xl tracking-wide" style={{ color: "var(--gold-bright)" }}>{SHOP.name}</div>
              <div className="text-[10px] sm:text-xs tracking-[0.3em] text-stone-400">{SHOP.sub}</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-9 text-[13px] font-semibold tracking-[0.12em] uppercase text-stone-300">
            <a href="#home" className="hover:text-amber-300 transition">Home</a>
            <a href="#shop" className="hover:text-amber-300 transition">Shop</a>
            <a href="#location" className="hover:text-amber-300 transition">Visit Us</a>
          </nav>

          <div className="flex items-center gap-1 sm:gap-3">
            <button
              onClick={onOpenSizeGuide}
              className="hidden sm:inline-flex p-2 rounded-full hover:bg-white/5 transition"
              aria-label="Size Guide"
              title="Size Guide"
            >
              <User className="w-5 h-5 text-stone-300" />
            </button>
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-full hover:bg-white/5 transition"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: "var(--gold)" }} />
              {totalQty > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "var(--gold)", color: "#15130F" }}>
                  {totalQty}
                </span>
              )}
            </button>
            <button
              className="hidden sm:flex w-9 h-9 rounded-full border items-center justify-center text-[11px] font-semibold"
              style={{ borderColor: "rgba(255,255,255,0.2)", color: "#cbc6bd" }}
              title="Language"
            >
              EN
            </button>
            <button className="md:hidden p-2 rounded-full hover:bg-white/5" onClick={() => setMobileMenuOpen((v) => !v)} aria-label="Menu">
              {mobileMenuOpen ? <X className="w-6 h-6 text-stone-200" /> : <Menu className="w-6 h-6 text-stone-200" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t px-6 py-4 flex flex-col gap-4 text-stone-200 text-sm uppercase tracking-wide" style={{ borderColor: "rgba(212,175,55,0.15)", background: "var(--ink-soft)" }}>
            <a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#shop" onClick={() => setMobileMenuOpen(false)}>Shop</a>
            <a href="#location" onClick={() => setMobileMenuOpen(false)}>Visit Us</a>
          </div>
        )}
      </header>
    </>
  );
}

