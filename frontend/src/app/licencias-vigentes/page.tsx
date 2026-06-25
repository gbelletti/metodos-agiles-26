"use client";

import { useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

interface LicenciaVigente {
  id: number;
  nombreTitular: string;
  apellidoTitular: string;
  numeroDocumento: string;
  clase: string;
  fechaEmision: string;
  fechaVencimiento: string;
  costoTotal: number;
  observaciones: string;
}

const GRUPOS_SANGUINEOS = ["A", "B", "AB", "O"];
const FACTORES_RH = ["+", "−"];
const DONANTE_OPTIONS = [
  { value: "true", label: "Sí" },
  { value: "false", label: "No" },
];

function formatFecha(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

export default function LicenciasVigentesPage() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [grupoSanguineo, setGrupoSanguineo] = useState("");
  const [factorRh, setFactorRh] = useState("");
  const [donante, setDonante] = useState<string>("");
  const [resultados, setResultados] = useState<LicenciaVigente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  async function buscar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusquedaRealizada(true);
    setLoading(true);

    const params = new URLSearchParams();
    if (nombre.trim()) params.append("nombre", nombre.trim());
    if (apellido.trim()) params.append("apellido", apellido.trim());
    if (grupoSanguineo) params.append("grupoSanguineo", grupoSanguineo);
    if (factorRh) params.append("factorRh", factorRh);
    if (donante) params.append("donante", donante);

    try {
      const res = await fetch(`${API_URL}/licencias/vigentes?${params}`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data: LicenciaVigente[] = await res.json();
      setResultados(data);
    } catch (err: unknown) {
      const mensaje = err instanceof Error ? err.message : "Error al buscar licencias";
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0d0f14; color: #e2e8f0; font-family: 'IBM Plex Sans', sans-serif; min-height: 100vh; }
        .shell { min-height: 100vh; display: flex; flex-direction: column; }
        .main { flex: 1; padding: 2.5rem 2rem; max-width: 1200px; margin: 0 auto; width: 100%; }

        .breadcrumb { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.75rem; font-size: 0.75rem; color: #475569; }
        .breadcrumb a { color: #475569; text-decoration: none; transition: color 0.15s; }
        .breadcrumb a:hover { color: #4ade80; }
        .breadcrumb-sep { color: #1e2330; }
        .breadcrumb-current { color: #94a3b8; }

        .page-eyebrow { font-family: 'IBM Plex Mono', monospace; font-size: 0.65rem; color: #4ade80; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 0.4rem; }
        .page-title { font-size: 1.75rem; font-weight: 600; color: #f1f5f9; letter-spacing: -0.02em; }
        .page-subtitle { font-size: 0.82rem; color: #64748b; margin-top: 0.3rem; font-weight: 300; margin-bottom: 2rem; }

        .filters-card { background: #111318; border: 1px solid #1e2330; border-radius: 10px; padding: 1.5rem; margin-bottom: 2rem; }
        .filters-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
        .filter-group { display: flex; flex-direction: column; gap: 0.35rem; }
        label { font-size: 0.75rem; font-weight: 500; color: #94a3b8; }
        input, select { background: #0d0f14; border: 1px solid #1e2330; color: #e2e8f0; font-family: 'IBM Plex Sans', sans-serif; font-size: 0.85rem; padding: 0.55rem 0.75rem; border-radius: 6px; outline: none; appearance: none; transition: border-color 0.2s; }
        input::placeholder { color: #334155; }
        input:focus, select:focus { border-color: #4ade8060; box-shadow: 0 0 0 3px #4ade8012; }
        .select-wrap { position: relative; }
        .select-wrap::after { content: ''; position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 5px solid #475569; pointer-events: none; }
        select { padding-right: 2rem; cursor: pointer; }
        select option { background: #111318; }

        .btn-buscar { background: #4ade80; color: #0a0f0d; font-family: 'IBM Plex Sans', sans-serif; font-size: 0.85rem; font-weight: 600; padding: 0.6rem 1.4rem; border-radius: 6px; border: none; cursor: pointer; transition: background 0.15s, box-shadow 0.15s; align-self: flex-end; }
        .btn-buscar:hover:not(:disabled) { background: #86efac; box-shadow: 0 0 20px #4ade8040; }
        .btn-buscar:disabled { opacity: 0.5; cursor: not-allowed; }

        .error-msg { background: #2d1215; border: 1px solid #7f1d1d40; color: #f87171; font-size: 0.8rem; padding: 0.65rem 1rem; border-radius: 6px; margin-bottom: 1rem; }

        .table-card { background: #111318; border: 1px solid #1e2330; border-radius: 10px; overflow: hidden; }
        .table-scroll { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
        thead { background: #0d0f14; border-bottom: 1px solid #1e2330; }
        th { text-align: left; padding: 0.75rem 1rem; font-family: 'IBM Plex Mono', monospace; font-size: 0.65rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #475569; white-space: nowrap; }
        tbody tr { border-bottom: 1px solid #1a1f2e; transition: background 0.12s; }
        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: #161b26; }
        td { padding: 0.85rem 1rem; color: #cbd5e1; vertical-align: middle; }

        .badge-clase { display: inline-flex; align-items: center; font-family: 'IBM Plex Mono', monospace; font-size: 0.65rem; font-weight: 500; letter-spacing: 0.05em; padding: 3px 9px; border-radius: 4px; background: #0f1e2d; color: #60a5fa; border: 1px solid #60a5fa30; }

        .empty-state { padding: 4rem 2rem; text-align: center; color: #334155; }
        .empty-icon { margin: 0 auto 1rem; width: 48px; height: 48px; border-radius: 50%; background: #111318; border: 1px solid #1e2330; display: flex; align-items: center; justify-content: center; }
        .empty-title { font-size: 0.95rem; color: #475569; font-weight: 500; margin-bottom: 0.5rem; }
        .empty-sub { font-size: 0.78rem; color: #334155; }
      `}</style>

      <div className="shell">
        <main className="main">
          <nav className="breadcrumb">
            <Link href="/">Inicio</Link>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Licencias vigentes</span>
          </nav>

          <p className="page-eyebrow">Consultas</p>
          <h1 className="page-title">Licencias vigentes</h1>
          <p className="page-subtitle">Buscá licencias activas combinando distintos criterios.</p>

          <form onSubmit={buscar} className="filters-card">
            <div className="filters-grid">
              <div className="filter-group">
                <label>Nombre</label>
                <input type="text" placeholder="Ej: Juan" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              </div>
              <div className="filter-group">
                <label>Apellido</label>
                <input type="text" placeholder="Ej: García" value={apellido} onChange={(e) => setApellido(e.target.value)} />
              </div>
              <div className="filter-group">
                <label>Grupo sanguíneo</label>
                <div className="select-wrap">
                  <select value={grupoSanguineo} onChange={(e) => setGrupoSanguineo(e.target.value)}>
                    <option value="">Cualquiera</option>
                    {GRUPOS_SANGUINEOS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div className="filter-group">
                <label>Factor RH</label>
                <div className="select-wrap">
                  <select value={factorRh} onChange={(e) => setFactorRh(e.target.value)}>
                    <option value="">Cualquiera</option>
                    {FACTORES_RH.map(rh => <option key={rh} value={rh === "−" ? "false" : "true"}>{rh}</option>)}
                  </select>
                </div>
              </div>
              <div className="filter-group">
                <label>Donante de órganos</label>
                <div className="select-wrap">
                  <select value={donante} onChange={(e) => setDonante(e.target.value)}>
                    <option value="">Todos</option>
                    {DONANTE_OPTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-buscar" disabled={loading}>
                {loading ? "Buscando…" : "Buscar"}
              </button>
            </div>
          </form>

          {error && <div className="error-msg">⚠ {error}</div>}

          {!loading && busquedaRealizada && resultados.length === 0 && !error && (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1e2330" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <p className="empty-title">Sin resultados</p>
              <p className="empty-sub">No se encontraron licencias vigentes con los filtros aplicados.</p>
            </div>
          )}

          {resultados.length > 0 && (
            <div className="table-card">
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Titular</th>
                      <th>Documento</th>
                      <th>Clase</th>
                      <th>Emisión</th>
                      <th>Vencimiento</th>
                      <th>Costo</th>
                      <th>Observaciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.map((lic) => (
                      <tr key={lic.id}>
                        <td style={{ fontWeight: 500, color: "#f1f5f9" }}>{lic.apellidoTitular}, {lic.nombreTitular}</td>
                        <td style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: "0.75rem" }}>{lic.numeroDocumento}</td>
                        <td><span className="badge-clase">{lic.clase}</span></td>
                        <td>{formatFecha(lic.fechaEmision)}</td>
                        <td>{formatFecha(lic.fechaVencimiento)}</td>
                        <td style={{ fontFamily: "IBM Plex Mono, monospace" }}>$ {lic.costoTotal}</td>
                        <td style={{ color: "#64748b", maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{lic.observaciones || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}