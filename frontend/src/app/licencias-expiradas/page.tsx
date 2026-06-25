"use client";

import { useState, useCallback, useTransition } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

// ── Tipos ──────────────────────────────────────────────────────────────────────
interface LicenciaVencida {
  id: number;
  numeroDocumento: string;
  nombreTitular: string;
  apellidoTitular: string;
  clase: string;
  fechaEmision: string;
  fechaVencimiento: string;
  costoTotal: number;
  observaciones?: string;
}

interface Filtros {
  nombre: string;
  apellido: string;
  grupoSanguineo: string;
  factorRh: string;
  donante: string;
}

const GRUPOS_SANGUINEOS = ["A", "B", "AB", "O"];

// ── Helpers ───────────────────────────────────────────────────────────────────
function diasVencida(fechaVencimiento: string): number {
  const hoy = new Date();
  const venc = new Date(fechaVencimiento);
  return Math.floor((hoy.getTime() - venc.getTime()) / (1000 * 60 * 60 * 24));
}

function formatFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// ── Componente principal ───────────────────────────────────────────────────────
export default function LicenciasExpiradas() {
  const [filtros, setFiltros] = useState<Filtros>({
    nombre: "",
    apellido: "",
    grupoSanguineo: "",
    factorRh: "",
    donante: "",
  });
  const [resultados, setResultados] = useState<LicenciaVencida[] | null>(null);
  const [errores, setErrores] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  function handleFiltro(campo: keyof Filtros, valor: string) {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
    setResultados(null);
    setErrores([]);
  }

  const buscar = useCallback(() => {
    setErrores([]);
    startTransition(async () => {
      try {
        const params = new URLSearchParams();
        if (filtros.nombre) params.append("nombre", filtros.nombre);
        if (filtros.apellido) params.append("apellido", filtros.apellido);
        if (filtros.grupoSanguineo)
          params.append("grupoSanguineo", filtros.grupoSanguineo);
        if (filtros.factorRh) params.append("factorRh", filtros.factorRh);
        if (filtros.donante) params.append("donante", filtros.donante);

        const res = await fetch(
          `${API_URL}/licencias/vencidas?${params.toString()}`,
        );
        if (!res.ok) throw new Error();
        setResultados(await res.json());
      } catch {
        setErrores(["No se pudo conectar con el servidor."]);
      }
    });
  }, [filtros]);

  function limpiar() {
    setFiltros({
      nombre: "",
      apellido: "",
      grupoSanguineo: "",
      factorRh: "",
      donante: "",
    });
    setResultados(null);
    setErrores([]);
  }

  return (
    <main className="min-h-screen bg-[#0d0f14] py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* ── Encabezado ──────────────────────────────────────────────────── */}
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Registro de licencias
            </p>
            <h1 className="text-2xl font-bold text-white">
              Licencias vencidas
            </h1>
          </div>
          {resultados !== null && (
            <span className="text-sm text-slate-400">
              {resultados.length === 0
                ? "Sin resultados"
                : `${resultados.length} licencia${resultados.length !== 1 ? "s" : ""} encontrada${resultados.length !== 1 ? "s" : ""}`}
            </span>
          )}
        </div>

        {/* ── Filtros ─────────────────────────────────────────────────────── */}
        <section className="bg-[#111318] rounded-2xl border border-slate-700 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold uppercase tracking-wide text-slate-200">
            Filtros
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-200">
                Nombre
              </label>
              <input
                type="text"
                placeholder="Ej: Juan"
                value={filtros.nombre}
                onChange={(e) => handleFiltro("nombre", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && buscar()}
                className="w-full border border-slate-600 rounded-lg px-3 py-2 text-sm text-white bg-[#0d0f14] placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-200">
                Apellido
              </label>
              <input
                type="text"
                placeholder="Ej: García"
                value={filtros.apellido}
                onChange={(e) => handleFiltro("apellido", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && buscar()}
                className="w-full border border-slate-600 rounded-lg px-3 py-2 text-sm text-white bg-[#0d0f14] placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-200">
                Grupo sanguíneo
              </label>
              <select
                value={filtros.grupoSanguineo}
                onChange={(e) => handleFiltro("grupoSanguineo", e.target.value)}
                className="w-full border border-slate-600 rounded-lg px-3 py-2 text-sm text-white bg-[#0d0f14] focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                <option value="">Todos</option>
                {GRUPOS_SANGUINEOS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-200">
                Factor RH
              </label>
              <select
                value={filtros.factorRh}
                onChange={(e) => handleFiltro("factorRh", e.target.value)}
                className="w-full border border-slate-600 rounded-lg px-3 py-2 text-sm text-white bg-[#0d0f14] focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                <option value="">Todos</option>
                <option value="+">Positivo (+)</option>
                <option value="-">Negativo (-)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-sm font-medium text-slate-200">
                Donante de órganos
              </label>
              <select
                value={filtros.donante}
                onChange={(e) => handleFiltro("donante", e.target.value)}
                className="w-full border border-slate-600 rounded-lg px-3 py-2 text-sm text-white bg-[#0d0f14] focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                <option value="">Todos</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={limpiar}
              className="px-5 py-2.5 text-sm font-medium text-white border border-slate-600 rounded-lg hover:bg-red-700 hover:border-red-700 transition-colors"
            >
              Limpiar
            </button>
            <button
              type="button"
              onClick={buscar}
              disabled={isPending}
              className="px-5 py-2.5 text-sm font-medium bg-[#0d0f14] border border-white hover:border-green-700 text-white rounded-lg hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? "Buscando…" : "Buscar"}
            </button>
          </div>
        </section>

        {/* ── Errores ─────────────────────────────────────────────────────── */}
        {errores.length > 0 && (
          <div className="bg-red-900 border border-red-700 rounded-xl p-4 space-y-1">
            {errores.map((e, i) => (
              <p key={i} className="text-sm text-red-200">
                {e}
              </p>
            ))}
          </div>
        )}

        {/* ── Resultados ──────────────────────────────────────────────────── */}
        {resultados !== null && (
          <section className="bg-[#111318] rounded-2xl border border-slate-700 shadow-sm overflow-hidden">
            {resultados.length === 0 ? (
              <div className="py-16 text-center space-y-2">
                <p className="text-3xl">📋</p>
                <p className="text-sm font-medium text-slate-200">
                  No se encontraron licencias vencidas
                </p>
                <p className="text-xs text-slate-500">
                  Probá ajustando los filtros o dejándolos en blanco para ver
                  todas.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        DNI
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Titular
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Clase
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Emisión
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Vencimiento
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Vencida hace
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {resultados.map((lic) => {
                      const dias = diasVencida(lic.fechaVencimiento);
                      const badgeClass =
                        dias > 365
                          ? "bg-red-900 text-red-300 border border-red-700"
                          : dias > 90
                            ? "bg-orange-900 text-orange-300 border border-orange-700"
                            : "bg-amber-900 text-amber-300 border border-amber-700";

                      return (
                        <tr
                          key={lic.id}
                          className="hover:bg-[#0d0f14] transition-colors"
                        >
                          <td className="px-5 py-3.5 font-mono text-slate-300">
                            {lic.numeroDocumento}
                          </td>
                          <td className="px-5 py-3.5">
                            <p className="font-medium text-white">
                              {lic.apellidoTitular}, {lic.nombreTitular}
                            </p>
                            {lic.observaciones && (
                              <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">
                                {lic.observaciones}
                              </p>
                            )}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#0d0f14] border border-slate-600 text-slate-200 font-bold text-xs">
                              {lic.clase}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-slate-300">
                            {formatFecha(lic.fechaEmision)}
                          </td>
                          <td className="px-5 py-3.5 text-slate-300">
                            {formatFecha(lic.fechaVencimiento)}
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${badgeClass}`}
                            >
                              {dias === 1 ? "1 día" : `${dias} días`}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* ── Volver ──────────────────────────────────────────────────────── */}
        <div className="pb-6">
          <Link
            href="/"
            className="px-5 py-2.5 text-sm font-medium text-white border border-slate-600 rounded-lg hover:bg-red-700 hover:border-red-700 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
