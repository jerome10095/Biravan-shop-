import { CheckCircle2 } from "lucide-react";
import { formatRWF } from "../data";
import { GoldButton } from "./Buttons";

/** Props: order: { number, total, name, method }, onClose: () => void */
export default function OrderConfirmation({ order, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80">
      <div className="max-w-md w-full rounded-2xl border p-8 text-center animate-fadeUp" style={{ borderColor: "rgba(212,175,55,0.3)", background: "var(--ink-soft)" }}>
        <CheckCircle2 className="w-14 h-14 mx-auto mb-4" style={{ color: "var(--gold)" }} />
        <h3 className="font-display text-2xl text-stone-50 mb-2">Order Confirmed</h3>
        <p className="text-stone-400 text-sm mb-6">
          Thank you, {order.name}. Your order <strong style={{ color: "var(--gold-bright)" }}>#{order.number}</strong> has
          been received and our team will be in touch shortly to confirm delivery.
        </p>
        <div className="rounded-lg p-4 mb-6 text-sm text-stone-300 text-left space-y-1" style={{ background: "rgba(255,255,255,0.03)" }}>
          <div className="flex justify-between"><span className="text-stone-500">Total Paid</span><span>{formatRWF(order.total)}</span></div>
          <div className="flex justify-between"><span className="text-stone-500">Payment</span><span className="capitalize">{order.method}</span></div>
        </div>
        <GoldButton className="w-full" onClick={onClose}>Continue Shopping</GoldButton>
      </div>
    </div>
  );
}
