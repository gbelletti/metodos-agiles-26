"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

const TIPOS_DOCUMENTO = [
  { value: "DNI", label: "DNI" },
  { value: "PASAPORTE", label: "Pasaporte" },
  { value: "LC", label: "Libreta Cívica" },
  { value: "LE", label: "Libreta de Enrolamiento" },
];

const CLASES = ["A", "B", "C", "D", "E", "F", "G"];

const GRUPOS_SANGUINEOS = ["A", "B", "AB", "O"];

interface FormData {
  tipoDocumento: string;
  numeroDocumento: string;
  apellido: string;
  nombre: string;
  fechaNacimiento: string;
  direccion: string;
  claseSolicitada: string;
  grupoSanguineo: string;
  factorRH: string;
  donante: string;
}

interface FormErrors {
  tipoDocumento?: string;
  numeroDocumento?: string;
  apellido?: string;
  nombre?: string;
  fechaNacimiento?: string;
  direccion?: string;
  claseSolicitada?: string;
  grupoSanguineo?: string;
  factorRH?: string;
  donante?: string;
  general?: string;
}

export default function AltaTitularPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    tipoDocumento: "",
    numeroDocumento: "",
    apellido: "",
    nombre: "",
    fechaNacimiento: "",
    direccion: "",
    claseSolicitada: "",
    grupoSanguineo: "",
    factorRH: "",
    donante: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [exitoso, setExitoso] = useState(false);

  function validar(): FormErrors {
    const e: FormErrors = {};
    if (!form.tipoDocumento)
      e.tipoDocumento = "El tipo de documento es obligatorio.";
    if (!form.numeroDocumento.trim())
      e.numeroDocumento = "El número de documento es obligatorio.";
    if (!form.apellido.trim()) e.apellido = "El apellido es obligatorio.";
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio.";
    if (!form.fechaNacimiento)
      e.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
    if (!form.direccion.trim()) e.direccion = "La dirección es obligatoria.";
    if (!form.claseSolicitada)
      e.claseSolicitada = "La clase solicitada es obligatoria.";
    if (!form.grupoSanguineo)
      e.grupoSanguineo = "El grupo sanguíneo es obligatorio.";
    if (!form.factorRH) e.factorRH = "El factor RH es obligatorio.";
    if (!form.donante) e.donante = "Este campo es obligatorio.";
    return e;
  }

  async function handleSubmit() {
    const e = validar();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/titulares`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipoDocumento: form.tipoDocumento,
          numeroDocumento: form.numeroDocumento,
          apellido: form.apellido,
          nombre: form.nombre,
          fechaNacimiento: form.fechaNacimiento,
          direccion: form.direccion,
          claseSolicitada: form.claseSolicitada,
          grupoSanguineo: form.grupoSanguineo,
          factorRh: form.factorRH === "true",
          donante: form.donante === "true",
        }),
      });
      if (res.status === 409) {
        setErrors({
          numeroDocumento:
            "Ya existe un titular con ese tipo y número de documento.",
        });
        return;
      }
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `Error ${res.status}`);
      }
      setExitoso(true);
      setTimeout(() => router.push("/titulares"), 2000);
    } catch (err: unknown) {
      setErrors({
        general: err instanceof Error ? err.message : "Error inesperado.",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0d0f14; color: #e2e8f0; font-family: 'IBM Plex Sans', sans-serif; min-height: 100vh; }
        .shell { min-height: 100vh; display: flex; flex-direction: column; }
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

        input, select {
          width: 100%; background: #0d0f14; border: 1px solid #1e2330; color: #e2e8f0;
          font-family: 'IBM Plex Sans', sans-serif; font-size: 0.85rem;
          padding: 0.6rem 0.85rem; border-radius: 6px; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s; appearance: none;
        }
        input::placeholder { color: #334155; }
        input:focus, select:focus { border-color: #4ade8060; box-shadow: 0 0 0 3px #4ade8012; }
        input.error-input, select.error-input { border-color: #f8717160; }
        input.error-input:focus, select.error-input:focus { border-color: #f87171; box-shadow: 0 0 0 3px #f8717112; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); cursor: pointer; }

        .select-wrap { position: relative; }
        .select-wrap::after { content: ''; position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 5px solid #475569; pointer-events: none; }
        select { padding-right: 2rem; cursor: pointer; }
        select option { background: #111318; }

        .field-error { font-size: 0.72rem; color: #f87171; display: flex; align-items: center; gap: 4px; }

        .alert-error { background: #2d1215; border: 1px solid #7f1d1d40; border-radius: 6px; padding: 0.75rem 1rem; font-size: 0.8rem; color: #f87171; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem; }

        .alert-success { background: #0d2818; border: 1px solid #4ade8040; border-radius: 6px; padding: 0.75rem 1rem; font-size: 0.8rem; color: #4ade80; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem; }

        .divider { border: none; border-top: 1px solid #1e2330; margin: 1.5rem 0; }

        .form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.75rem; }
        .btn-cancel { background: transparent; border: 1px solid #1e2330; color: #64748b; font-family: 'IBM Plex Sans', sans-serif; font-size: 0.82rem; font-weight: 500; padding: 0.6rem 1.2rem; border-radius: 6px; cursor: pointer; text-decoration: none; transition: all 0.15s; display: inline-flex; align-items: center; }
        .btn-cancel:hover { border-color: #334155; color: #94a3b8; background: #1a1f2e; }
        .btn-submit { background: #4ade80; color: #0a0f0d; font-family: 'IBM Plex Sans', sans-serif; font-size: 0.82rem; font-weight: 600; padding: 0.6rem 1.4rem; border-radius: 6px; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 0.4rem; transition: background 0.15s, box-shadow 0.15s, transform 0.1s; }
        .btn-submit:hover:not(:disabled) { background: #86efac; box-shadow: 0 0 20px #4ade8040; transform: translateY(-1px); }
        .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        @media (max-width: 560px) { .form-grid { grid-template-columns: 1fr; } .form-group.full { grid-column: 1; } }
      `}</style>

      <div className="shell">
        <main className="main">
          {/* Breadcrumb */}
          <nav className="breadcrumb">
            <Link href="/titulares">Titulares</Link>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Dar de alta</span>
          </nav>

          {/* Header */}
          <div className="page-header">
            <p className="page-eyebrow">Gestión de titulares</p>
            <h1 className="page-title">Dar de alta nuevo titular</h1>
            <p className="page-subtitle">
              Completá los datos del titular. Todos los campos son obligatorios.
            </p>
          </div>

          {/* Form */}
          <div className="form-card">
            {errors.general && (
              <div className="alert-error">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                  />
                </svg>
                {errors.general}
              </div>
            )}

            {exitoso && (
              <div className="alert-success">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                ¡Titular dado de alta correctamente! Redirigiendo...
              </div>
            )}

            {/* Sección: Documento */}
            <p className="form-section-title">Documento</p>
            <div className="form-grid">
              <div className="form-group">
                <label>
                  Tipo de documento <span className="required">*</span>
                </label>
                <div className="select-wrap">
                  <select
                    value={form.tipoDocumento}
                    onChange={(e) =>
                      handleChange("tipoDocumento", e.target.value)
                    }
                    className={errors.tipoDocumento ? "error-input" : ""}
                  >
                    <option value="">Seleccioná...</option>
                    {TIPOS_DOCUMENTO.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.tipoDocumento && (
                  <span className="field-error">⚠ {errors.tipoDocumento}</span>
                )}
              </div>

              <div className="form-group">
                <label>
                  Número de documento <span className="required">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: 12345678"
                  value={form.numeroDocumento}
                  onChange={(e) =>
                    handleChange("numeroDocumento", e.target.value)
                  }
                  className={errors.numeroDocumento ? "error-input" : ""}
                />
                {errors.numeroDocumento && (
                  <span className="field-error">
                    ⚠ {errors.numeroDocumento}
                  </span>
                )}
              </div>
            </div>

            <hr className="divider" />

            {/* Sección: Datos personales */}
            <p className="form-section-title">Datos personales</p>
            <div className="form-grid">
              <div className="form-group">
                <label>
                  Apellido <span className="required">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: García"
                  value={form.apellido}
                  onChange={(e) => handleChange("apellido", e.target.value)}
                  className={errors.apellido ? "error-input" : ""}
                />
                {errors.apellido && (
                  <span className="field-error">⚠ {errors.apellido}</span>
                )}
              </div>

              <div className="form-group">
                <label>
                  Nombre <span className="required">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Juan"
                  value={form.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                  className={errors.nombre ? "error-input" : ""}
                />
                {errors.nombre && (
                  <span className="field-error">⚠ {errors.nombre}</span>
                )}
              </div>

              <div className="form-group">
                <label>
                  Fecha de nacimiento <span className="required">*</span>
                </label>
                <input
                  type="date"
                  value={form.fechaNacimiento}
                  onChange={(e) =>
                    handleChange("fechaNacimiento", e.target.value)
                  }
                  className={errors.fechaNacimiento ? "error-input" : ""}
                />
                {errors.fechaNacimiento && (
                  <span className="field-error">
                    ⚠ {errors.fechaNacimiento}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>
                  Dirección <span className="required">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Av. Siempreviva 742"
                  value={form.direccion}
                  onChange={(e) => handleChange("direccion", e.target.value)}
                  className={errors.direccion ? "error-input" : ""}
                />
                {errors.direccion && (
                  <span className="field-error">⚠ {errors.direccion}</span>
                )}
              </div>
            </div>

            <hr className="divider" />

            {/* Sección: Datos médicos y licencia */}
            <p className="form-section-title">Licencia y datos médicos</p>
            <div className="form-grid">
              <div className="form-group">
                <label>
                  Clase solicitada <span className="required">*</span>
                </label>
                <div className="select-wrap">
                  <select
                    value={form.claseSolicitada}
                    onChange={(e) =>
                      handleChange("claseSolicitada", e.target.value)
                    }
                    className={errors.claseSolicitada ? "error-input" : ""}
                  >
                    <option value="">Seleccioná...</option>
                    {CLASES.map((c) => (
                      <option key={c} value={c}>
                        Clase {c}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.claseSolicitada && (
                  <span className="field-error">
                    ⚠ {errors.claseSolicitada}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>
                  Grupo sanguíneo <span className="required">*</span>
                </label>
                <div className="select-wrap">
                  <select
                    value={form.grupoSanguineo}
                    onChange={(e) =>
                      handleChange("grupoSanguineo", e.target.value)
                    }
                    className={errors.grupoSanguineo ? "error-input" : ""}
                  >
                    <option value="">Seleccioná...</option>
                    {GRUPOS_SANGUINEOS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.grupoSanguineo && (
                  <span className="field-error">⚠ {errors.grupoSanguineo}</span>
                )}
              </div>

              <div className="form-group">
                <label>
                  Factor RH <span className="required">*</span>
                </label>
                <div className="select-wrap">
                  <select
                    value={form.factorRH}
                    onChange={(e) => handleChange("factorRH", e.target.value)}
                    className={errors.factorRH ? "error-input" : ""}
                  >
                    <option value="">Seleccioná...</option>
                    <option value="true">Positivo (+)</option>
                    <option value="false">Negativo (-)</option>
                  </select>
                </div>
                {errors.factorRH && (
                  <span className="field-error">⚠ {errors.factorRH}</span>
                )}
              </div>

              <div className="form-group">
                <label>
                  Donante de órganos <span className="required">*</span>
                </label>
                <div className="select-wrap">
                  <select
                    value={form.donante}
                    onChange={(e) => handleChange("donante", e.target.value)}
                    className={errors.donante ? "error-input" : ""}
                  >
                    <option value="">Seleccioná...</option>
                    <option value="true">Sí</option>
                    <option value="false">No</option>
                  </select>
                </div>
                {errors.donante && (
                  <span className="field-error">⚠ {errors.donante}</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="form-actions">
              <Link href="/titulares" className="btn-cancel">
                Cancelar
              </Link>
              <button
                className="btn-submit"
                onClick={handleSubmit}
                disabled={loading || exitoso}
              >
                {loading ? (
                  <>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      style={{ animation: "spin 1s linear infinite" }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                      />
                    </svg>{" "}
                    Guardando...
                  </>
                ) : (
                  <>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>{" "}
                    Dar de alta
                  </>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
