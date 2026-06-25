"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useAuth } from "@/context/AuthContext";

// ─── Tipos ──────────────────────────────────────────────────────────────────

interface Licencia {
  id: number;
  clase: string;
  fechaEmision: string;
  fechaVencimiento: string;
  observaciones?: string;
  vigente?: boolean;
}

interface RenovacionResponse {
  id: number;
  licenciaAnteriorId: number;
  numeroDocumento: string;
  nombreTitular: string;
  apellidoTitular: string;
  clase: string;
  fechaEmision: string;
  fechaVencimiento: string;
  costoTotal: number;
  usuarioTramite: string;
  fechaTramite: string;
}

// ─── Componente principal ────────────────────────────────────────────────────

export default function RenovarLicenciaPage() {
  const { usuario } = useAuth();

  const [dni, setDni] = useState("");
  const [licencias, setLicencias] = useState<Licencia[]>([]);
  const [licenciaSeleccionada, setLicenciaSeleccionada] =
    useState<Licencia | null>(null);
  const [errorBusqueda, setErrorBusqueda] = useState("");
  const [errorRenovacion, setErrorRenovacion] = useState("");
  const [resultado, setResultado] = useState<RenovacionResponse | null>(null);
  const [isPending, startTransition] = useTransition();

  // ── Buscar licencias vigentes (renovables) del titular por DNI ────────────
  function buscarLicencias() {
    if (!dni.trim()) return;
    setErrorBusqueda("");
    setLicencias([]);
    setLicenciaSeleccionada(null);
    setErrorRenovacion("");

    startTransition(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/licencias/titular/${dni}/vigentes`
        );
        if (!res.ok) {
          setErrorBusqueda("No se encontraron licencias para ese DNI.");
          return;
        }
        const data: Licencia[] = await res.json();
        if (data.length === 0) {
          setErrorBusqueda("El titular no tiene licencias vigentes para renovar.");
          return;
        }
        setLicencias(data);
      } catch {
        setErrorBusqueda("Error al conectar con el servidor.");
      }
    });
  }

  // ── Renovar la licencia seleccionada ──────────────────────────────────────
  function renovarLicencia() {
    if (!licenciaSeleccionada || !usuario) return;
    setErrorRenovacion("");

    startTransition(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/licencias/renovar`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              licenciaId: licenciaSeleccionada.id,
              nombreUsuario: usuario.nombreUsuario,
            }),
          }
        );
        if (res.ok) {
          const data: RenovacionResponse = await res.json();
          setResultado(data);
        } else {
          const msg = await res.text();
          setErrorRenovacion(msg || "Error al renovar la licencia.");
        }
      } catch {
        setErrorRenovacion("Error al conectar con el servidor.");
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
            Licencia renovada con éxito
          </h2>
          <p className="text-slate-300 text-sm">
            Clase{" "}
            <span className="font-bold text-white">{resultado.clase}</span> para{" "}
            {resultado.apellidoTitular}, {resultado.nombreTitular}
          </p>
          <p className="text-slate-400 text-sm">
            Trámite realizado por:{" "}
            <span className="text-white">{resultado.usuarioTramite}</span>
          </p>
          <div className="border border-slate-600 rounded-xl p-4 mt-2 space-y-1 text-left">
            <p className="text-sm text-slate-300 flex justify-between">
              <span>Inicio de vigencia:</span>
              <span className="text-white font-medium">
                {resultado.fechaEmision}
              </span>
            </p>
            <p className="text-sm text-slate-300 flex justify-between">
              <span>Nuevo vencimiento:</span>
              <span className="text-white font-medium">
                {resultado.fechaVencimiento}
              </span>
            </p>
            <p className="text-sm text-slate-300 flex justify-between border-t border-slate-600 pt-2 mt-2">
              <span>Costo total:</span>
              <span className="text-green-400 font-bold">
                $ {resultado.costoTotal}
              </span>
            </p>
          </div>
          <p className="text-xs text-slate-500">
            La licencia anterior (ID #{resultado.licenciaAnteriorId}) fue
            archivada en el historial.
          </p>
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
          <h1 className="text-4xl font-bold text-white">Renovar licencia</h1>
          <p className="text-slate-400 text-sm">
            Emití una nueva licencia (vigente o vencida) recalculando la
            vigencia con la edad actual del titular. La anterior queda
            archivada.
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
              2. Seleccionar licencia a renovar
            </h2>

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
                    <span className="text-slate-400 text-xs">ID #{lic.id}</span>
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

        {/* Paso 3: Confirmación ───────────────────────────────────────────── */}
        {licenciaSeleccionada && (
          <section className="bg-[#0d0f14] rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold uppercase tracking-wide text-slate-200">
              3. Confirmar renovación
            </h2>

            <div className="mt-2 p-5 border border-slate-300 rounded-xl bg-[#0d0f14] space-y-2">
              <p className="text-sm text-slate-300">
                Se emitirá una nueva licencia{" "}
                <span className="text-white font-semibold">
                  clase {licenciaSeleccionada.clase}
                </span>{" "}
                con fecha de inicio de vigencia de hoy. La nueva vigencia y el
                costo se calculan automáticamente según la edad actual del
                titular.
              </p>
              <p className="text-xs text-slate-500">
                La licencia anterior (ID #{licenciaSeleccionada.id}) quedará
                archivada en el historial.
              </p>
            </div>

            {errorRenovacion && (
              <div className="bg-red-300 rounded-xl p-4">
                <p className="text-sm text-red-600">{errorRenovacion}</p>
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
            onClick={renovarLicencia}
            disabled={isPending || !licenciaSeleccionada}
            className="px-5 py-2.5 text-sm font-medium bg-[#0d0f14] border border-white hover:border-green-700 text-white rounded-lg hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? "Renovando…" : "Renovar licencia"}
          </button>
        </div>
      </div>
    </main>
  );
}
