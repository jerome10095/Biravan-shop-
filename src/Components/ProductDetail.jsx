import { useState } from "react";
import { X, Minus, Plus, Truck } from "lucide-react";
import { SIZE_SETS, formatRWF, placeholder } from "../data";
import { GoldButton } from "./Buttons";
import React from "react";

/**
 * Props:
 *  - product: the product being viewed
 *  - onClose: () => void
 *  - onAdd: (color, size, qty) => void
 */
export default function ProductDetail({ product, onClose, onAdd }) {
  const sizes = SIZE_SETS[product.category];
  const [color, setColor] = useState(product.colors[0].name);
  const [size, setSize] = useState(sizes.length === 1 ? sizes[0] : "");
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/75">
      <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border grid md:grid-cols-2" style={{ borderColor: "rgba(212,175,55,0.25)", background: "var(--ink-soft)" }}>
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(11,10,9,0.7)" }}>
          <X className="w-4 h-4 text-stone-200" />
        </button>
        <img
          src={product.img}
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholder(product.name[0]); }}
          alt={product.name}
          className="w-full h-64 md:h-full object-cover"
        />
        <div className="p-6 sm:p-8">
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "var(--gold)" }}>{product.category}</p>
          <h3 className="font-display text-2xl text-stone-50 mb-2">{product.name}</h3>
          <p className="text-xl font-semibold mb-6" style={{ color: "var(--gold-bright)" }}>{formatRWF(product.price)}</p>

          <div className="mb-5">
            <p className="text-sm text-stone-400 mb-2">Color — {color}</p>
            <div className="flex gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  className="w-8 h-8 rounded-full border-2"
                  style={{ backgroundColor: c.hex, borderColor: color === c.name ? "var(--gold)" : "transparent" }}
                  aria-label={c.name}
                />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-stone-400 mb-2">Size</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className="px-3 py-2 rounded-lg border text-sm"
                  style={size === s ? { borderColor: "var(--gold)", color: "var(--gold-bright)", background: "rgba(212,175,55,0.08)" } : { borderColor: "rgba(255,255,255,0.15)", color: "#cbc6bd" }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <p className="text-sm text-stone-400">Qty</p>
            <div className="flex items-center gap-3 border rounded-full px-3 py-1" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus className="w-3.5 h-3.5 text-stone-400" /></button>
              <span className="text-sm w-4 text-center text-stone-200">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)}><Plus className="w-3.5 h-3.5 text-stone-400" /></button>
            </div>
          </div>

          {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

          <GoldButton
            className="w-full"
            onClick={() => {
              if (!size) { setError("Please select a size."); return; }
              onAdd(color, size, qty);
            }}
          >
            Add to Bag
          </GoldButton>

          <p className="flex items-center gap-2 text-xs text-stone-500 mt-4">
            <Truck className="w-3.5 h-3.5" /> Free delivery within Gisenyi on orders over 100,000 RWF
          </p>
        </div>
      </div>
    </div>
  );
}
