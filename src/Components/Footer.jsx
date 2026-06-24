import { SHOP } from "../data";
import React from "react";

export default function Footer() {
  return (
    <footer className="border-t mt-10" style={{ borderColor: "rgba(212,175,55,0.15)", background: "var(--ink-soft)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="font-display text-xl mb-3" style={{ color: "var(--gold-bright)" }}>{SHOP.name}</div>
          <p className="text-sm text-stone-500 leading-relaxed mb-4">Premium menswear crafted with intention, based in Gisenyi, Rwanda.</p>
          <div className="flex gap-3">
            <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full border border-white/10 hover:border-amber-400/50 flex items-center justify-center text-[11px] font-semibold text-stone-400">IG</a>
            <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full border border-white/10 hover:border-amber-400/50 flex items-center justify-center text-[11px] font-semibold text-stone-400">FB</a>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-stone-200 mb-4">Quick Links</p>
          <div className="flex flex-col gap-2 text-sm text-stone-500">
            <a href="#home" className="hover:text-amber-300">Home</a>
            <a href="#shop" className="hover:text-amber-300">Shop</a>
            <a href="#location" className="hover:text-amber-300">Visit Us</a>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-stone-200 mb-4">Categories</p>
          <div className="flex flex-col gap-2 text-sm text-stone-500">
            <span>Clothing</span><span>Shoes</span><span>Accessories</span>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-stone-200 mb-4">Contact</p>
          <div className="flex flex-col gap-2 text-sm text-stone-500">
            <span>{SHOP.address}</span>
            <span>{SHOP.phone}</span>
            <span>{SHOP.email}</span>
          </div>
        </div>
      </div>
      <div className="border-t py-6 text-center text-xs text-stone-600" style={{ borderColor: "rgba(212,175,55,0.1)" }}>
        © {new Date().getFullYear()} BIRAVAN Line Boutique — Gisenyi, Rwanda
      </div>
    </footer>
  );
}
