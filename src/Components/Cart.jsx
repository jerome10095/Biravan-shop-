import { ShoppingBag, X, Minus, Plus, Trash2 } from "lucide-react";
import { formatRWF, placeholder } from "../data";
import { GoldButton } from "./Buttons";

/**
 * Props:
 *  - onClose: () => void
 *  - cart: array of cart line items
 *  - onUpdateQty: (key, delta) => void
 *  - onRemove: (key) => void
 *  - subtotal, shippingFee, grandTotal: numbers
 *  - onCheckout: () => void
 */
export default function Cart({ onClose, cart, onUpdateQty, onRemove, subtotal, shippingFee, grandTotal, onCheckout }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full sm:w-[420px] h-full flex flex-col animate-fadeUp" style={{ background: "var(--ink-soft)" }}>
        <div className="flex items-center justify-between px-6 h-20 border-b" style={{ borderColor: "rgba(212,175,55,0.15)" }}>
          <h3 className="font-display text-xl text-stone-50">Your Bag</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-stone-400" /></button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
            <ShoppingBag className="w-12 h-12 mb-4" style={{ color: "rgba(212,175,55,0.3)" }} />
            <p className="text-stone-400 mb-6">Your bag is empty.</p>
            <GoldButton onClick={onClose}>Browse the Collection</GoldButton>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              {cart.map((item) => (
                <div key={item.key} className="flex gap-4">
                  <img
                    src={item.img}
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholder("B"); }}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between gap-2">
                      <p className="text-sm font-medium text-stone-100">{item.name}</p>
                      <button onClick={() => onRemove(item.key)}><Trash2 className="w-4 h-4 text-stone-500 hover:text-red-400" /></button>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">{item.color} · {item.size}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 border rounded-full px-1" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
                        <button onClick={() => onUpdateQty(item.key, -1)} className="p-1"><Minus className="w-3 h-3 text-stone-400" /></button>
                        <span className="text-xs w-4 text-center text-stone-200">{item.qty}</span>
                        <button onClick={() => onUpdateQty(item.key, 1)} className="p-1"><Plus className="w-3 h-3 text-stone-400" /></button>
                      </div>
                      <p className="text-sm font-semibold" style={{ color: "var(--gold)" }}>{formatRWF(item.price * item.qty)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-6 border-t space-y-2" style={{ borderColor: "rgba(212,175,55,0.15)" }}>
              <div className="flex justify-between text-sm text-stone-400"><span>Subtotal</span><span>{formatRWF(subtotal)}</span></div>
              <div className="flex justify-between text-sm text-stone-400">
                <span>Shipping</span><span>{shippingFee === 0 ? "Free" : formatRWF(shippingFee)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-stone-50 pt-2"><span>Total</span><span style={{ color: "var(--gold)" }}>{formatRWF(grandTotal)}</span></div>
              <GoldButton className="w-full mt-4" onClick={onCheckout}>Checkout</GoldButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
