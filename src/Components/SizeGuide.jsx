import { useState } from "react";
import { X } from "lucide-react";

const CLOTHING_ROWS = [
  { size: "S", chest: "88–92", waist: "76–80" },
  { size: "M", chest: "93–97", waist: "81–85" },
  { size: "L", chest: "98–103", waist: "86–91" },
  { size: "XL", chest: "104–110", waist: "92–98" },
  { size: "XXL", chest: "111–117", waist: "99–105" },
];

const SHOE_ROWS = [
  { eu: "40", cm: "25.7", uk: "6.5", us: "7.5" },
  { eu: "41", cm: "26.4", uk: "7.5", us: "8.5" },
  { eu: "42", cm: "27.0", uk: "8", us: "9" },
  { eu: "43", cm: "27.7", uk: "9", us: "10" },
  { eu: "44", cm: "28.4", uk: "9.5", us: "10.5" },
  { eu: "45", cm: "29.0", uk: "10.5", us: "11.5" },
];

/** Props: onClose: () => void */
export default function SizeGuide({ onClose }) {
  const [tab, setTab] = useState("Clothing");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
      <div className="relative max-w-lg w-full rounded-2xl border p-6 sm:p-8" style={{ borderColor: "rgba(212,175,55,0.25)", background: "var(--ink-soft)" }}>
        <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.05)" }}>
          <X className="w-4 h-4 text-stone-300" />
        </button>
        <h3 className="font-display text-2xl text-stone-50 mb-1">Size Guide</h3>
        <p className="text-sm text-stone-500 mb-6">Our fit runs true to size. Between two sizes? Size up.</p>

        <div className="flex gap-2 mb-6">
          {["Clothing", "Shoes"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-2 rounded-full text-sm font-medium border"
              style={tab === t ? { background: "var(--gold)", color: "#15130F", borderColor: "var(--gold)" } : { borderColor: "rgba(255,255,255,0.15)", color: "#cbc6bd" }}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Clothing" ? (
          <table className="w-full text-sm text-stone-300">
            <thead>
              <tr className="text-left text-stone-500 uppercase text-[11px] tracking-wide border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                <th className="py-2">Size</th>
                <th className="py-2">Chest (cm)</th>
                <th className="py-2">Waist (cm)</th>
              </tr>
            </thead>
            <tbody>
              {CLOTHING_ROWS.map((r) => (
                <tr key={r.size} className="border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  <td className="py-2 font-semibold" style={{ color: "var(--gold-bright)" }}>{r.size}</td>
                  <td className="py-2">{r.chest}</td>
                  <td className="py-2">{r.waist}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-sm text-stone-300">
            <thead>
              <tr className="text-left text-stone-500 uppercase text-[11px] tracking-wide border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                <th className="py-2">EU</th>
                <th className="py-2">Foot (cm)</th>
                <th className="py-2">UK</th>
                <th className="py-2">US</th>
              </tr>
            </thead>
            <tbody>
              {SHOE_ROWS.map((r) => (
                <tr key={r.eu} className="border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  <td className="py-2 font-semibold" style={{ color: "var(--gold-bright)" }}>{r.eu}</td>
                  <td className="py-2">{r.cm}</td>
                  <td className="py-2">{r.uk}</td>
                  <td className="py-2">{r.us}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
