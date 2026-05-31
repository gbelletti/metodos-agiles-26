"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface TitularAPI {
  id: number;
  tipoDocumento: string;
  numeroDocumento: string;
  apellido: string;
  nombre: string;
  fechaNacimiento: string;
  direccion: string;
  claseSolicitada: string;
  grupoSanguineo: string;
  factorRH: boolean;
  donante: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

function formatFecha(iso: string): string {
  const d = new Date(iso + "T00:00:00"); // evita desfase de zona horaria
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function TitularesPage() {
  const [titulares, setTitulares] = useState<TitularAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function fetchTitulares() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/api/titulares`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        const data: TitularAPI[] = await res.json();
        if (!cancelled) setTitulares(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Error inesperado.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchTitulares();
    return () => { cancelled = true; };
  }, [refreshKey]);

  const cargarTitulares = () => setRefreshKey((k) => k + 1);
  async function handleEliminar(id: number, nombre: string, apellido: string) {
    if (!confirm(`¿Seguro que querés eliminar a ${nombre} ${apellido}? Esta acción no se puede deshacer.`)) return;
    try {
      const res = await fetch(`${API_URL}/api/titulares/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      cargarTitulares();
    } catch (err) {
      alert("No se pudo eliminar el titular. Intentá de nuevo.");
    }
  }
  const titularesFiltrados = titulares.filter(
    (t) =>
      `${t.nombre} ${t.apellido}`.toLowerCase().includes(busqueda.toLowerCase()) ||
      t.numeroDocumento.toLowerCase().includes(busqueda.toLowerCase())
  );

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

        .page-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 2rem; gap: 1rem; flex-wrap: wrap; }
        .page-eyebrow { font-family: 'IBM Plex Mono', monospace; font-size: 0.65rem; color: #4ade80; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 0.4rem; }
        .page-title { font-size: 1.75rem; font-weight: 600; color: #f1f5f9; letter-spacing: -0.02em; }
        .page-subtitle { font-size: 0.82rem; color: #64748b; margin-top: 0.3rem; font-weight: 300; }

        .btn-alta { display: inline-flex; align-items: center; gap: 0.5rem; background: #4ade80; color: #0a0f0d; font-family: 'IBM Plex Sans', sans-serif; font-size: 0.82rem; font-weight: 600; padding: 0.6rem 1.2rem; border-radius: 6px; border: none; cursor: pointer; text-decoration: none; letter-spacing: 0.02em; transition: background 0.15s, box-shadow 0.15s, transform 0.1s; white-space: nowrap; }
        .btn-alta:hover { background: #86efac; box-shadow: 0 0 20px #4ade8040; transform: translateY(-1px); }

        .toolbar { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
        .search-wrap { position: relative; flex: 1; max-width: 340px; }
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #475569; pointer-events: none; }
        .search-input { width: 100%; background: #111318; border: 1px solid #1e2330; color: #e2e8f0; font-family: 'IBM Plex Sans', sans-serif; font-size: 0.82rem; padding: 0.5rem 0.75rem 0.5rem 2.25rem; border-radius: 6px; outline: none; transition: border-color 0.2s; }
        .search-input::placeholder { color: #334155; }
        .search-input:focus { border-color: #4ade8060; }

        .btn-refresh { background: transparent; border: 1px solid #1e2330; color: #475569; padding: 0.45rem 0.75rem; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; font-size: 0.75rem; font-family: 'IBM Plex Sans', sans-serif; transition: all 0.15s; }
        .btn-refresh:hover { border-color: #334155; color: #94a3b8; }
        .btn-refresh svg { transition: transform 0.4s; }
        .btn-refresh:hover svg { transform: rotate(180deg); }

        .count-tag { font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem; color: #475569; background: #111318; border: 1px solid #1e2330; padding: 4px 10px; border-radius: 20px; margin-left: auto; }

        .table-card { background: #111318; border: 1px solid #1e2330; border-radius: 10px; overflow: hidden; }
        .table-scroll { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
        thead { background: #0d0f14; border-bottom: 1px solid #1e2330; }
        th { text-align: left; padding: 0.75rem 1.25rem; font-family: 'IBM Plex Mono', monospace; font-size: 0.65rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: #475569; white-space: nowrap; }
        tbody tr { border-bottom: 1px solid #1a1f2e; transition: background 0.12s; }
        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: #161b26; }
        td { padding: 1rem 1.25rem; color: #cbd5e1; vertical-align: middle; }

        .titular-cell { display: flex; align-items: center; gap: 0.75rem; }
        .avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, #1e3a2f, #0f2820); border: 1px solid #4ade8030; display: flex; align-items: center; justify-content: center; font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem; color: #4ade80; flex-shrink: 0; font-weight: 500; }
        .titular-name { font-weight: 500; color: #f1f5f9; }
        .titular-doc { font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem; color: #4ade80; margin-top: 1px; }

        .badge { display: inline-flex; align-items: center; font-family: 'IBM Plex Mono', monospace; font-size: 0.65rem; font-weight: 500; letter-spacing: 0.05em; padding: 3px 9px; border-radius: 4px; white-space: nowrap; }
        .badge-clase { background: #0f1e2d; color: #60a5fa; border: 1px solid #60a5fa30; }
        .badge-sangre { background: #2d1215; color: #f87171; border: 1px solid #f8717130; }
        .badge-si { background: #0f2820; color: #4ade80; border: 1px solid #4ade8030; }
        .badge-no { background: #1a1f2e; color: #475569; border: 1px solid #1e2330; }

        .meta-text { font-size: 0.78rem; color: #64748b; }
        .meta-date { font-family: 'IBM Plex Mono', monospace; font-size: 0.68rem; color: #94a3b8; }

        .actions { display: flex; gap: 0.5rem; }
        .btn-action { background: transparent; border: 1px solid #1e2330; color: #64748b; padding: 5px 10px; border-radius: 5px; font-size: 0.72rem; font-family: 'IBM Plex Sans', sans-serif; cursor: pointer; transition: all 0.15s; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; }
        .btn-action:hover { background: #1e2330; color: #e2e8f0; border-color: #334155; }

        .empty-state { padding: 5rem 2rem; text-align: center; color: #334155; }
        .empty-icon { margin: 0 auto 1.25rem; width: 56px; height: 56px; border-radius: 50%; background: #111318; border: 1px solid #1e2330; display: flex; align-items: center; justify-content: center; }
        .empty-title { font-size: 0.95rem; color: #475569; font-weight: 500; margin-bottom: 0.5rem; }
        .empty-sub { font-size: 0.78rem; color: #334155; margin-bottom: 1.5rem; }
        .btn-alta-outline { display: inline-flex; align-items: center; gap: 0.4rem; border: 1px solid #4ade8040; color: #4ade80; background: transparent; font-size: 0.8rem; font-family: 'IBM Plex Sans', sans-serif; font-weight: 500; padding: 0.55rem 1.1rem; border-radius: 6px; cursor: pointer; text-decoration: none; transition: background 0.15s, border-color 0.15s; }
        .btn-alta-outline:hover { background: #4ade8010; border-color: #4ade8080; }

        .skeleton { background: linear-gradient(90deg, #1e2330 25%, #252b3b 50%, #1e2330 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 4px; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .skeleton-row td { padding: 1rem 1.25rem; }
      `}</style>

      <div className="shell">
        <main className="main">

          <nav className="breadcrumb">
            <Link href="/">Inicio</Link>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Titulares</span>
          </nav>

          <div className="page-header">
            <div>
              <p className="page-eyebrow">Gestión de licencias</p>
              <h1 className="page-title">Titulares</h1>
              <p className="page-subtitle">Registro de titulares habilitados para obtener licencia de conducir</p>
            </div>
            <Link href="/titulares/alta" className="btn-alta">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Dar de alta nuevo titular
            </Link>
          </div>

          <div className="toolbar">
            <div className="search-wrap">
              <svg className="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.35-4.35" /></svg>
              <input className="search-input" type="text" placeholder="Buscar por nombre o documento..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            </div>
            <button className="btn-refresh" onClick={cargarTitulares}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
              Actualizar
            </button>
            <span className="count-tag">
              {loading ? "…" : `${titularesFiltrados.length} titular${titularesFiltrados.length !== 1 ? "es" : ""}`}
            </span>
          </div>

          <div className="table-card">
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Titular</th>
                    <th>Fecha Nac.</th>
                    <th>Clase</th>
                    <th>Grupo / RH</th>
                    <th>Donante</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && [1, 2, 3].map(i => (
                    <tr key={i} className="skeleton-row">
                      <td><div className="skeleton" style={{ height: "32px", width: "200px" }} /></td>
                      <td><div className="skeleton" style={{ height: "16px", width: "80px" }} /></td>
                      <td><div className="skeleton" style={{ height: "22px", width: "60px" }} /></td>
                      <td><div className="skeleton" style={{ height: "22px", width: "80px" }} /></td>
                      <td><div className="skeleton" style={{ height: "22px", width: "50px" }} /></td>
                      <td><div className="skeleton" style={{ height: "28px", width: "80px" }} /></td>
                    </tr>
                  ))}

                  {!loading && error && (
                    <tr><td colSpan={6}>
                      <div className="empty-state">
                        <div className="empty-icon">
                          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
                        </div>
                        <p className="empty-title" style={{ color: "#f87171" }}>Error al conectar con el servidor</p>
                        <p className="empty-sub">{error}</p>
                      </div>
                    </td></tr>
                  )}

                  {!loading && !error && titularesFiltrados.length === 0 && (
                    <tr><td colSpan={6}>
                      <div className="empty-state">
                        <div className="empty-icon">
                          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1e2330" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
                        </div>
                        <p className="empty-title">No hay titulares registrados</p>
                        <p className="empty-sub">Aún no se dio de alta ningún titular en el sistema.</p>
                        <Link href="/titulares/alta" className="btn-alta-outline">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                          Dar de alta el primer titular
                        </Link>
                      </div>
                    </td></tr>
                  )}

                  {!loading && !error && titularesFiltrados.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <div className="titular-cell">
                          <div className="avatar">{`${t.nombre[0]}${t.apellido[0]}`.toUpperCase()}</div>
                          <div>
                            <div className="titular-name">{t.apellido}, {t.nombre}</div>
                            <div className="titular-doc">{t.tipoDocumento} {t.numeroDocumento}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="meta-date">{formatFecha(t.fechaNacimiento)}</span></td>
                      <td><span className="badge badge-clase">Clase {t.claseSolicitada}</span></td>
                      <td>
                        <span className="badge badge-sangre">
                          {t.grupoSanguineo} {t.factorRH ? "+" : "−"}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${t.donante ? "badge-si" : "badge-no"}`}>
                          {t.donante ? "Sí" : "No"}
                        </span>
                      </td>
                      <td>
                        <div className="actions">
                          <Link href={`/titulares/${t.id}/modificacion`} className="btn-action">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" /></svg>
                            Editar
                          </Link>
                           <button className="btn-action danger" onClick={() => handleEliminar(t.id, t.nombre, t.apellido)}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </>
  );
}
