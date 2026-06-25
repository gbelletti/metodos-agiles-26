"use client";

import Form from "next/form";
import Link from "next/link";
import { useState, useTransition, useEffect } from "react";
import {
  imprimirLicencia,
  imprimirComprobante,
  LicenciaImpresionDTO,
  ComprobantePagoDTO,
} from "./impresionService";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

type ClaseLicencia = "A" | "B" | "C" | "D" | "E" | "F" | "G";

interface Titular {
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  direccion: string;
  grupoSanguineo: string;
  factorRh: string;
  esDonante: boolean;
  tieneLicenciaB: boolean;
  antiguedadLicenciaB?: number;
}

// esto se usa para definir la configuracion de cada clase de licencia
const CONFIG_CLASES: Record<
  ClaseLicencia,
  { tipo: string; edadMin: number; profesional: boolean }
> = {
  A: {
    tipo: "A: Ciclomotores, motocicletas y triciclos motorizados",
    edadMin: 17,
    profesional: false,
  },
  B: {
    tipo: "B: Automóviles y camionetas con acoplado",
    edadMin: 17,
    profesional: false,
  },
  C: {
    tipo: "C: Camiones sin acoplado",
    edadMin: 21,
    profesional: true,
  },
  D: {
    tipo: "D: Transporte de pasajeros, emergencia y seguridad",
    edadMin: 21,
    profesional: true,
  },
  E: {
    tipo: "E: Camiones articulados o con acoplado",
    edadMin: 21,
    profesional: true,
  },
  F: {
    tipo: "F: Automotores adaptados para discapacitados",
    edadMin: 17,
    profesional: false,
  },
  G: {
    tipo: "G: Tractores y maquinaria agrícola",
    edadMin: 17,
    profesional: false,
  },
};

const TIPOS_DOCUMENTO = [
  { value: "DNI", label: "DNI" },
  { value: "PASAPORTE", label: "Pasaporte" },
  { value: "LC", label: "Libreta Cívica" },
  { value: "LE", label: "Libreta de Enrolamiento" },
];

const GRUPOS_SANGUINEOS = ["A", "B", "AB", "O"];

function calcularEdad(fechaNacimiento: string): number {
  const hoy = new Date();
  const nac = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
  return edad;
}

function validarEmision(titular: Titular, clase: ClaseLicencia): string[] {
  const errores: string[] = [];
  const config = CONFIG_CLASES[clase];
  const edad = calcularEdad(titular.fechaNacimiento);

  if (edad < config.edadMin) {
    errores.push(
      `La clase ${clase} requiere un mínimo de ${config.edadMin} años. El titular tiene ${edad}.`,
    );
  }

  if (config.profesional) {
    if (!titular.tieneLicenciaB) {
      errores.push(
        "Las licencias profesionales (C, D, E) requieren licencia clase B vigente.",
      );
    } else if ((titular.antiguedadLicenciaB ?? 0) < 12) {
      errores.push(
        "La licencia clase B debe tener al menos 1 año de antigüedad.",
      );
    }
    if (edad > 65) {
      errores.push(
        "Para primera licencia profesional, el titular no puede superar los 65 años.",
      );
    }
  }

  return errores;
}

export default function EmitirLicenciaPage() {
  const [form, setForm] = useState({
    tipoDocumento: "DNI",
    numeroDocumento: "",
    apellido: "",
    nombre: "",
    fechaNacimiento: "",
    direccion: "",
    grupoSanguineo: "",
    factorRh: "",
    donante: "",
    tieneLicenciaB: false,
    antiguedadLicenciaB: 0,
  });

  const [claseSeleccionada, setClaseSeleccionada] =
    useState<ClaseLicencia>("B");
  const [observaciones, setObservaciones] = useState("");
  const [erroresValidacion, setErroresValidacion] = useState<string[]>([]);
  const [exito, setExito] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [costoTotal, setCostoTotal] = useState(0);
  const [vigencia, setVigencia] = useState(5);
  const [numeroLicenciaEmitida, setNumeroLicenciaEmitida] = useState<number>(0);
  const [numeroTramiteEmitido, setNumeroTramiteEmitido] = useState<number>(0);

  const obtenerCosto = async (clase: string, vigencia: number) => {
    if (!clase || !vigencia) return;
    try {
      const respuesta = await fetch(
        `${API_URL}/costos/calcular?clase=${clase}&vigenciaAnios=${vigencia}`,
      );
      if (respuesta.ok) {
        const total = await respuesta.json();
        setCostoTotal(total);
      }
    } catch (error) {
      console.error("Error al calcular el costo:", error);
    }
  };

  useEffect(() => {
    if (form.fechaNacimiento) {
      const edad = calcularEdad(form.fechaNacimiento);
      let vigenciaCalculada = 5;

      if (edad < 21) {
        vigenciaCalculada = form.tieneLicenciaB ? 3 : 1;
      } else if (edad <= 46) {
        vigenciaCalculada = 5;
      } else if (edad <= 60) {
        vigenciaCalculada = 4;
      } else if (edad <= 70) {
        vigenciaCalculada = 3;
      } else {
        vigenciaCalculada = 1;
      }

      setVigencia(vigenciaCalculada);
      obtenerCosto(claseSeleccionada, vigenciaCalculada);
    } else {
      setCostoTotal(0);
    }
  }, [claseSeleccionada, form.fechaNacimiento, form.tieneLicenciaB]);

  function handleChange(field: string, value: any) {
    setForm((f) => ({ ...f, [field]: value }));
    setErroresValidacion([]);
  }

  async function handleEmitir() {
    const erroresCampos: string[] = [];
    if (!form.tipoDocumento)
      erroresCampos.push("El tipo de documento es obligatorio.");
    if (!form.numeroDocumento.trim())
      erroresCampos.push("El número de documento es obligatorio.");
    if (!form.apellido.trim())
      erroresCampos.push("El apellido es obligatorio.");
    if (!form.nombre.trim()) erroresCampos.push("El nombre es obligatorio.");
    if (!form.fechaNacimiento)
      erroresCampos.push("La fecha de nacimiento es obligatoria.");
    if (!form.direccion.trim())
      erroresCampos.push("La dirección es obligatoria.");
    if (!form.grupoSanguineo)
      erroresCampos.push("El grupo sanguíneo es obligatorio.");
    if (!form.factorRh) erroresCampos.push("El factor RH es obligatorio.");
    if (!form.donante)
      erroresCampos.push("El campo donante de órganos es obligatorio.");

    if (erroresCampos.length > 0) {
      setErroresValidacion(erroresCampos);
      return;
    }

    const titularParaValidar: Titular = {
      nombre: form.nombre,
      apellido: form.apellido,
      fechaNacimiento: form.fechaNacimiento,
      direccion: form.direccion,
      grupoSanguineo: form.grupoSanguineo,
      factorRh: form.factorRh,
      esDonante: form.donante === "true",
      tieneLicenciaB: form.tieneLicenciaB,
      antiguedadLicenciaB: form.antiguedadLicenciaB,
    };

    const erroresReglas = validarEmision(titularParaValidar, claseSeleccionada);
    if (erroresReglas.length > 0) {
      setErroresValidacion(erroresReglas);
      return;
    }

    setErroresValidacion([]);

    startTransition(async () => {
      try {
        // esto se usa para realizar el alta del titular en el backend
        const resTitular = await fetch(
          `${API_URL}/titulares`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tipoDocumento: form.tipoDocumento,
              numeroDocumento: form.numeroDocumento,
              apellido: form.apellido,
              nombre: form.nombre,
              fechaNacimiento: form.fechaNacimiento,
              direccion: form.direccion,
              claseSolicitada: claseSeleccionada,
              grupoSanguineo: form.grupoSanguineo,
              factorRh: form.factorRh,
              donante: form.donante === "true",
            }),
          },
        );

        if (resTitular.status === 409) {
          setErroresValidacion([
            "Ya existe un titular con ese tipo y número de documento.",
          ]);
          return;
        }

        if (!resTitular.ok) {
          const msg = await resTitular.text();
          setErroresValidacion([msg || "Error al registrar el titular."]);
          return;
        }

        // esto se usa para realizar la emision de la licencia una vez creado el titular
        const resLicencia = await fetch(
          `${API_URL}/licencias`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              numeroDocumento: form.numeroDocumento,
              clase: claseSeleccionada,
              observaciones,
            }),
          },
        );

        if (resLicencia.ok) {
          setExito(true);
        } else {
          const body = await resLicencia.json();
          setErroresValidacion([
            body.mensaje ?? "Error al emitir la licencia.",
          ]);
        }
      } catch {
        setErroresValidacion(["Error al conectar con el servidor."]);
      }
    });
  }

  const handleClicImprimirLicencia = async () => {
    const fechaActual = new Date();
    const fechaVenc = new Date();
    fechaVenc.setFullYear(fechaActual.getFullYear() + vigencia);

    const datosLicencia: LicenciaImpresionDTO = {
      numeroLicencia: numeroLicenciaEmitida,
      nombre: form.nombre,
      apellido: form.apellido,
      tipoDocumento: form.tipoDocumento,
      numeroDocumento: form.numeroDocumento,
      fechaNacimiento: form.fechaNacimiento,
      clasesHabilitadas: claseSeleccionada,
      fechaEmision: fechaActual.toISOString().split("T")[0],
      fechaVencimiento: fechaVenc.toISOString().split("T")[0],
      grupoSanguineo: form.grupoSanguineo,
      factorRh: form.factorRh,
      donanteOrganos: form.donante === "true",
      observaciones: observaciones || "Ninguna",
    };

    const usuarioLogueado = "Administrativo_Prueba";
    await imprimirLicencia(datosLicencia, usuarioLogueado);
  };

  const handleClicImprimirComprobante = async () => {
    const datosComprobante: ComprobantePagoDTO = {
      numeroTramite: numeroTramiteEmitido,
      nombre: form.nombre,
      apellido: form.apellido,
      clase: claseSeleccionada,
      costoLicencia: costoTotal - 8,
      costoAdministrativo: 8,
      totalAbonar: costoTotal,
    };

    const usuarioLogueado = "Administrativo_Prueba";
    await imprimirComprobante(datosComprobante, usuarioLogueado);
  };

  if (exito) {
    return (
      <main className="min-h-screen bg-[#0d0f14] flex items-center justify-center p-6">
        <div className="bg-[#0d0f14] p-10 max-w-md w-full text-center space-y-4">
          <div className="w-18 h-18 mx-auto">
            <img src="/success.png" alt="Éxito"></img>
          </div>
          <h2 className="text-3xl font-semibold text-green-400">
            Licencia emitida con éxito
          </h2>
          <p className="text-slate-100 text-md">
            Clase{" "}
            <span className="font-bold text-white">{claseSeleccionada}</span>{" "}
            para {form.apellido}, {form.nombre}
          </p>

          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={handleClicImprimirLicencia}
              className="w-full px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Imprimir Carnet de Licencia
            </button>

            <button
              onClick={handleClicImprimirComprobante}
              className="w-full px-5 py-2.5 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Imprimir Comprobante de Pago
            </button>

            <Link href="/">
              <button
                type="button"
                className="w-full px-5 py-2.5 text-sm font-medium bg-[#0d0f14] border border-white hover:border-green-700 text-white rounded-lg hover:bg-green-700 transition-colors mt-2"
              >
                Volver al inicio
              </button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0d0f14] py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-200">
            Registro de licencias
          </p>
          <h1 className="text-4xl font-bold text-white">
            Emitir licencia de conducir
          </h1>
        </div>

        <Form action="" className="space-y-6">
          {/* esto se usa para agrupar los datos de identificacion del titular */}
          <section className="bg-[#111318] rounded-2xl border border-slate-700 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold uppercase tracking-wide text-slate-200">
              Datos del Titular
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-200">
                  Tipo de documento
                </label>
                <select
                  value={form.tipoDocumento}
                  onChange={(e) =>
                    handleChange("tipoDocumento", e.target.value)
                  }
                  className="w-full border border-slate-600 rounded-lg px-3 py-2 text-sm text-white bg-[#0d0f14] focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  {TIPOS_DOCUMENTO.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-200">
                  Número de documento
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Ej: 12345678"
                  value={form.numeroDocumento}
                  onChange={(e) =>
                    handleChange("numeroDocumento", e.target.value)
                  }
                  className="w-full border border-slate-600 rounded-lg px-3 py-2 text-sm text-white bg-[#0d0f14] focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-200">
                  Apellido
                </label>
                <input
                  type="text"
                  placeholder="Ej: García"
                  value={form.apellido}
                  onChange={(e) => handleChange("apellido", e.target.value)}
                  className="w-full border border-slate-600 rounded-lg px-3 py-2 text-sm text-white bg-[#0d0f14] focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-200">
                  Nombre
                </label>
                <input
                  type="text"
                  placeholder="Ej: Juan"
                  value={form.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                  className="w-full border border-slate-600 rounded-lg px-3 py-2 text-sm text-white bg-[#0d0f14] focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-200">
                  Fecha de nacimiento
                </label>
                <input
                  type="date"
                  value={form.fechaNacimiento}
                  onChange={(e) =>
                    handleChange("fechaNacimiento", e.target.value)
                  }
                  className="w-full border border-slate-600 rounded-lg px-3 py-2 text-sm text-white bg-[#0d0f14] focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-200">
                  Dirección
                </label>
                <input
                  type="text"
                  placeholder="Ej: Av. Galicia 1200"
                  value={form.direccion}
                  onChange={(e) => handleChange("direccion", e.target.value)}
                  className="w-full border border-slate-600 rounded-lg px-3 py-2 text-sm text-white bg-[#0d0f14] focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>
            </div>
          </section>

          {/* esto se usa para agrupar los datos medicos del titular */}
          <section className="bg-[#111318] rounded-2xl border border-slate-700 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold uppercase tracking-wide text-slate-200">
              Datos Médicos
            </h2>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-200">
                  Grupo sanguíneo
                </label>
                <select
                  value={form.grupoSanguineo}
                  onChange={(e) =>
                    handleChange("grupoSanguineo", e.target.value)
                  }
                  className="w-full border border-slate-600 rounded-lg px-3 py-2 text-sm text-white bg-[#0d0f14] focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  <option value="">Seleccioná...</option>
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
                  value={form.factorRh}
                  onChange={(e) => handleChange("factorRh", e.target.value)}
                  className="w-full border border-slate-600 rounded-lg px-3 py-2 text-sm text-white bg-[#0d0f14] focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  <option value="">Seleccioná...</option>
                  <option value="+">Positivo (+)</option>
                  <option value="-">Negativo (-)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-200">
                  Donante de órganos
                </label>
                <select
                  value={form.donante}
                  onChange={(e) => handleChange("donante", e.target.value)}
                  className="w-full border border-slate-600 rounded-lg px-3 py-2 text-sm text-white bg-[#0d0f14] focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  <option value="">Seleccioná...</option>
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
          </section>

          {/* de acuerdo al tipo de clase seleccionado, esto se usa para renderizar campos de profesional */}
          <section className="bg-[#111318] rounded-2xl border border-slate-700 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold uppercase tracking-wide text-slate-200">
              Licencia
            </h2>

            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-200">
                  Clase de licencia
                </label>
                <select
                  value={claseSeleccionada}
                  onChange={(e) => {
                    setClaseSeleccionada(e.target.value as ClaseLicencia);
                    setErroresValidacion([]);
                  }}
                  className="w-full border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-slate-400 bg-[#0d0f14]"
                >
                  {(Object.keys(CONFIG_CLASES) as ClaseLicencia[]).map(
                    (clase) => (
                      <option key={clase} value={clase}>
                        {CONFIG_CLASES[clase].tipo}
                      </option>
                    ),
                  )}
                </select>
                <p className="text-sm text-slate-400 mt-1 text-right">
                  Edad mínima requerida:{" "}
                  {CONFIG_CLASES[claseSeleccionada].edadMin} años
                  {CONFIG_CLASES[claseSeleccionada].profesional && (
                    <span className="ml-2 text-amber-500 font-medium">
                      Requiere clase B con antigüedad mayor o igual a 1 año
                    </span>
                  )}
                </p>
              </div>

              {CONFIG_CLASES[claseSeleccionada].profesional && (
                <div className="grid grid-cols-2 gap-4 p-4 border border-slate-600 rounded-xl bg-[#0d0f14]">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-slate-200">
                      ¿Posee licencia clase B vigente?
                    </label>
                    <select
                      value={form.tieneLicenciaB ? "true" : "false"}
                      onChange={(e) =>
                        handleChange(
                          "tieneLicenciaB",
                          e.target.value === "true",
                        )
                      }
                      className="w-full border border-slate-600 rounded-lg px-3 py-2 text-sm text-white bg-[#0d0f14] focus:outline-none focus:ring-2 focus:ring-slate-400"
                    >
                      <option value="false">No</option>
                      <option value="true">Sí</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-slate-200">
                      Antigüedad licencia clase B (meses)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="Ej: 14"
                      value={form.antiguedadLicenciaB}
                      onChange={(e) =>
                        handleChange(
                          "antiguedadLicenciaB",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      className="w-full border border-slate-600 rounded-lg px-3 py-2 text-sm text-white bg-[#0d0f14] focus:outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-200">
                  Observaciones / limitaciones
                </label>
                <textarea
                  rows={3}
                  placeholder="Ej: Uso obligatorio de lentes correctivos. Restricción de conducción nocturna."
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  className="w-full border border-slate-600 rounded-lg px-3 py-2 text-sm text-white bg-[#0d0f14] placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
                />
              </div>
            </div>
          </section>

          {erroresValidacion.length > 0 && (
            <div className="bg-red-900 border border-red-700 rounded-xl p-4 space-y-1">
              {erroresValidacion.map((e, i) => (
                <p key={i} className="text-sm text-red-200">
                  {e}
                </p>
              ))}
            </div>
          )}

          <div className="mt-6 p-5 border border-slate-600 rounded-xl bg-[#111318] space-y-2">
            <h3 className="text-lg font-semibold text-white mb-2">
              Desglose de costo
            </h3>

            <div className="flex justify-between items-center">
              <label className="text-sm text-slate-300">Costo Base:</label>
              <input
                type="text"
                value={`$ ${costoTotal > 0 ? costoTotal - 8 : 0}`}
                readOnly
                disabled
                className="bg-transparent text-right text-white font-medium outline-none cursor-not-allowed"
              />
            </div>

            <div className="flex justify-between items-center">
              <label className="text-sm text-slate-300">
                Gastos administrativos:
              </label>
              <input
                type="text"
                value="$ 8"
                readOnly
                disabled
                className="bg-transparent text-right text-white font-medium outline-none cursor-not-allowed"
              />
            </div>

            <div className="flex justify-between items-center border-t border-slate-600 pt-3 mt-2">
              <label className="text-base text-white font-bold">
                Costo total a abonar:
              </label>
              <input
                type="text"
                value={`$ ${costoTotal}`}
                readOnly
                disabled
                className="bg-transparent text-right text-green-400 font-bold outline-none cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pb-6">
            <Link
              href="/"
              className="px-5 py-2.5 text-sm font-medium text-white border hover:bg-red-700 hover:border-red-700 border-slate-600 rounded-lg transition-colors"
            >
              Cancelar
            </Link>

            <button
              type="button"
              onClick={handleEmitir}
              disabled={isPending}
              className="px-5 py-2.5 text-sm font-medium bg-[#0d0f14] border border-white hover:border-green-700 text-white rounded-lg hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? "Procesando..." : "Emitir licencia"}
            </button>
          </div>
        </Form>
      </div>
    </main>
  );
}
