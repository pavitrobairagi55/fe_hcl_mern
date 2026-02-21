import { useToasts } from "../hooks/useToast";
import { initials } from "../utils";

// ── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ dark = false }) {
  return <span className={`spinner ${dark ? "spinner-dark" : ""}`} />;
}

// ── Stars (display) ──────────────────────────────────────────────────────────
export function Stars({ value, size = 16 }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`star ${s <= value ? "filled" : ""}`} style={{ fontSize: size }}>
          ★
        </span>
      ))}
    </div>
  );
}

// ── Star Rating Input ─────────────────────────────────────────────────────────
export function StarInput({ value, onChange }) {
  return (
    <div className="stars" style={{ gap: 6 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "2px",
            fontSize: 28,
            lineHeight: 1,
            color: s <= value ? "#f59e0b" : "#d1d5db",
            transition: "color 0.1s",
          }}
          aria-label={`${s} star`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────────
export function Avatar({ name, size = 36 }) {
  return (
    <div
      className="avatar"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials(name)}
    </div>
  );
}

// ── Toast Container ───────────────────────────────────────────────────────────
export function ToastContainer() {
  const toasts = useToasts();
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ── Skeleton rows ─────────────────────────────────────────────────────────────
export function SkeletonCard() {
  return (
    <div className="card" style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div className="skeleton" style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div className="skeleton" style={{ height: 13, width: "55%" }} />
        <div className="skeleton" style={{ height: 11, width: "35%" }} />
      </div>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
export function EmptyState({ icon = "—", title, message }) {
  return (
    <div className="empty">
      <div style={{ fontSize: 32 }}>{icon}</div>
      <h3 style={{ marginTop: 12, fontSize: 15, fontWeight: 600, color: "#374151" }}>{title}</h3>
      <p>{message}</p>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export function Modal({ title, subtitle, onClose, children, actions }) {
  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h3>{title}</h3>
        {subtitle && <p className="modal-sub">{subtitle}</p>}
        {children}
        {actions && <div className="modal-actions">{actions}</div>}
      </div>
    </div>
  );
}

// ── Form Field ────────────────────────────────────────────────────────────────
export function Field({ label, error, children }) {
  return (
    <div className="form-group">
      {label && <label>{label}</label>}
      {children}
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}