import { useMemo } from "react";
import { Search } from "lucide-react";
import { CATEGORIES } from "../data";
import ProductCard from "./ProductCard";
import React from "react";

/**
 * Props:
 *  - products: product array (from localStorage or data.js fallback)
 *  - activeCategory, setActiveCategory
 *  - search, setSearch
 *  - wishlist: Set of product ids
 *  - onToggleWish: (id) => void
 *  - onOpenProduct: (product) => void
 */
export default function Shop({ products, activeCategory, setActiveCategory, search, setSearch, wishlist, onToggleWish, onOpenProduct }) {
  const filteredProducts = useMemo(() => {
    let list = products;
    if (activeCategory === "Trending") list = list.filter((p) => p.tag === "Trending");
    else if (activeCategory !== "All") list = list.filter((p) => p.category === activeCategory);
    if (search.trim()) list = list.filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase()));
    return list;
  }, [activeCategory, search]);

  return (
    <section id="shop" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
        <div>
          <p className="text-xs tracking-[0.35em] uppercase mb-2" style={{ color: "var(--gold)" }}>The Collection</p>
          <h2 className="font-display text-3xl sm:text-4xl text-stone-50">Match Your Style</h2>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clothing, shoes..."
            className="w-full rounded-full bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-400/50"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-10">
        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-5 py-2 rounded-full text-sm font-medium border transition"
              style={
                active
                  ? { background: "var(--gold)", color: "#15130F", borderColor: "var(--gold)" }
                  : { borderColor: "rgba(255,255,255,0.15)", color: "#cbc6bd" }
              }
            >
              {cat}
            </button>
          );
        })}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 text-stone-500">No pieces match your search just yet — try another term or category.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              isWished={wishlist.has(p.id)}
              onToggleWish={() => onToggleWish(p.id)}
              onOpen={() => onOpenProduct(p)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
