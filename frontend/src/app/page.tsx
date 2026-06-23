// Página principal - Menú de navegación del Sistema de Licencias
"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: #0d0f14;
          color: #e2e8f0;
          font-family: 'IBM Plex Sans', sans-serif;
          min-height: 100vh;
        }
        .shell { min-height: 100vh; display: flex; flex-direction: column; }

        .topbar {
          background: #111318;
          border-bottom: 1px solid #1e2330;
          padding: 0 2rem;
          height: 56px;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .topbar-logo {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem;
          color: #4ade80;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border: 1px solid #4ade8040;
          padding: 4px 10px;
          border-radius: 4px;
        }
        .topbar-sep { flex: 1; }
        .topbar-hint { font-size: 0.72rem; color: #475569; font-family: 'IBM Plex Mono', monospace; }

        .main {
          flex: 1;
          padding: 2.5rem 2rem;
          max-width: 960px;
          margin: 0 auto;
          width: 100%;
        }

        .page-eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.65rem;
          color: #4ade80;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-bottom: 0.4rem;
        }
        .page-title { font-size: 1.6rem; font-weight: 600; color: #f1f5f9; letter-spacing: -0.02em; margin-bottom: 0.25rem; }
        .page-subtitle { font-size: 0.82rem; color: #64748b; margin-top: 0.3rem; font-weight: 300; margin-bottom: 2.5rem; }

        .menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.25rem;
        }

        .menu-card {
          background: #111318;
          border: 1px solid #1e2330;
          border-radius: 10px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.1s;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
        }
        .menu-card:hover:not(.disabled) {
          border-color: #4ade8060;
          box-shadow: 0 0 0 3px #4ade8012;
          transform: translateY(-2px);
        }
        .menu-card.disabled {
          opacity: 0.5;
          cursor: default;
          background: #0f1117;
          border-color: #161b24;
        }

        .menu-card-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: #1a2e23;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }
        .menu-card-icon svg {
          width: 20px;
          height: 20px;
          stroke: #4ade80;
          fill: none;
          stroke-width: 1.8;
        }
        .menu-card.disabled .menu-card-icon {
          background: #1a1f28;
        }
        .menu-card.disabled .menu-card-icon svg {
          stroke: #475569;
        }

        .menu-card-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: #e2e8f0;
          margin-bottom: 0.35rem;
        }
        .menu-card.dimmed .menu-card-title { color: #94a3b8; }

        .menu-card-desc {
          font-size: 0.78rem;
          color: #64748b;
          line-height: 1.4;
        }

        .badge {
          font-size: 0.65rem;
          font-family: 'IBM Plex Mono', monospace;
          color: #475569;
          border: 1px solid #1e2330;
          padding: 2px 8px;
          border-radius: 4px;
          margin-top: 0.75rem;
          display: inline-block;
        }

        @media (max-width: 560px) {
          .menu-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="shell">
        <main className="main">
          <div className="page-eyebrow">Panel principal</div>
          <h1 className="page-title">Sistema de Gestión de Licencias</h1>
          <p className="page-subtitle">
            Seleccioná una opción para comenzar. Las funcionalidades marcadas
            como “Próximamente” se habilitarán a medida que tus compañeros las
            implementen.
          </p>

          <div className="menu-grid">
            {/* 1. Emitir una licencia */}
            <Link href="/emitir" className="menu-card">
              <div className="menu-card-icon">
                <svg viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                  />
                </svg>
              </div>
              <div className="menu-card-title">Emitir una licencia</div>
              <div className="menu-card-desc">
                Registrar una nueva licencia en el sistema.
              </div>
            </Link>

            {/* 2. Imprimir licencia (próximamente) */}
            <div className="menu-card disabled">
              <div className="menu-card-icon">
                <svg viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
                  />
                </svg>
              </div>
              <div className="menu-card-title">Imprimir licencia</div>
              <div className="menu-card-desc">
                Generar e imprimir una licencia en formato PDF.
              </div>
              <span className="badge">Próximamente</span>
            </div>

            {/* 3. Renovar licencia (próximamente) */}
            <div className="menu-card disabled">
              <div className="menu-card-icon">
                <svg viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
              </div>
              <div className="menu-card-title">Renovar licencia</div>
              <div className="menu-card-desc">
                Extender la vigencia de una licencia existente.
              </div>
              <span className="badge">Próximamente</span>
            </div>

            {/* 4. Emitir copia (FUNCIONAL) */}
            <Link href="/copia" className="menu-card">
              <div className="menu-card-icon">
                <svg viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                  />
                </svg>
              </div>
              <div className="menu-card-title">Emitir copia</div>
              <div className="menu-card-desc">
                Duplicar una licencia emitida anteriormente.
              </div>
            </Link>

            {/* 5. Listado de licencias expiradas */}
            <Link href="/licencias-expiradas" className="menu-card">
              <div className="menu-card-icon">
                <svg viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                  />
                </svg>
              </div>
              <div className="menu-card-title">
                Listado de licencias expiradas
              </div>
              <div className="menu-card-desc">
                Ver todas las licencias que superaron su fecha de vencimiento.
              </div>
            </Link>

            {/* 6. Listado de licencias vigentes por criterios */}
            <Link href="/licencias-vigentes" className="menu-card">
              <div className="menu-card-icon">
                <svg viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              </div>
              <div className="menu-card-title">
                Licencias vigentes por criterios
              </div>
              <div className="menu-card-desc">
                Filtrar licencias activas según tipo, persona u otros
                parámetros.
              </div>
            </Link>

            {/* Calcular vigencia (FUNCIONAL) */}
            <Link href="/vigencia" className="menu-card">
              <div className="menu-card-icon">
                <svg viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                  />
                </svg>
              </div>
              <div className="menu-card-title">Calcular vigencia</div>
              <div className="menu-card-desc">
                Calcular fechas de inicio y vencimiento de una licencia.
              </div>
            </Link>

            {/* 7. Listado de usuarios administrativos (FUNCIONAL) */}
            <Link href="/usuarios" className="menu-card">
              <div className="menu-card-icon">
                <svg viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                  />
                </svg>
              </div>
              <div className="menu-card-title">
                Listado de usuarios administrativos
              </div>
              <div className="menu-card-desc">
                Administrar los usuarios del sistema: altas, bajas y
                modificaciones.
              </div>
            </Link>
            {/* Administración de Costos (Historia 3) */}
            <Link href="/admin/costos" className="menu-card">
              <div className="menu-card-icon">
                {/* Ícono de un signo pesos para representar los costos */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="menu-card-title">Administrar Tabla de Costos</div>
              <div className="menu-card-desc">
                Actualizar los precios base para la emisión de licencias.
              </div>
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
