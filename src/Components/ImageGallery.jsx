import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

/**
 * Slider for a product's photo gallery — arrows + dots, swipe-free but
 * fully clickable. Falls back gracefully if an image fails to load.
 *
 * Props:
 *  - images: array of image URLs (images[0] is the cover photo)
 *  - alt: base alt text (usually the product name)
 *  - fallbackSrc: shown if an image errors out
 */
export default function ImageGallery({ images, alt, fallbackSrc }) {
  const [index, setIndex] = useState(0);
  const slides = images && images.length > 0 ? images : [fallbackSrc];

  function go(delta) {
    setIndex((i) => (i + delta + slides.length) % slides.length);
  }

  return (
    <div className="relative w-full h-64 md:h-full overflow-hidden">
      <img
        key={index}
        src={slides[index]}
        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = fallbackSrc; }}
        alt={`${alt} — photo ${index + 1} of ${slides.length}`}
        className="w-full h-full object-cover"
      />

      {slides.length > 1 && (
        <>
          <button
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition hover:scale-105"
            style={{ background: "rgba(11,10,9,0.65)" }}
          >
            <ChevronLeft className="w-4 h-4 text-stone-100" />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition hover:scale-105"
            style={{ background: "rgba(11,10,9,0.65)" }}
          >
            <ChevronRight className="w-4 h-4 text-stone-100" />
          </button>

          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to photo ${i + 1}`}
                className="w-1.5 h-1.5 rounded-full transition"
                style={{ background: i === index ? "var(--gold)" : "rgba(255,255,255,0.45)" }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
