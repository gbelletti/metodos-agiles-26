"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

// ─── Tipos ──────────────────────────────────────────────────────────────────

interface Licencia {
  id: number;
  clase: string;
  fechaEmision: string;
  fechaVencimiento: string;
  observaciones?: string;
}

interface CopiaResponse {
  id: number;
  licenciaOriginalId: number;
  nombreTitular: string;
  apellidoTitular: string;
  numeroDocumento: string;
  clase: string;
  numeroCopia: number;
  descripcionCopia: string;
  motivo: string;
  usuarioTramite: string;
  fechaTramite: string;
  costoTotal: number;
}

const MOTIVOS = ["EXTRAVÍO", "ROBO", "DETERIORO"] as const;
type Motivo = (typeof MOTIVOS)[number];

// ─── Componente principal ────────────────────────────────────────────────────

export default function EmitirCopiaPage() {
  const { usuario } = useAuth();

  const [dni, setDni] = useState("");
  const [licencias, setLicencias] = useState<Licencia[]>([]);
  const [licenciaSeleccionada, setLicenciaSeleccionada] =
    useState<Licencia | null>(null);
  const [motivo, setMotivo] = useState<Motivo>("EXTRAVÍO");
  const [errorBusqueda, setErrorBusqueda] = useState("");
  const [errorEmision, setErrorEmision] = useState("");
  const [resultado, setResultado] = useState<CopiaResponse | null>(null);
  const [isPending, startTransition] = useTransition();

  // ── Buscar licencias del titular por DNI ──────────────────────────────────
  function buscarLicencias() {
    if (!dni.trim()) return;
    setErrorBusqueda("");
    setLicencias([]);
    setLicenciaSeleccionada(null);
    setErrorEmision("");

    startTransition(async () => {
      try {
        const res = await fetch(
          `${API_URL}/licencias/titular/${dni}`
        );
        if (!res.ok) {
          setErrorBusqueda("No se encontraron licencias para ese DNI.");
          return;
        }
        const data: Licencia[] = await res.json();
        if (data.length === 0) {
          setErrorBusqueda("El titular no tiene licencias emitidas.");
          return;
        }
        setLicencias(data);
      } catch {
        setErrorBusqueda("Error al conectar con el servidor.");
      }
    });
  }

  // ── Emitir la copia ───────────────────────────────────────────────────────
  function emitirCopia() {
    if (!licenciaSeleccionada || !usuario) return;
    setErrorEmision("");

    startTransition(async () => {
      try {
        const res = await fetch(`${API_URL}/copias`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            licenciaId: licenciaSeleccionada.id,
            motivo,
            nombreUsuario: usuario.nombreUsuario,
          }),
        });
        if (res.ok) {
          const data: CopiaResponse = await res.json();
          setResultado(data);
        } else {
          const msg = await res.text();
          setErrorEmision(msg || "Error al emitir la copia.");
        }
      } catch {
        setErrorEmision("Error al conectar con el servidor.");
      }
    });
  }

  // ── Pantalla de éxito ─────────────────────────────────────────────────────
  if (resultado) {
    return (
      <main className="min-h-screen bg-[#0d0f14] flex items-center justify-center p-6">
        <div className="bg-[#0d0f14] p-10 max-w-md w-full text-center space-y-4">
          <div className="w-18 h-18 mx-auto">
            <img src="/success.png" alt="Éxito" />
          </div>
          <h2 className="text-3xl font-semibold text-green-400">
            {resultado.descripcionCopia} emitido con éxito
          </h2>
          <p className="text-slate-300 text-sm">
            Clase{" "}
            <span className="font-bold text-white">{resultado.clase}</span> para{" "}
            {resultado.apellidoTitular}, {resultado.nombreTitular}
          </p>
          <p className="text-slate-400 text-sm">
            Motivo: <span className="text-white">{resultado.motivo}</span>
          </p>
          <p className="text-slate-400 text-sm">
            Trámite realizado por:{" "}
            <span className="text-white">{resultado.usuarioTramite}</span>
          </p>
          <div className="border border-slate-600 rounded-xl p-4 mt-2 space-y-1 text-left">
            <p className="text-sm text-slate-300 flex justify-between">
              <span>Costo fijo:</span>
              <span className="text-white font-medium">
                $ {resultado.costoTotal}
              </span>
            </p>
          </div>
          <Link href="/">
            <button className="mt-4 px-5 py-2.5 text-sm font-medium bg-[#0d0f14] border border-white hover:border-green-700 text-white rounded-lg hover:bg-green-700 transition-colors">
              Volver al inicio
            </button>
          </Link>
        </div>
      </main>
    );
  }

  // ── Formulario principal ──────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#0d0f14] py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Encabezado */}
        <div className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-200">
            Registro de licencias
          </p>
          <h1 className="text-4xl font-bold text-white">Emitir copia</h1>
          <p className="text-slate-400 text-sm">
            Duplicado, triplicado, etc. por extravío, robo o deterioro del
            carnet original.
          </p>
        </div>

        {/* Paso 1: Buscar titular ─────────────────────────────────────────── */}
        <section className="bg-[#0d0f14] rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold uppercase tracking-wide text-slate-200">
            1. Buscar titular
          </h2>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Número de DNI
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Ej: 38500000"
                value={dni}
                onChange={(e) => {
                  setDni(e.target.value);
                  setLicencias([]);
                  setLicenciaSeleccionada(null);
                  setErrorBusqueda("");
                }}
                onKeyDown={(e) => e.key === "Enter" && buscarLicencias()}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 bg-[#0d0f14]"
              />
            </div>
            <button
              type="button"
              onClick={buscarLicencias}
              disabled={isPending || !dni.trim()}
              className="self-end bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? "Buscando…" : "Buscar"}
            </button>
          </div>

          {errorBusqueda && (
            <p className="text-sm text-red-400">{errorBusqueda}</p>
          )}
        </section>

        {/* Paso 2: Seleccionar licencia ───────────────────────────────────── */}
        {licencias.length > 0 && (
          <section className="bg-[#0d0f14] rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold uppercase tracking-wide text-slate-200">
              2. Seleccionar licencia
            </h2>
            <p className="text-sm text-slate-400">
              Seleccioná la licencia original de la que se emitirá la copia.
            </p>

            <div className="space-y-2">
              {licencias.map((lic) => (
                <button
                  key={lic.id}
                  type="button"
                  onClick={() => setLicenciaSeleccionada(lic)}
                  className={`w-full text-left border rounded-xl px-4 py-3 transition-colors ${
                    licenciaSeleccionada?.id === lic.id
                      ? "border-green-500 bg-green-900/20"
                      : "border-slate-600 hover:border-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-sm">
                      Clase {lic.clase}
                    </span>
                    <span className="text-slate-400 text-xs">
                      ID #{lic.id}
                    </span>
                  </div>
                  <div className="text-slate-400 text-xs mt-1 flex gap-4">
                    <span>Emisión: {lic.fechaEmision}</span>
                    <span>Vence: {lic.fechaVencimiento}</span>
                  </div>
                  {lic.observaciones && (
                    <p className="text-slate-500 text-xs mt-1 truncate">
                      Obs: {lic.observaciones}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Paso 3: Motivo y confirmación ──────────────────────────────────── */}
        {licenciaSeleccionada && (
          <section className="bg-[#0d0f14] rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold uppercase tracking-wide text-slate-200">
              3. Motivo de la copia
            </h2>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Motivo
              </label>
              <select
                value={motivo}
                onChange={(e) => setMotivo(e.target.value as Motivo)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-slate-400 bg-[#0d0f14]"
              >
                {MOTIVOS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Desglose de costo */}
            <div className="mt-2 p-5 border border-slate-300 rounded-xl bg-[#0d0f14] space-y-2">
              <h3 className="text-lg font-semibold text-white mb-2">
                Desglose de costo
              </h3>
              <div className="flex justify-between items-center border-t border-slate-600 pt-3">
                <label className="text-base text-white font-bold">
                  Costo fijo de copia:
                </label>
                <span className="text-green-400 font-bold">$ 50</span>
              </div>
              <p className="text-xs text-slate-500">
                El costo de la copia es fijo independientemente de la clase o
                vigencia.
              </p>
            </div>

            {errorEmision && (
              <div className="bg-red-300 rounded-xl p-4">
                <p className="text-sm text-red-600">{errorEmision}</p>
              </div>
            )}
          </section>
        )}

        {/* Botones ─────────────────────────────────────────────────────────── */}
        <div className="flex justify-end gap-3 pb-6">
          <Link
            href="/"
            className="px-5 py-2.5 text-sm font-medium text-white border hover:bg-red-700 hover:border-red-700 border-slate-300 rounded-lg transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="button"
            onClick={emitirCopia}
            disabled={isPending || !licenciaSeleccionada}
            className="px-5 py-2.5 text-sm font-medium bg-[#0d0f14] border border-white hover:border-green-700 text-white rounded-lg hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? "Emitiendo…" : "Emitir copia"}
          </button>
        </div>
      </div>
    </main>
  );
}