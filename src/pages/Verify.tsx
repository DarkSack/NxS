import { useEffect, useState } from "react";
import { verifyQR } from "../../api/verify";
import { useParams } from "react-router-dom";

interface Data {
  modelo?: string;
  material?: string;
  proteccion?: string;
  compatibilidad?: string;
}

export default function Verify() {
  const { codigo } = useParams<{ codigo: string }>();

  const [loading, setLoading] = useState<boolean>(!!codigo);
  const [valido, setValido] = useState<boolean | null>(codigo ? null : false);
  const [data, setData] = useState<Data | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!codigo) return;
    let mounted = true;
    verifyQR(codigo)
      .then((res) => {
        if (!mounted) return;
        setValido(res.valido);
        setData(res);
      })
      .catch(() => { if (mounted) setValido(false); })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
        setTimeout(() => setRevealed(true), 80);
      });
    return () => { mounted = false; };
  }, [codigo]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sedgwick+Ave+Display&family=Montserrat:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .vf-root {
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

        /* dark overlay sobre la imagen */
        .vf-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          z-index: 0;
        }

        /* ── LOADING ── */
        .vf-loading {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.2rem;
          color: rgba(255,255,255,0.7);
          font-size: 0.85rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }
        .vf-spinner {
          width: 44px; height: 44px;
          border: 2px solid rgba(255,255,255,0.1);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── CARD ── */
        .vf-card {
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
        .vf-card.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── ACCENT BAR ── */
        .vf-bar {
          height: 3px;
          width: 100%;
        }
        .vf-bar-valid   { background: linear-gradient(90deg, #16a34a, #4ade80, #86efac); }
        .vf-bar-invalid { background: linear-gradient(90deg, #991b1b, #ef4444, #fca5a5); }

        /* ── INNER PADDING ── */
        .vf-inner { padding: 2.5rem 2.5rem 2rem; }

        /* ── BRAND ── */
        .vf-brand {
          font-family: 'Sedgwick Ave Display', cursive;
          font-size: 3.8rem;
          line-height: 1;
          letter-spacing: 0.02em;
          margin-bottom: 0.25rem;
        }
        .vf-brand-valid   { color: #ffffff; }
        .vf-brand-invalid { color: #ffffff; }

        .vf-tagline {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 2rem;
        }

        /* ── DIVIDER ── */
        .vf-divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.07);
          margin: 1.5rem 0;
        }

        /* ── STATUS BADGE ── */
        .vf-status {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 1rem;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 1.2rem;
        }
        .vf-status-valid {
          background: rgba(74,222,128,0.1);
          border: 1px solid rgba(74,222,128,0.25);
          color: #4ade80;
        }
        .vf-status-invalid {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.25);
          color: #ef4444;
        }
        .vf-status-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          animation: pulse-dot 2s infinite;
        }
        .vf-status-dot-valid   { background: #4ade80; box-shadow: 0 0 6px #4ade80; }
        .vf-status-dot-invalid { background: #ef4444; box-shadow: 0 0 6px #ef4444; }
        @keyframes pulse-dot {
          0%,100% { opacity: 1; }
          50%     { opacity: 0.4; }
        }

        /* ── HEADLINE ── */
        .vf-headline {
          font-size: 1.05rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.4;
          margin-bottom: 0.5rem;
        }
        .vf-subtext {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.35);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        /* ── SPECS GRID ── */
        .vf-specs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .vf-spec {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 0.85rem 1rem;
          transition: background 0.2s;
        }
        .vf-spec:hover { background: rgba(255,255,255,0.07); }
        .vf-spec-label {
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 0.3rem;
        }
        .vf-spec-value {
          font-size: 0.85rem;
          font-weight: 600;
          color: #ffffff;
        }
        .vf-spec-empty { color: rgba(255,255,255,0.2); font-style: italic; }

        /* ── FOOTER ── */
        .vf-footer {
          margin-top: 2rem;
          padding-top: 1.25rem;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .vf-footer-text {
          font-size: 0.65rem;
          color: rgba(255,255,255,0.2);
          letter-spacing: 0.08em;
        }
        .vf-footer-id {
          font-size: 0.6rem;
          color: rgba(255,255,255,0.15);
          font-family: 'Courier New', monospace;
          max-width: 160px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* ── INVALID ICON ── */
        .vf-x-icon {
          font-size: 2.5rem;
          margin-bottom: 0.75rem;
          display: block;
        }
      `}</style>

      <div className="vf-root">

        {/* ── LOADING ── */}
        {loading && (
          <div className="vf-loading">
            <div className="vf-spinner" />
            Verificando autenticidad
          </div>
        )}

        {/* ── RESULTADO ── */}
        {!loading && (
          <div className={`vf-card ${revealed ? "revealed" : ""}`}>

            {/* barra de color arriba */}
            <div className={`vf-bar ${valido ? "vf-bar-valid" : "vf-bar-invalid"}`} />

            <div className="vf-inner">

              {/* brand */}
              <div className={`vf-brand ${valido ? "vf-brand-valid" : "vf-brand-invalid"}`}>
                NxS
              </div>
              <p className="vf-tagline">Certificado de autenticidad</p>

              <hr className="vf-divider" />

              {valido && data ? (
                <>
                  {/* badge */}
                  <div className="vf-status vf-status-valid">
                    <span className="vf-status-dot vf-status-dot-valid" />
                    Producto verificado
                  </div>

                  <p className="vf-headline">Tu funda es 100% auténtica.</p>
                  <p className="vf-subtext">
                    Este producto ha sido registrado y certificado por NxS.
                    Escanea con confianza — su autenticidad está garantizada.
                  </p>

                  {/* specs */}
                  <div className="vf-specs">
                    <div className="vf-spec">
                      <div className="vf-spec-label">Modelo</div>
                      <div className={`vf-spec-value ${!data.modelo ? "vf-spec-empty" : ""}`}>
                        {data.modelo || "—"}
                      </div>
                    </div>
                    <div className="vf-spec">
                      <div className="vf-spec-label">Material</div>
                      <div className={`vf-spec-value ${!data.material ? "vf-spec-empty" : ""}`}>
                        {data.material || "—"}
                      </div>
                    </div>
                    <div className="vf-spec">
                      <div className="vf-spec-label">Protección</div>
                      <div className={`vf-spec-value ${!data.proteccion ? "vf-spec-empty" : ""}`}>
                        {data.proteccion || "—"}
                      </div>
                    </div>
                    <div className="vf-spec">
                      <div className="vf-spec-label">Compatibilidad</div>
                      <div className={`vf-spec-value ${!data.compatibilidad ? "vf-spec-empty" : ""}`}>
                        {data.compatibilidad || "—"}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* badge inválido */}
                  <div className="vf-status vf-status-invalid">
                    <span className="vf-status-dot vf-status-dot-invalid" />
                    No verificado
                  </div>

                  <span className="vf-x-icon">⚠️</span>
                  <p className="vf-headline">Este producto no pudo verificarse.</p>
                  <p className="vf-subtext">
                    El código escaneado no existe en la base de datos de NxS.
                    Puede tratarse de un producto no registrado o una falsificación.
                  </p>
                </>
              )}

              {/* footer */}
              <div className="vf-footer">
                <span className="vf-footer-text">nxs.verificación © 2025</span>
                {codigo && (
                  <span className="vf-footer-id" title={codigo}>{codigo}</span>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </>
  );
}