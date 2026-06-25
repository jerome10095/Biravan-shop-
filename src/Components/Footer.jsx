import { MessageCircle, Music2 } from "lucide-react";
import { SHOP, SOCIAL_LINKS, BRANDS, getWhatsappUrl } from "../data";
import React from "react";

/* ---- small inline icons for platforms lucide-react doesn't ship (kept generic, not exact brand artwork) ---- */

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="12" cy="12" r="10" />
      <text x="12" y="16.3" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor" stroke="none">f</text>
    </svg>
  );
}

function SnapchatIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3a6 6 0 0 0-6 6v7.3c0 .4.45.6.78.36l1-.74a1 1 0 0 1 1.18 0l.98.74a1 1 0 0 0 1.18 0l.98-.74a1 1 0 0 1 1.18 0l.98.74a1 1 0 0 0 1.18 0l1-.74c.33-.24.78-.04.78.36V9a6 6 0 0 0-6-6z" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...props}>
      <line x1="5" y1="5" x2="19" y2="19" />
      <line x1="19" y1="5" x2="5" y2="19" />
    </svg>
  );
}

/* ---- the row of social icons, each pulling its href from SOCIAL_LINKS in data.js ---- */

function SocialRow() {
  const links = [
    { id: "instagram", label: "Instagram", url: SOCIAL_LINKS.instagram, Icon: InstagramIcon },
    { id: "whatsapp", label: "WhatsApp", url: getWhatsappUrl(), Icon: MessageCircle },
    { id: "facebook", label: "Facebook", url: SOCIAL_LINKS.facebook, Icon: FacebookIcon },
    { id: "tiktok", label: "TikTok", url: SOCIAL_LINKS.tiktok, Icon: Music2 },
    { id: "snapchat", label: "Snapchat", url: SOCIAL_LINKS.snapchat, Icon: SnapchatIcon },
    { id: "twitter", label: "X (Twitter)", url: SOCIAL_LINKS.twitter, Icon: XIcon },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {links.map(({ id, label, url, Icon }) => (
        <a
          key={id}
          href={url || "#"}
          target={url ? "_blank" : undefined}
          rel={url ? "noopener noreferrer" : undefined}
          aria-label={label}
          title={url ? label : `${label} — add your link in data.js (SOCIAL_LINKS)`}
          className="w-9 h-9 rounded-full border border-white/10 hover:border-amber-400/50 flex items-center justify-center text-stone-400 hover:text-amber-300 transition"
        >
          <Icon className="w-4 h-4" />
        </a>
      ))}
    </div>
  );
}

/* ---- "Brands We Carry" strip — text wordmarks by default; drop in real logo files if you have the rights to use them ---- */

function BrandStrip() {
  return (
    <div className="border-t pt-10 mt-2" style={{ borderColor: "rgba(212,175,55,0.1)" }}>
      <p className="text-center text-[11px] tracking-[0.3em] uppercase mb-6" style={{ color: "var(--gold)" }}>
        Brands We Carry
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {BRANDS.map((brand) =>
          brand.logo ? (
            <img
              key={brand.name}
              src={brand.logo}
              alt={brand.name}
              className="h-6 object-contain opacity-70 hover:opacity-100 transition"
              style={{ filter: "grayscale(1) brightness(1.8)" }}
            />
          ) : (
            <span key={brand.name} className="font-display text-sm sm:text-base tracking-wide text-stone-500 hover:text-amber-300 transition">
              {brand.name}
            </span>
          )
        )}
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="border-t mt-10" style={{ borderColor: "rgba(212,175,55,0.15)", background: "var(--ink-soft)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="font-display text-xl mb-3" style={{ color: "var(--gold-bright)" }}>{SHOP.name}</div>
          <p className="text-sm text-stone-500 leading-relaxed mb-4">Premium menswear crafted with intention, based in Gisenyi, Rwanda.</p>
          <SocialRow />
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
        <BrandStrip />
      </div>

      <div className="border-t py-6 text-center text-xs text-stone-600" style={{ borderColor: "rgba(212,175,55,0.1)" }}>
        © {new Date().getFullYear()} BIRAVAN Line Boutique — Gisenyi, Rwanda
      </div>
    </footer>
  );
}
