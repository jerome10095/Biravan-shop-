import { BookOpen, Ruler, MessageCircle, MapPin, LifeBuoy } from "lucide-react";
import { SHOP } from "../data";

/**
 * Floating icon dock on the right edge of the screen — quick shortcuts
 * to the lookbook, size guide, WhatsApp chat, location, and support.
 *
 * Props:
 *  - whatsappUrl: string
 *  - onOpenSizeGuide: () => void
 */
export default function FloatingDock({ whatsappUrl, onOpenSizeGuide }) {
  const items = [
    { icon: BookOpen, label: "Lookbook", href: "#shop" },
    { icon: Ruler, label: "Size Guide", onClick: onOpenSizeGuide },
    { icon: MessageCircle, label: "Chat on WhatsApp", href: whatsappUrl, external: true },
    { icon: MapPin, label: "Visit Us", href: "#location" },
    { icon: LifeBuoy, label: "Support", href: `mailto:${SHOP.email}` },
  ];

  return (
    <div className="fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
      {items.map(({ icon: Icon, label, href, onClick, external }) =>
        href ? (
          <a
            key={label}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            title={label}
            aria-label={label}
            className="w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md transition hover:scale-105"
            style={{ background: "rgba(11,10,9,0.7)", borderColor: "rgba(212,175,55,0.3)" }}
          >
            <Icon className="w-4 h-4" style={{ color: "var(--gold)" }} />
          </a>
        ) : (
          <button
            key={label}
            onClick={onClick}
            title={label}
            aria-label={label}
            className="w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md transition hover:scale-105"
            style={{ background: "rgba(11,10,9,0.7)", borderColor: "rgba(212,175,55,0.3)" }}
          >
            <Icon className="w-4 h-4" style={{ color: "var(--gold)" }} />
          </button>
        )
      )}
    </div>
  );
}
