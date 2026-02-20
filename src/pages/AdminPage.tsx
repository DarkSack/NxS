import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { saveFunda } from "../../api/verify";

const ADMIN_USER = import.meta.env.VITE_ADMIN_USER ?? "admin";
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS ?? "1234";

function setCookie(name: string, value: string, days = 1) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict`;
}
function getCookie(name: string): string | null {
  const match = document.cookie.split("; ").find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}
function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

type Step = "login" | "form" | "qr";

export default function AdminPage() {
  const [step, setStep] = useState<Step>(() => getCookie("admin_token") ? "form" : "login");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [shake, setShake] = useState(false);

  const [modelo, setModelo] = useState("");
  const [material, setMaterial] = useState("");
  const [proteccion, setProteccion] = useState("");
  const [compatibilidad, setCompatibilidad] = useState("");
  const [saving, setSaving] = useState(false);

  const [qrDataURL, setQrDataURL] = useState<string | null>(null);
  const [fundaCodigo, setFundaCodigo] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [revealed, setRevealed] = useState(false);
  useEffect(() => { setTimeout(() => setRevealed(true), 80); }, []);

  function login(e: React.FormEvent) {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      const token = btoa(`${username}:${Date.now()}`);
      setCookie("admin_token", token, 1);
      setLoginError("");
      setStep("form");
    } else {
      setLoginError("Usuario o contraseña incorrectos");
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  }

  function logout() {
    deleteCookie("admin_token");
    setStep("login");
    setUsername("");
    setPassword("");
    resetForm();
  }

  async function crearFunda(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const codigo = crypto.randomUUID().replace(/-/g, "");
    await saveFunda({ codigo, modelo, material, proteccion, compatibilidad });
    const url = `${import.meta.env.VITE_APP_URL ?? "http://localhost:5173"}/verify/${codigo}`;
    const dataURL = await QRCode.toDataURL(url, {
      width: 800,
      margin: 4,
      errorCorrectionLevel: "H",
      color: { dark: "#000000", light: "#ffffff" },
    });
    setQrDataURL(dataURL);
    setFundaCodigo(codigo);
    setSaving(false);
    setStep("qr");
  }

  function downloadQR() {
    if (!qrDataURL) return;
    const a = document.createElement("a");
    a.href = qrDataURL;
    a.download = `qr-${fundaCodigo?.slice(0, 8)}.png`;
    a.click();
  }

  function resetForm() {
    setModelo("");
    setMaterial("");
    setProteccion("");
    setCompatibilidad("");
    setQrDataURL(null);
    setFundaCodigo(null);
    setStep("form");
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sedgwick+Ave+Display&family=Montserrat:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ap-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          font-family: 'Montserrat', sans-serif;
          background-image: url("/NxS.png");
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          position: relative;
        }

        .ap-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          z-index: 0;
        }

        /* ── CARD ── */
        .ap-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 480px;
          background: rgba(10, 10, 10, 0.72);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow:
            0 2px 0 rgba(255,255,255,0.05) inset,
            0 40px 80px rgba(0,0,0,0.7);
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.6s cubic-bezier(.22,1,.36,1), transform 0.6s cubic-bezier(.22,1,.36,1);
        }
        .ap-card.revealed { opacity: 1; transform: translateY(0); }

        /* ── BARRA TOP ── */
        .ap-bar {
          height: 3px;
          width: 100%;
          background: linear-gradient(90deg, #1d4ed8, #60a5fa, #93c5fd);
        }

        /* ── INNER ── */
        .ap-inner { padding: 2.2rem 2.5rem 2rem; }

        /* ── HEADER ── */
        .ap-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.6rem;
        }
        .ap-brand {
          font-family: 'Sedgwick Ave Display', cursive;
          font-size: 2.8rem;
          line-height: 1;
          color: #ffffff;
          letter-spacing: 0.02em;
        }
        .ap-tagline {
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          margin-top: 0.2rem;
        }
        .ap-header-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
        }
        .ap-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.35rem 0.85rem;
          border-radius: 999px;
          background: rgba(74,222,128,0.1);
          border: 1px solid rgba(74,222,128,0.25);
          color: #4ade80;
        }
        .ap-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 6px #4ade80;
          animation: pulse-dot 2s infinite;
        }
        @keyframes pulse-dot {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.3; }
        }

        .ap-divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.07);
          margin: 1.4rem 0;
        }

        /* ── TITULO SECCIÓN ── */
        .ap-section-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.35rem;
        }
        .ap-section-desc {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.3);
          margin-bottom: 1.4rem;
          line-height: 1.55;
        }

        /* ── INPUTS ── */
        .ap-field { margin-bottom: 0.85rem; }
        .ap-label {
          display: block;
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.28);
          margin-bottom: 0.4rem;
        }
        .ap-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          color: #ffffff;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.88rem;
          font-weight: 500;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .ap-input::placeholder { color: rgba(255,255,255,0.15); }
        .ap-input:focus {
          border-color: rgba(96,165,250,0.45);
          background: rgba(255,255,255,0.06);
          box-shadow: 0 0 0 3px rgba(96,165,250,0.08);
        }

        /* ── ERROR ── */
        .ap-error {
          font-size: 0.78rem;
          color: #f87171;
          margin-bottom: 1rem;
          padding: 0.5rem 0.85rem;
          background: rgba(248,113,113,0.08);
          border: 1px solid rgba(248,113,113,0.2);
          border-radius: 8px;
        }

        /* ── SHAKE ── */
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-8px); }
          40%     { transform: translateX(8px); }
          60%     { transform: translateX(-5px); }
          80%     { transform: translateX(5px); }
        }
        .shake { animation: shake 0.5s ease; }

        /* ── BOTONES ── */
        .ap-btn {
          width: 100%;
          padding: 0.82rem;
          border: none;
          border-radius: 10px;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 0.5rem;
        }
        .ap-btn-primary {
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          color: #fff;
          box-shadow: 0 4px 20px rgba(59,130,246,0.25);
        }
        .ap-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(59,130,246,0.35); }
        .ap-btn-primary:active { transform: translateY(0); }
        .ap-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
        .ap-btn-ghost {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.35);
          font-size: 0.72rem;
          padding: 0.38rem 0.9rem;
          width: auto;
          border-radius: 8px;
          margin-top: 0;
          letter-spacing: 0.06em;
        }
        .ap-btn-ghost:hover { border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.6); }
        .ap-btn-outline {
          background: transparent;
          border: 1px solid rgba(96,165,250,0.3);
          color: #60a5fa;
        }
        .ap-btn-outline:hover { background: rgba(96,165,250,0.06); }
        .ap-btn-row { display: flex; gap: 0.75rem; width: 100%; margin-top: 0.25rem; }
        .ap-btn-row .ap-btn { flex: 1; margin-top: 0; }

        /* ── QR ── */
        .ap-qr-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        .ap-qr-img {
          width: 190px;
          height: 190px;
          border-radius: 14px;
          border: 2px solid rgba(96,165,250,0.2);
          box-shadow: 0 0 40px rgba(96,165,250,0.1);
        }
        .ap-qr-id {
          font-family: 'Courier New', monospace;
          font-size: 0.6rem;
          color: rgba(255,255,255,0.18);
          word-break: break-all;
          text-align: center;
          max-width: 340px;
        }

        /* ── META GRID ── */
        .ap-meta {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.6rem;
        }
        .ap-meta-item {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 0.75rem 0.9rem;
          transition: background 0.2s;
        }
        .ap-meta-item:hover { background: rgba(255,255,255,0.07); }
        .ap-meta-key {
          font-size: 0.58rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.28);
          margin-bottom: 0.28rem;
        }
        .ap-meta-val { font-size: 0.82rem; font-weight: 600; color: #ffffff; }
        .ap-meta-empty { color: rgba(255,255,255,0.2); font-style: italic; }

        /* ── FOOTER ── */
        .ap-footer {
          margin-top: 1.6rem;
          padding-top: 1.1rem;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .ap-footer-text { font-size: 0.62rem; color: rgba(255,255,255,0.18); letter-spacing: 0.08em; }
      `}</style>

      <div className="ap-root">
        <div className={`ap-card ${revealed ? "revealed" : ""} ${shake ? "shake" : ""}`}>

          <div className="ap-bar" />

          <div className="ap-inner">

            {/* ── HEADER ── */}
            <div className="ap-header">
              <div>
                <div className="ap-brand">NxS</div>
                <div className="ap-tagline">Panel de administración</div>
              </div>
              <div className="ap-header-right">
                {step === "qr" && (
                  <span className="ap-badge">
                    <span className="ap-badge-dot" />
                    Guardado
                  </span>
                )}
                {step !== "login" && (
                  <button className="ap-btn ap-btn-ghost" onClick={logout}>
                    Cerrar sesión
                  </button>
                )}
              </div>
            </div>

            <hr className="ap-divider" />

            {/* ════ LOGIN ════ */}
            {step === "login" && (
              <>
                <p className="ap-section-title">Bienvenido de nuevo.</p>
                <p className="ap-section-desc">Accede al panel para registrar y gestionar fundas NxS.</p>
                <form onSubmit={login}>
                  {loginError && <div className="ap-error">{loginError}</div>}
                  <div className="ap-field">
                    <label className="ap-label">Usuario</label>
                    <input className="ap-input" placeholder="admin" value={username}
                      onChange={(e) => setUsername(e.target.value)} autoFocus required />
                  </div>
                  <div className="ap-field">
                    <label className="ap-label">Contraseña</label>
                    <input type="password" className="ap-input" placeholder="••••••••" value={password}
                      onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <button className="ap-btn ap-btn-primary">Entrar</button>
                </form>
              </>
            )}

            {/* ════ FORMULARIO ════ */}
            {step === "form" && (
              <>
                <p className="ap-section-title">Nueva funda.</p>
                <p className="ap-section-desc">Rellena los datos para registrarla y generar su QR único.</p>
                <form onSubmit={crearFunda}>
                  <div className="ap-field">
                    <label className="ap-label">Modelo *</label>
                    <input className="ap-input" placeholder="ej. iPhone 15 Pro" value={modelo}
                      onChange={(e) => setModelo(e.target.value)} required />
                  </div>
                  <div className="ap-field">
                    <label className="ap-label">Material</label>
                    <input className="ap-input" placeholder="ej. Silicona, TPU, Cuero" value={material}
                      onChange={(e) => setMaterial(e.target.value)} />
                  </div>
                  <div className="ap-field">
                    <label className="ap-label">Protección</label>
                    <input className="ap-input" placeholder="ej. MilSpec, IP54" value={proteccion}
                      onChange={(e) => setProteccion(e.target.value)} />
                  </div>
                  <div className="ap-field">
                    <label className="ap-label">Compatibilidad</label>
                    <input className="ap-input" placeholder="ej. MagSafe, Qi" value={compatibilidad}
                      onChange={(e) => setCompatibilidad(e.target.value)} />
                  </div>
                  <button className="ap-btn ap-btn-primary" disabled={saving}>
                    {saving ? "Generando…" : "Crear funda + QR"}
                  </button>
                </form>
              </>
            )}

            {/* ════ QR GENERADO ════ */}
            {step === "qr" && qrDataURL && (
              <>
                <p className="ap-section-title">QR listo.</p>
                <p className="ap-section-desc">Funda registrada. Descarga el QR para imprimirlo o pegarlo.</p>
                <div className="ap-qr-wrap">
                  <img src={qrDataURL} alt="QR funda" className="ap-qr-img" />
                  <p className="ap-qr-id">{fundaCodigo}</p>
                  <div className="ap-meta">
                    <div className="ap-meta-item">
                      <div className="ap-meta-key">Modelo</div>
                      <div className={`ap-meta-val ${!modelo ? "ap-meta-empty" : ""}`}>{modelo || "—"}</div>
                    </div>
                    <div className="ap-meta-item">
                      <div className="ap-meta-key">Material</div>
                      <div className={`ap-meta-val ${!material ? "ap-meta-empty" : ""}`}>{material || "—"}</div>
                    </div>
                    <div className="ap-meta-item">
                      <div className="ap-meta-key">Protección</div>
                      <div className={`ap-meta-val ${!proteccion ? "ap-meta-empty" : ""}`}>{proteccion || "—"}</div>
                    </div>
                    <div className="ap-meta-item">
                      <div className="ap-meta-key">Compatibilidad</div>
                      <div className={`ap-meta-val ${!compatibilidad ? "ap-meta-empty" : ""}`}>{compatibilidad || "—"}</div>
                    </div>
                  </div>
                  <div className="ap-btn-row">
                    <button className="ap-btn ap-btn-primary" onClick={downloadQR}>Descargar QR</button>
                    <button className="ap-btn ap-btn-outline" onClick={resetForm}>Nueva funda</button>
                  </div>
                </div>
              </>
            )}

            <div className="ap-footer">
              <span className="ap-footer-text">nxs.admin © 2025</span>
              <span className="ap-footer-text">
                {step === "login" ? "Acceso restringido" : step === "form" ? "Sesión activa" : "Registro completado"}
              </span>
            </div>

          </div>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </>
  );
}