import { ChevronLeft, Smartphone, CreditCard, Truck } from "lucide-react";
import { formatRWF } from "../data";
import { GoldButton } from "./Buttons";

const PAYMENT_METHODS = [
  { id: "momo", label: "MTN Mobile Money", icon: Smartphone },
  { id: "airtel", label: "Airtel Money", icon: Smartphone },
  { id: "card", label: "Debit / Credit Card", icon: CreditCard },
  { id: "cod", label: "Cash on Delivery", icon: Truck },
];

/**
 * Props:
 *  - onClose: () => void
 *  - cart: array of cart line items
 *  - shipping, setShipping: shipping form state { fullName, phone, address, sector, notes }
 *  - paymentMethod, setPaymentMethod
 *  - formError: string
 *  - subtotal, shippingFee, grandTotal: numbers
 *  - onPlaceOrder: () => void
 */
export default function Checkout({
  onClose,
  cart,
  shipping,
  setShipping,
  paymentMethod,
  setPaymentMethod,
  formError,
  subtotal,
  shippingFee,
  grandTotal,
  onPlaceOrder,
}) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: "var(--ink)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <button onClick={onClose} className="flex items-center gap-2 text-stone-400 hover:text-stone-200 mb-8">
          <ChevronLeft className="w-4 h-4" /> Back to shop
        </button>
        <h2 className="font-display text-3xl text-stone-50 mb-8">Checkout</h2>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h3 className="text-sm tracking-widest uppercase mb-4" style={{ color: "var(--gold)" }}>Shipping Details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <input value={shipping.fullName} onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })} placeholder="Full Name" className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-400/50" />
                <input value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} placeholder="Phone Number" className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-400/50" />
                <input value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} placeholder="Street / Cell / Village" className="sm:col-span-2 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-400/50" />
                <input value={shipping.sector} onChange={(e) => setShipping({ ...shipping, sector: e.target.value })} placeholder="Sector / District (e.g. Gisenyi, Rubavu)" className="sm:col-span-2 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-400/50" />
                <textarea value={shipping.notes} onChange={(e) => setShipping({ ...shipping, notes: e.target.value })} placeholder="Delivery notes (optional)" rows={2} className="sm:col-span-2 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-400/50" />
              </div>
            </div>

            <div>
              <h3 className="text-sm tracking-widest uppercase mb-4" style={{ color: "var(--gold)" }}>Payment Method</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setPaymentMethod(id)}
                    className="flex items-center gap-3 rounded-lg border px-4 py-3 text-sm text-left transition"
                    style={paymentMethod === id ? { borderColor: "var(--gold)", background: "rgba(212,175,55,0.08)", color: "var(--gold-bright)" } : { borderColor: "rgba(255,255,255,0.12)", color: "#cbc6bd" }}
                  >
                    <Icon className="w-4 h-4" /> {label}
                  </button>
                ))}
              </div>
              {(paymentMethod === "momo" || paymentMethod === "airtel") && (
                <p className="text-xs text-stone-500 mt-3">You'll receive a prompt on {shipping.phone || "your phone"} to confirm payment once your order is placed.</p>
              )}
            </div>

            {formError && <p className="text-sm text-red-400">{formError}</p>}
          </div>

          <div className="rounded-2xl border p-6 h-fit" style={{ borderColor: "rgba(212,175,55,0.2)", background: "var(--ink-soft)" }}>
            <h3 className="font-display text-lg text-stone-50 mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.key} className="flex justify-between text-sm text-stone-400">
                  <span className="pr-2">{item.name} <span className="text-stone-600">×{item.qty}</span></span>
                  <span className="flex-shrink-0">{formatRWF(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 border-t pt-4" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
              <div className="flex justify-between text-sm text-stone-400"><span>Subtotal</span><span>{formatRWF(subtotal)}</span></div>
              <div className="flex justify-between text-sm text-stone-400"><span>Shipping</span><span>{shippingFee === 0 ? "Free" : formatRWF(shippingFee)}</span></div>
              <div className="flex justify-between text-base font-semibold text-stone-50 pt-2"><span>Total</span><span style={{ color: "var(--gold)" }}>{formatRWF(grandTotal)}</span></div>
            </div>
            <GoldButton className="w-full mt-6" onClick={onPlaceOrder} disabled={cart.length === 0}>Place Order</GoldButton>
          </div>
        </div>
      </div>
    </div>
  );
}
