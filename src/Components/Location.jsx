import { MapPin, Phone, Mail, Clock, Navigation, Loader2 } from "lucide-react";
import { SHOP } from "../data";
import { GoldButton, OutlineButton, Divider } from "./Buttons";
import React from "react";

/**
 * Props:
 *  - geo: { status: "idle"|"loading"|"success"|"error", distance?, message? }
 *  - onFindMyLocation: () => void
 *  - directionsUrl, mapEmbedUrl: strings
 */
export default function Location({ geo, onFindMyLocation, directionsUrl, mapEmbedUrl }) {
  return (
    <section id="location" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <Divider />
      <div className="grid lg:grid-cols-2 gap-12 items-start mt-8">
        <div>
          <p className="text-xs tracking-[0.35em] uppercase mb-2" style={{ color: "var(--gold)" }}>Find Us</p>
          <h2 className="font-display text-3xl sm:text-4xl text-stone-50 mb-6">Visit Our Boutique</h2>
          <p className="text-stone-400 leading-relaxed mb-8 max-w-md">
            Your confidence and satisfaction are our highest priorities
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--gold)" }} />
              <p className="text-stone-300 text-sm">{SHOP.address}</p>
            </div>
            <div className="flex gap-3">
              <Phone className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--gold)" }} />
              <a href={`tel:${SHOP.phone}`} className="text-stone-300 text-sm hover:text-amber-300">{SHOP.phone}</a>
            </div>
            <div className="flex gap-3">
              <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--gold)" }} />
              <a href={`mailto:${SHOP.email}`} className="text-stone-300 text-sm hover:text-amber-300">{SHOP.email}</a>
            </div>
            <div className="flex gap-3">
              <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--gold)" }} />
              <p className="text-stone-300 text-sm">Mon – Sat: 9:00 – 19:00 &nbsp;·&nbsp; Sun: 12:00 – 17:00</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
              <GoldButton><Navigation className="w-4 h-4" /> Get Directions</GoldButton>
            </a>
            <OutlineButton onClick={onFindMyLocation} disabled={geo.status === "loading"}>
              {geo.status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
              Find My Location
            </OutlineButton>
          </div>

          {geo.status === "success" && (
            <div className="rounded-xl border p-4 text-sm" style={{ borderColor: "rgba(212,175,55,0.3)", background: "rgba(212,175,55,0.06)", color: "var(--gold-bright)" }}>
              You're about <strong>{geo.distance.toFixed(1)} km</strong> from BIRAVAN Line Boutique
              (roughly {Math.max(1, Math.round((geo.distance / 35) * 60))} min by car). Estimate only —
              actual travel time may vary.
            </div>
          )}
          {geo.status === "error" && (
            <div className="rounded-xl border p-4 text-sm border-red-500/30 bg-red-500/5 text-red-300">{geo.message}</div>
          )}
        </div>

        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "rgba(212,175,55,0.25)" }}>
          <iframe
            title="BIRAVAN Line Boutique location"
            src={mapEmbedUrl}
            className="w-full h-[380px] sm:h-[460px] border-0"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
