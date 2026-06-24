/**
 * Small reusable UI pieces shared by several components:
 * GoldButton, OutlineButton, and the stitched gold Divider.
 */

export function GoldButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-sm tracking-wide transition disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
      style={{ background: "linear-gradient(135deg, var(--gold-bright), var(--gold-deep))", color: "#15130F" }}
    >
      {children}
    </button>
  );
}

export function OutlineButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-sm tracking-wide border transition hover:bg-white/5 ${className}`}
      style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
    >
      {children}
    </button>
  );
}

export function Divider() {
  return (
    <div
      className="h-px w-full my-8 opacity-40"
      style={{
        backgroundImage: "repeating-linear-gradient(90deg, var(--gold) 0 8px, transparent 8px 16px)",
      }}
    />
  );
}
