"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

const ROLES = [
  { value: "ADMIN", label: "Administrador" },
  { value: "OPERADOR", label: "Operador" },
];

interface FormData {
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  contrasena: string;
  confirmarContrasena: string;
  rol: string;
}

interface FormErrors {
  nombre?: string;
  apellido?: string;
  nombreUsuario?: string;
  contrasena?: string;
  confirmarContrasena?: string;
  rol?: string;
  general?: string;
}

export default function AltaUsuarioPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({ nombre: "", apellido: "", nombreUsuario: "", contrasena: "", confirmarContrasena: "", rol: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  function validar(): FormErrors {
    const e: FormErrors = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio.";
    if (!form.apellido.trim()) e.apellido = "El apellido es obligatorio.";
    if (!form.nombreUsuario.trim()) e.nombreUsuario = "El nombre de usuario es obligatorio.";
    if (!form.contrasena) e.contrasena = "La contraseña es obligatoria.";
    else if (form.contrasena.length < 8) e.contrasena = "Debe tener al menos 8 caracteres.";
    if (!form.confirmarContrasena) e.confirmarContrasena = "Confirmá la contraseña.";
    else if (form.contrasena !== form.confirmarContrasena) e.confirmarContrasena = "Las contraseñas no coinciden.";
    if (!form.rol) e.rol = "Seleccioná un rol.";
    return e;
  }

  async function handleSubmit() {
    const e = validar();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: form.nombre, apellido: form.apellido, nombreUsuario: form.nombreUsuario, contrasena: form.contrasena, rol: form.rol }),
      });
      if (res.status === 409) { setErrors({ nombreUsuario: "El nombre de usuario ya existe en el sistema." }); return; }
      if (!res.ok) throw new Error(`Error ${res.status}`);
      // Dispara el evento de refresh en el listado y navega de vuelta
      window.dispatchEvent(new Event("usuarios:refresh"));
      router.push("/usuarios");
    } catch (err: unknown) {
      setErrors({ general: err instanceof Error ? err.message : "Error inesperado." });
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  const strengthLevel = (() => {
    const p = form.contrasena;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();
  const strengthLabel = ["", "Débil", "Regular", "Buena", "Fuerte"][strengthLevel];
  const strengthColor = ["", "#f87171", "#fb923c", "#facc15", "#4ade80"][strengthLevel];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0d0f14; color: #e2e8f0; font-family: 'IBM Plex Sans', sans-serif; min-height: 100vh; }
        .shell { min-height: 100vh; display: flex; flex-direction: column; }
        .topbar { background: #111318; border-bottom: 1px solid #1e2330; padding: 0 2rem; height: 56px; display: flex; align-items: center; gap: 1rem; }
        .topbar-logo { font-family: 'IBM Plex Mono', monospace; font-size: 0.75rem; color: #4ade80; letter-spacing: 0.12em; text-transform: uppercase; border: 1px solid #4ade8040; padding: 4px 10px; border-radius: 4px; }
        .topbar-sep { flex: 1; }
        .topbar-hint { font-size: 0.72rem; color: #475569; font-family: 'IBM Plex Mono', monospace; }
        .main { flex: 1; padding: 2.5rem 2rem; max-width: 680px; margin: 0 auto; width: 100%; }
        .breadcrumb { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.75rem; font-size: 0.75rem; color: #475569; }
        .breadcrumb a { color: #475569; text-decoration: none; transition: color 0.15s; }
        .breadcrumb a:hover { color: #4ade80; }
        .breadcrumb-sep { color: #1e2330; }
        .breadcrumb-current { color: #94a3b8; }
        .page-header { margin-bottom: 2rem; }
        .page-eyebrow { font-family: 'IBM Plex Mono', monospace; font-size: 0.65rem; color: #4ade80; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 0.4rem; }
        .page-title { font-size: 1.6rem; font-weight: 600; color: #f1f5f9; letter-spacing: -0.02em; }
        .page-subtitle { font-size: 0.82rem; color: #64748b; margin-top: 0.3rem; font-weight: 300; }
        .form-card { background: #111318; border: 1px solid #1e2330; border-radius: 10px; padding: 2rem; }
        .form-section-title { font-family: 'IBM Plex Mono', monospace; font-size: 0.65rem; color: #475569; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 1px solid #1e2330; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.25rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .form-group.full { grid-column: 1 / -1; }
        label { font-size: 0.75rem; font-weight: 500; color: #94a3b8; letter-spacing: 0.03em; }
        .required { color: #4ade80; margin-left: 2px; }
        .input-wrap { position: relative; }
        input, select { width: 100%; background: #0d0f14; border: 1px solid #1e2330; color: #e2e8f0; font-family: 'IBM Plex Sans', sans-serif; font-size: 0.85rem; padding: 0.6rem 0.85rem; border-radius: 6px; outline: none; transition: border-color 0.2s, box-shadow 0.2s; appearance: none; }
        input::placeholder { color: #334155; }
        input:focus, select:focus { border-color: #4ade8060; box-shadow: 0 0 0 3px #4ade8012; }
        input.err, select.err { border-color: #f8717160; }
        input.err:focus, select.err:focus { border-color: #f87171; box-shadow: 0 0 0 3px #f8717112; }
        .toggle-pass { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #475569; cursor: pointer; padding: 4px; display: flex; align-items: center; transition: color 0.15s; }
        .toggle-pass:hover { color: #94a3b8; }
        .select-wrap { position: relative; }
        .select-wrap::after { content: ''; position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 5px solid #475569; pointer-events: none; }
        select { padding-right: 2rem; cursor: pointer; }
        select option { background: #111318; }
        .field-error { font-size: 0.72rem; color: #f87171; display: flex; align-items: center; gap: 4px; }
        .strength-bar { display: flex; gap: 3px; margin-top: 6px; }
        .strength-segment { height: 3px; flex: 1; border-radius: 2px; background: #1e2330; transition: background 0.3s; }
        .strength-label { font-size: 0.68rem; margin-top: 4px; font-family: 'IBM Plex Mono', monospace; }
        .alert-error { background: #2d1215; border: 1px solid #7f1d1d40; border-radius: 6px; padding: 0.75rem 1rem; font-size: 0.8rem; color: #f87171; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem; }
        .divider { border: none; border-top: 1px solid #1e2330; margin: 1.5rem 0; }
        .form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.75rem; }
        .btn-cancel { background: transparent; border: 1px solid #1e2330; color: #64748b; font-family: 'IBM Plex Sans', sans-serif; font-size: 0.82rem; font-weight: 500; padding: 0.6rem 1.2rem; border-radius: 6px; cursor: pointer; text-decoration: none; transition: all 0.15s; display: inline-flex; align-items: center; }
        .btn-cancel:hover { border-color: #334155; color: #94a3b8; background: #1a1f2e; }
        .btn-submit { background: #4ade80; color: #0a0f0d; font-family: 'IBM Plex Sans', sans-serif; font-size: 0.82rem; font-weight: 600; padding: 0.6rem 1.4rem; border-radius: 6px; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 0.4rem; transition: background 0.15s, box-shadow 0.15s, transform 0.1s; }
        .btn-submit:hover:not(:disabled) { background: #86efac; box-shadow: 0 0 20px #4ade8040; transform: translateY(-1px); }
        .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 560px) { .form-grid { grid-template-columns: 1fr; } .form-group.full { grid-column: 1; } }
      `}</style>

      <div className="shell">
        <header className="topbar">
          <span className="topbar-logo">SisLic · Admin</span>
          <span className="topbar-sep" />
          <span className="topbar-hint">Sistema de Licencias</span>
        </header>

        <main className="main">
          <nav className="breadcrumb">
            <Link href="/usuarios">Usuarios</Link>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Dar de alta</span>
          </nav>

          <div className="page-header">
            <p className="page-eyebrow">Gestión de usuarios</p>
            <h1 className="page-title">Dar de alta nuevo usuario</h1>
            <p className="page-subtitle">Completá los datos del nuevo usuario administrativo del sistema.</p>
          </div>

          <div className="form-card">
            {errors.general && (
              <div className="alert-error">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
                {errors.general}
              </div>
            )}

            <p className="form-section-title">Datos personales</p>
            <div className="form-grid">
              <div className="form-group">
                <label>Nombre <span className="required">*</span></label>
                <input type="text" placeholder="Ej: Juan" value={form.nombre} onChange={(e) => handleChange("nombre", e.target.value)} className={errors.nombre ? "err" : ""} />
                {errors.nombre && <span className="field-error">⚠ {errors.nombre}</span>}
              </div>
              <div className="form-group">
                <label>Apellido <span className="required">*</span></label>
                <input type="text" placeholder="Ej: García" value={form.apellido} onChange={(e) => handleChange("apellido", e.target.value)} className={errors.apellido ? "err" : ""} />
                {errors.apellido && <span className="field-error">⚠ {errors.apellido}</span>}
              </div>
            </div>

            <hr className="divider" />
            <p className="form-section-title">Datos de acceso</p>
            <div className="form-grid">
              <div className="form-group full">
                <label>Nombre de usuario <span className="required">*</span></label>
                <input type="text" placeholder="Ej: jgarcia" value={form.nombreUsuario} onChange={(e) => handleChange("nombreUsuario", e.target.value.toLowerCase().replace(/\s/g, ""))} className={errors.nombreUsuario ? "err" : ""} />
                {errors.nombreUsuario ? <span className="field-error">⚠ {errors.nombreUsuario}</span> : <span style={{ fontSize: "0.7rem", color: "#334155" }}>Debe ser único en el sistema. Solo minúsculas, sin espacios.</span>}
              </div>

              <div className="form-group">
                <label>Contraseña <span className="required">*</span></label>
                <div className="input-wrap">
                  <input type={mostrarContrasena ? "text" : "password"} placeholder="Mínimo 8 caracteres" value={form.contrasena} onChange={(e) => handleChange("contrasena", e.target.value)} className={errors.contrasena ? "err" : ""} style={{ paddingRight: "2.5rem" }} />
                  <button className="toggle-pass" onClick={() => setMostrarContrasena(!mostrarContrasena)} type="button">
                    {mostrarContrasena
                      ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                      : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                    }
                  </button>
                </div>
                {form.contrasena && (<>
                  <div className="strength-bar">{[1,2,3,4].map(i => <div key={i} className="strength-segment" style={{ background: i <= strengthLevel ? strengthColor : undefined }} />)}</div>
                  <span className="strength-label" style={{ color: strengthColor }}>{strengthLabel}</span>
                </>)}
                {errors.contrasena && <span className="field-error">⚠ {errors.contrasena}</span>}
              </div>

              <div className="form-group">
                <label>Confirmar contraseña <span className="required">*</span></label>
                <input type={mostrarContrasena ? "text" : "password"} placeholder="Repetí la contraseña" value={form.confirmarContrasena} onChange={(e) => handleChange("confirmarContrasena", e.target.value)} className={errors.confirmarContrasena ? "err" : ""} />
                {errors.confirmarContrasena && <span className="field-error">⚠ {errors.confirmarContrasena}</span>}
              </div>

              <div className="form-group full">
                <label>Rol <span className="required">*</span></label>
                <div className="select-wrap">
                  <select value={form.rol} onChange={(e) => handleChange("rol", e.target.value)} className={errors.rol ? "err" : ""}>
                    <option value="">Seleccioná un rol...</option>
                    {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
                {errors.rol && <span className="field-error">⚠ {errors.rol}</span>}
              </div>
            </div>

            <div className="form-actions">
              <Link href="/usuarios" className="btn-cancel">Cancelar</Link>
              <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
                {loading
                  ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ animation: "spin 1s linear infinite" }}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg> Guardando...</>
                  : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg> Dar de alta</>
                }
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
