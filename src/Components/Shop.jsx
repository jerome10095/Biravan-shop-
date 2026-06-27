import { useMemo, useState } from "react";
import { Search, X, SlidersHorizontal, ChevronDown } from "lucide-react";
import { CATEGORIES } from "../data";
import ProductCard from "./ProductCard";
import React from "react";

const SORT_OPTIONS = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A–Z" },
];

export default function Shop({ products, productsReady, activeCategory, setActiveCategory, search, setSearch, wishlist, onToggleWish, onOpenProduct }) {
  const [sort, setSort] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const prices = products.map((p) => p.price);
  const globalMin = prices.length ? Math.min(...prices) : 0;
  const globalMax = prices.length ? Math.max(...prices) : 1000000;
  const [priceRange, setPriceRange] = useState([globalMin, globalMax]);

  const filteredProducts = useMemo(() => {
    let list = products;
    if (activeCategory === "Trending") list = list.filter((p) => p.effectiveTag === "Trending");
    else if (activeCategory !== "All") list = list.filter((p) => p.category === activeCategory);
    if (search.trim()) list = list.filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase()));
    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "name-asc") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, activeCategory, search, sort, priceRange]);

  // Count per category tab for the badges
  const counts = useMemo(() => {
    const c = {};
    CATEGORIES.forEach((cat) => {
      if (cat === "Trending") c[cat] = products.filter((p) => p.effectiveTag === "Trending").length;
      else if (cat === "All") c[cat] = products.length;
      else c[cat] = products.filter((p) => p.category === cat).length;
    });
    return c;
  }, [products]);

  return (
    <section id="shop" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
        <div>
          <p className="text-xs tracking-[0.35em] uppercase mb-2" style={{ color: "var(--gold)" }}>The Collection</p>
          <h2 className="font-display text-3xl sm:text-4xl text-stone-50">Match Your Style</h2>
          <p className="text-stone-500 text-sm mt-1">{filteredProducts.length} piece{filteredProducts.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clothing, shoes..."
              className="w-full rounded-full bg-white/5 border border-white/10 pl-10 pr-10 py-2.5 text-sm text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-400/50"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="relative flex-shrink-0">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 rounded-full text-sm text-stone-200 focus:outline-none focus:border-amber-400/50 cursor-pointer"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} style={{ background: "#15130F" }}>{o.label}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none" />
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="flex-shrink-0 flex items-center gap-2 px-3 py-2.5 rounded-full text-sm transition"
            style={showFilters
              ? { background: "rgba(212,175,55,0.12)", color: "var(--gold)", border: "1px solid rgba(212,175,55,0.3)" }
              : { background: "rgba(255,255,255,0.05)", color: "#cbc6bd", border: "1px solid rgba(255,255,255,0.1)" }
            }
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Price range filter */}
      {showFilters && (
        <div className="mb-8 p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-stone-300 font-medium">Price Range</p>
            <button
              onClick={() => setPriceRange([globalMin, globalMax])}
              className="text-xs hover:opacity-80"
              style={{ color: "var(--gold)" }}
            >
              Reset
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-stone-500 w-28">{(priceRange[0] / 1000).toFixed(0)}K RWF</span>
            <input
              type="range"
              min={globalMin}
              max={globalMax}
              step={1000}
              value={priceRange[0]}
              onChange={(e) => setPriceRange(([, max]) => [Math.min(Number(e.target.value), max - 1000), max])}
              className="flex-1 accent-amber-400"
            />
            <input
              type="range"
              min={globalMin}
              max={globalMax}
              step={1000}
              value={priceRange[1]}
              onChange={(e) => setPriceRange(([min]) => [min, Math.max(Number(e.target.value), min + 1000)])}
              className="flex-1 accent-amber-400"
            />
            <span className="text-xs text-stone-500 w-28 text-right">{(priceRange[1] / 1000).toFixed(0)}K RWF</span>
          </div>
        </div>
      )}

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition"
              style={
                active
                  ? { background: "var(--gold)", color: "#15130F", borderColor: "var(--gold)" }
                  : { borderColor: "rgba(255,255,255,0.15)", color: "#cbc6bd" }
              }
            >
              {cat}
              <span
                className="text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center"
                style={
                  active
                    ? { background: "rgba(0,0,0,0.2)", color: "#15130F" }
                    : { background: "rgba(255,255,255,0.08)", color: "#9c9590" }
                }
              >
                {counts[cat] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Product grid — 2 cols mobile → 3 tablet → 4 desktop → 5 XL */}
      {!productsReady ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden animate-pulse" style={{ background: "var(--ink-card)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="aspect-[4/5] bg-white/5" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-white/5 rounded w-3/4" />
                <div className="h-3 bg-white/5 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 text-stone-500">
          No pieces match your search just yet — try another term or category.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
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
