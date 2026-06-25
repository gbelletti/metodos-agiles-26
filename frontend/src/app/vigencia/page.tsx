"use client";

import { useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

interface VigenciaResult {
  fechaInicio: string;
  fechaVencimiento: string;
  aniosVigencia: number;
}

export default function VigenciaPage() {
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [esPrimeraLicencia, setEsPrimeraLicencia] = useState("true");
  const [resultado, setResultado] = useState<VigenciaResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function calcular() {
    if (!fechaNacimiento) {
      setError("La fecha de nacimiento es obligatoria.");
      return;
    }
    setError("");
    setResultado(null);
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/vigencia/calcular?fechaNacimiento=${fechaNacimiento}&esPrimeraLicencia=${esPrimeraLicencia}`
      );
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data: VigenciaResult = await res.json();
      setResultado(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  function formatFecha(fecha: string) {
    const [year, month, day] = fecha.split("-");
    return `${day}/${month}/${year}`;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0d0f14; color: #e2e8f0; font-family: 'IBM Plex Sans', sans-serif; min-height: 100vh; }
        .shell { min-height: 100vh; display: flex; flex-direction: column; }
        .main { flex: 1; padding: 2.5rem 2rem; max-width: 580px; margin: 0 auto; width: 100%; }

        .breadcrumb { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.75rem; font-size: 0.75rem; color: #475569; }
        .breadcrumb a { color: #475569; text-decoration: none; transition: color 0.15s; }
        .breadcrumb a:hover { color: #4ade80; }
        .breadcrumb-sep { color: #1e2330; }
        .breadcrumb-current { color: #94a3b8; }

        .page-eyebrow { font-family: 'IBM Plex Mono', monospace; font-size: 0.65rem; color: #4ade80; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 0.4rem; }
        .page-title { font-size: 1.6rem; font-weight: 600; color: #f1f5f9; letter-spacing: -0.02em; }
        .page-subtitle { font-size: 0.82rem; color: #64748b; margin-top: 0.3rem; font-weight: 300; margin-bottom: 2rem; }

        .form-card { background: #111318; border: 1px solid #1e2330; border-radius: 10px; padding: 2rem; }
        .form-section-title { font-family: 'IBM Plex Mono', monospace; font-size: 0.65rem; color: #475569; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 1px solid #1e2330; }

        .form-group { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1.25rem; }
        label { font-size: 0.75rem; font-weight: 500; color: #94a3b8; letter-spacing: 0.03em; }
        .required { color: #4ade80; margin-left: 2px; }

        input, select {
          width: 100%; background: #0d0f14; border: 1px solid #1e2330; color: #e2e8f0;
          font-family: 'IBM Plex Sans', sans-serif; font-size: 0.85rem;
          padding: 0.6rem 0.85rem; border-radius: 6px; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s; appearance: none;
        }
        input:focus, select:focus { border-color: #4ade8060; box-shadow: 0 0 0 3px #4ade8012; }
        input.error-input { border-color: #f8717160; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); cursor: pointer; }
        .select-wrap { position: relative; }
        .select-wrap::after { content: ''; position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 5px solid #475569; pointer-events: none; }
        select { padding-right: 2rem; cursor: pointer; }
        select option { background: #111318; }

        .field-error { font-size: 0.72rem; color: #f87171; }
        .alert-error { background: #2d1215; border: 1px solid #7f1d1d40; border-radius: 6px; padding: 0.75rem 1rem; font-size: 0.8rem; color: #f87171; margin-bottom: 1.5rem; }

        .btn-calcular { background: #4ade80; color: #0a0f0d; font-family: 'IBM Plex Sans', sans-serif; font-size: 0.85rem; font-weight: 600; padding: 0.65rem 1.5rem; border-radius: 6px; border: none; cursor: pointer; width: 100%; transition: background 0.15s, box-shadow 0.15s; margin-top: 0.5rem; }
        .btn-calcular:hover:not(:disabled) { background: #86efac; box-shadow: 0 0 20px #4ade8040; }
        .btn-calcular:disabled { opacity: 0.5; cursor: not-allowed; }

        .divider { border: none; border-top: 1px solid #1e2330; margin: 1.5rem 0; }

        .result-card { background: #0d1a12; border: 1px solid #4ade8030; border-radius: 10px; padding: 1.5rem; margin-top: 1.5rem; }
        .result-title { font-family: 'IBM Plex Mono', monospace; font-size: 0.65rem; color: #4ade80; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 1.25rem; }
        .result-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .result-item { display: flex; flex-direction: column; gap: 0.3rem; }
        .result-item.full { grid-column: 1 / -1; }
        .result-label { font-size: 0.72rem; color: #64748b; }
        .result-value { font-size: 1rem; font-weight: 600; color: #f1f5f9; }
        .result-value.highlight { color: #4ade80; font-size: 1.4rem; }
        .result-badge { display: inline-flex; align-items: center; gap: 0.4rem; background: #1a2e23; border: 1px solid #4ade8040; border-radius: 6px; padding: 0.3rem 0.75rem; font-size: 0.78rem; color: #4ade80; font-family: 'IBM Plex Mono', monospace; margin-top: 0.25rem; }

        @media (max-width: 480px) { .result-grid { grid-template-columns: 1fr; } .result-item.full { grid-column: 1; } }
      `}</style>

      <div className="shell">
        <main className="main">

          <nav className="breadcrumb">
            <Link href="/">Inicio</Link>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Calcular vigencia</span>
          </nav>

          <div>
            <p className="page-eyebrow">Licencias</p>
            <h1 className="page-title">Calcular vigencia</h1>
            <p className="page-subtitle">
              Ingresá la fecha de nacimiento del titular para calcular automáticamente la vigencia de la licencia.
            </p>
          </div>

          <div className="form-card">
            <p className="form-section-title">Datos del titular</p>

            {error && <div className="alert-error">⚠ {error}</div>}

            <div className="form-group">
              <label>Fecha de nacimiento <span className="required">*</span></label>
              <input
                type="date"
                value={fechaNacimiento}
                onChange={(e) => { setFechaNacimiento(e.target.value); setError(""); setResultado(null); }}
                className={error && !fechaNacimiento ? "error-input" : ""}
              />
            </div>

            <div className="form-group">
              <label>¿Es la primera licencia del titular? <span className="required">*</span></label>
              <div className="select-wrap">
                <select value={esPrimeraLicencia} onChange={(e) => { setEsPrimeraLicencia(e.target.value); setResultado(null); }}>
                  <option value="true">Sí — primera licencia</option>
                  <option value="false">No — ya tuvo licencias anteriores</option>
                </select>
              </div>
            </div>

            <button className="btn-calcular" onClick={calcular} disabled={loading}>
              {loading ? "Calculando..." : "Calcular vigencia"}
            </button>

            {resultado && (
              <div className="result-card">
                <p className="result-title">Resultado</p>
                <div className="result-grid">

                  <div className="result-item full">
                    <span className="result-label">Vigencia otorgada</span>
                    <span className="result-value highlight">{resultado.aniosVigencia} {resultado.aniosVigencia === 1 ? "año" : "años"}</span>
                  </div>

                  <div className="result-item">
                    <span className="result-label">Fecha de inicio</span>
                    <span className="result-value">{formatFecha(resultado.fechaInicio)}</span>
                    <span className="result-badge">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                      </svg>
                      No editable
                    </span>
                  </div>

                  <div className="result-item">
                    <span className="result-label">Fecha de vencimiento</span>
                    <span className="result-value">{formatFecha(resultado.fechaVencimiento)}</span>
                  </div>

                </div>
              </div>
            )}
          </div>

        </main>
      </div>
    </>
  );
}
