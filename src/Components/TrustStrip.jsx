import { Truck, Smartphone, CheckCircle2 } from "lucide-react";

const ITEMS = [
  { icon: Truck, label: "Delivery in Gisenyi" },
  { icon: Smartphone, label: "Mobile Money Accepted" },
  { icon: CheckCircle2, label: "Authentic Quality" },
];

export default function TrustStrip() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-3 gap-4 border-b" style={{ borderColor: "rgba(212,175,55,0.1)" }}>
      {ITEMS.map(({ icon: Icon, label }) => (
        <div key={label} className="text-center">
          <Icon className="w-5 h-5 mx-auto mb-2" style={{ color: "var(--gold)" }} />
          <p className="text-[11px] sm:text-xs text-stone-400 leading-tight">{label}</p>
        </div>
      ))}
    </section>
  );
}
