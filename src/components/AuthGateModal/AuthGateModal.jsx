import { X, Sparkles, LogIn, UserPlus } from "lucide-react";

export default function AuthGateModal({ onClose, onLogin, onRegister }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card"
        style={{
          maxWidth: "400px",
          width: "90%",
          textAlign: "center",
          position: "relative",
          animation: "fadeIn 0.3s ease-out",
        }}
      >
        <button
          onClick={onClose}
          className="icon-btn"
          style={{ position: "absolute", top: 10, right: 10 }}
        >
          <X size={20} />
        </button>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          <Sparkles size={40} color="var(--btn-primary)" />
        </div>

        <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
          Join our whimsical community!
        </h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
          If you want to access all the magic of this nook, you must register.
        </p>

        <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
          <button
            onClick={onLogin}
            className="btn-primary"
            style={{ justifyContent: "center" }}
          >
            <LogIn size={18} /> Log In
          </button>
          <button
            onClick={onRegister}
            className="btn-primary"
            style={{
              backgroundColor: "var(--bg-color)",
              color: "var(--text-main)",
              border: "2px solid var(--divider-color)",
              justifyContent: "center",
            }}
          >
            <UserPlus size={18} /> Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
