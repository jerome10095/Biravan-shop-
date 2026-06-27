import { Heart } from "lucide-react";
import { formatRWF, placeholder } from "../data";
import React from "react";

/**
 * Props:
 *  - product: the product object
 *  - isWished: boolean — whether it's in the wishlist
 *  - onToggleWish: () => void
 *  - onOpen: () => void — opens the product detail overlay
 */
export default function ProductCard({ product, isWished, onToggleWish, onOpen }) {
  return (
    <div
      className="group rounded-xl overflow-hidden border transition cursor-pointer"
      style={{ borderColor: "rgba(255,255,255,0.07)", background: "var(--ink-card)" }}
      onClick={onOpen}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={product.images[0]}
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholder(product.name[0]); }}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        {product.effectiveTag && (
          <span
            className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full"
            style={product.effectiveTag === "Trending" ? { background: "var(--gold)", color: "#15130F" } : { background: "rgba(11,10,9,0.8)", color: "var(--gold-bright)", border: "1px solid var(--gold)" }}
          >
            {product.effectiveTag}
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full" style={{ background: "rgba(11,10,9,0.85)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.5)" }}>
            Out of Stock
          </span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleWish(); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "rgba(11,10,9,0.7)" }}
          aria-label="Toggle wishlist"
        >
          <Heart className="w-4 h-4" style={isWished ? { fill: "var(--gold)", color: "var(--gold)" } : { color: "#fff" }} />
        </button>
      </div>
      <div className="p-4">
        <p className="font-display text-stone-100 text-sm sm:text-base leading-snug">{product.name}</p>
        <div className="flex items-center justify-between mt-2">
          <p className="font-semibold text-sm" style={{ color: "var(--gold)" }}>{formatRWF(product.price)}</p>
          <div className="flex -space-x-1">
            {product.colors.slice(0, 3).map((c) => (
              <span key={c.name} className="w-3.5 h-3.5 rounded-full border border-black/40" style={{ backgroundColor: c.hex }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
