"use client";

import Form from "next/form";
import Link from "next/link";
import { useState, useTransition, useEffect } from "react";
import { imprimirLicencia, imprimirComprobante, LicenciaImpresionDTO, ComprobantePagoDTO } from './impresionService';

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
// diccionario con cada clase: qué es, mínimo de edad y si es profesional
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

  // cumple con edad?
  if (edad < config.edadMin) {
    errores.push(
      `La clase ${clase} requiere un mínimo ${config.edadMin} años. El titular tiene ${edad}.`,
    );
  }

  // si es profesional tiene B? si tiene B tiene la antiguedad? si tiene todo es menor de 65?
  if (config.profesional) {
    if (!titular.tieneLicenciaB) {
      errores.push(
        "Las licencias profesionales (C, D, E) requieren licencia clase B vigente.",
      );
      // (titular.antiguedadLicenciaB ?? 0) nulish, si es null o undefined lo toma como 0
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
  const [dni, setDni] = useState("");
  const [titular, setTitular] = useState<Titular | null>(null);
  const [claseSeleccionada, setClaseSeleccionada] =
    useState<ClaseLicencia>("B");
  const [observaciones, setObservaciones] = useState("");
  const [erroresValidacion, setErroresValidacion] = useState<string[]>([]);
  const [errorBusqueda, setErrorBusqueda] = useState("");
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
        `http://localhost:8080/api/costos/calcular?clase=${clase}&vigenciaAnios=${vigencia}`,
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
    if (titular) {
      const edad = calcularEdad(titular.fechaNacimiento);
      let vigenciaCalculada = 5;

      if (edad < 21) {
        vigenciaCalculada = titular.tieneLicenciaB ? 3 : 1;
      } else if (edad <= 46) {
        vigenciaCalculada = 5;
      } else if (edad <= 60) {
        vigenciaCalculada = 4;
      } else if (edad <= 70) {
        vigenciaCalculada = 3;
      } else {
        // Mayores de 70 años
        vigenciaCalculada = 1;
      }

      setVigencia(vigenciaCalculada);

      obtenerCosto(claseSeleccionada, vigenciaCalculada);
    } else {
      setCostoTotal(0);
    }
  }, [claseSeleccionada, titular]);

  async function buscarTitular() {
    if (!dni.trim()) return;
    setErrorBusqueda("");
    setTitular(null);
    setErroresValidacion([]);
    /*desactivar estos comentarios para hacer la prueba
    // Simulamos que la base de datos nos devolvió este titular (para )
    setTitular({
        nombre: "Juan",
        apellido: "Pérez",
        fechaNacimiento: "2000-05-15", // cambiar la edad para ver los diferentes costos: probar con 2000, 1970, 1960, 1950 y 2008
        direccion: "Calle Falsa 123",
        grupoSanguineo: "O",
        factorRh: "+",
        esDonante: true,
        tieneLicenciaB: true,
        antiguedadLicenciaB: 24
    });
    return; // es solamente para probar 
    */
    startTransition(async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/titulares/dni/${dni}`,
        );
        if (!res.ok) {
          setErrorBusqueda("No se encontró ningún titular con ese DNI.");
          return;
        }
        const data: Titular = await res.json();
        setTitular(data);
      } catch {
        setErrorBusqueda("Error al conectar con el servidor.");
      }
    });
  }

  async function handleEmitir() {
    if (!titular) return;

    const errores = validarEmision(titular, claseSeleccionada);
    if (errores.length > 0) {
      setErroresValidacion(errores);
      return;
    }
    setErroresValidacion([]);

    startTransition(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/licencias`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              numeroDocumento: dni,
              clase: claseSeleccionada,
              observaciones,
            }),
          },
        );
        if (res.ok) {
          setExito(true);
        } else {
          const body = await res.json();
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
    if (!titular) return;

    // Calculamos la fecha de vencimiento sumando la vigencia al año actual
    const fechaActual = new Date();
    const fechaVenc = new Date();
    fechaVenc.setFullYear(fechaActual.getFullYear() + vigencia);

    const datosLicencia: LicenciaImpresionDTO = {
      numeroLicencia: numeroLicenciaEmitida,
      nombre: titular.nombre,
      apellido: titular.apellido,
      tipoDocumento: "DNI",
      numeroDocumento: dni,
      fechaNacimiento: titular.fechaNacimiento,
      clasesHabilitadas: claseSeleccionada,
      fechaEmision: fechaActual.toISOString().split('T')[0],
      fechaVencimiento: fechaVenc.toISOString().split('T')[0],
      grupoSanguineo: titular.grupoSanguineo,
      factorRh: titular.factorRh,
      donanteOrganos: titular.esDonante,
      observaciones: observaciones || "Ninguna",
    };

    const usuarioLogueado = "Administrativo_Prueba"; // Más adelante vendrá del Login
    await imprimirLicencia(datosLicencia, usuarioLogueado);
  };

  const handleClicImprimirComprobante = async () => {
    if (!titular) return;

    const datosComprobante: ComprobantePagoDTO = {
      numeroTramite: numeroTramiteEmitido, // N° temporal generado al azar
      nombre: titular.nombre,
      apellido: titular.apellido,
      clase: claseSeleccionada,
      costoLicencia: costoTotal - 8, // Se restan los gastos administrativos al costo base [1, 2]
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
            para {titular?.apellido}, {titular?.nombre}
          </p>

          {}
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
        {/* Encabezado */}
        <div className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-200">
            Registro de licencias
          </p>
          <h1 className="text-4xl font-bold text-white">
            Emitir licencia de conducir
          </h1>
        </div>

        <Form action="" className="space-y-6">
          <section className="bg-[#0d0f14] rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold uppercase tracking-wide text-slate-200">
              Titular
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
                    setTitular(null);
                    setErrorBusqueda("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && buscarTitular()}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>
              <button
                type="button"
                onClick={buscarTitular}
                disabled={isPending || !dni.trim()}
                className="self-end bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {isPending ? "Buscando…" : "Buscar"}
              </button>
            </div>

            {errorBusqueda && (
              <p className="text-sm text-red-500">{errorBusqueda}</p>
            )}

            {titular && (
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <Campo
                  label="Apellido y nombre"
                  value={`${titular.apellido}, ${titular.nombre}`}
                  span
                />
                <Campo
                  label="Fecha de nacimiento"
                  value={titular.fechaNacimiento}
                />
                <Campo
                  label="Edad"
                  value={`${calcularEdad(titular.fechaNacimiento)} años`}
                />
                <Campo label="Dirección" value={titular.direccion} span />
                <Campo
                  label="Grupo sanguíneo"
                  value={`${titular.grupoSanguineo} ${titular.factorRh}`}
                />
                <Campo
                  label="Donante de órganos"
                  value={titular.esDonante ? "SÍ" : "NO"}
                />
              </div>
            )}
          </section>

          <section className="bg-[#0d0f14] rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold uppercase tracking-wide text-slate-200">
              Licencia
            </h2>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Clase de licencia
              </label>
              <select
                value={claseSeleccionada}
                onChange={(e) => {
                  setClaseSeleccionada(e.target.value as ClaseLicencia);
                  setErroresValidacion([]);
                }}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-slate-400 bg-[#0d0f14]"
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
                    Requiere clase B con ≥1 año
                  </span>
                )}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Observaciones / limitaciones
              </label>
              <textarea
                rows={3}
                placeholder="Ej: Uso obligatorio de lentes correctivos. Restricción de conducción nocturna."
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
              />
            </div>
          </section>

          {erroresValidacion.length > 0 && (
            <div className="bg-red-300 rounded-xl p-4 space-y-1">
              {erroresValidacion.map((e, i) => (
                <p key={i} className="text-sm text-red-600">
                  {e}
                </p>
              ))}
            </div>
          )}

          {/* Desglose de Costos */}
          <div className="mt-6 p-5 border border-slate-300 rounded-xl bg-[#0d0f14] space-y-2">
            <h3 className="text-lg font-semibold text-white mb-2">
              Desglose de costo
            </h3>

            {/* Costo Base dinámico */}
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

            {/* Gastos Administrativos fijos */}
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

            {/* Costo Total */}
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
              className="px-5 py-2.5 text-sm font-medium text-white border hover:bg-red-700 hover:border-red-700  border-slate-300 rounded-lg transition-colors"
            >
              Cancelar
            </Link>

            <button
              type="button"
              onClick={handleEmitir}
              disabled={isPending || !titular}
              className="px-5 py-2.5 text-sm font-medium bg-[#0d0f14] border border-white hover:border-green-700 text-white rounded-lg hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? "Emitiendo…" : "Emitir licencia"}
            </button>
          </div>
        </Form>
      </div>
    </main>
  );
}

function Campo({
  label,
  value,
  span,
}: {
  label: string;
  value: string;
  span?: boolean;
}) {
  return (
    <div className={span ? "col-span-2" : ""}>
      <p className="text-sm text-slate-200 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-white">{value || "—"}</p>
    </div>
  );
}
