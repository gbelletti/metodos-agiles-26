
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export interface LicenciaImpresionDTO {
    numeroLicencia: number;
    nombre: string;
    apellido: string;
    tipoDocumento: string;
    numeroDocumento: string;
    fechaNacimiento: string; 
    clasesHabilitadas: string;
    fechaEmision: string;
    fechaVencimiento: string;
    grupoSanguineo: string;
    factorRh: string;
    donanteOrganos: boolean;
    observaciones: string;
}

export interface ComprobantePagoDTO {
    numeroTramite: number;
    nombre: string;
    apellido: string;
    clase: string;
    costoLicencia: number;
    costoAdministrativo: number;
    totalAbonar: number;
}

export const imprimirLicencia = async (datosLicencia: LicenciaImpresionDTO, usuario: string) => {
    try {
        const response = await fetch(`${API_URL}/impresion/licencia`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Usuario": usuario 
            },
            body: JSON.stringify(datosLicencia)
        });

        if (!response.ok) throw new Error("Error del servidor al generar el carnet");

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        link.href = url;
        link.download = "carnet_licencia.pdf";
        link.click();
        
        window.URL.revokeObjectURL(url);
        
    } catch (error) {
        console.error("Fallo la impresión de la licencia:", error);
        alert("Ocurrió un error al intentar imprimir la licencia. Por favor, intente nuevamente.");
    }
};

export const imprimirComprobante = async (datosComprobante: ComprobantePagoDTO, usuario: string) => {
    try {
        const response = await fetch(`${API_URL}/impresion/comprobante`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Usuario": usuario
            },
            body: JSON.stringify(datosComprobante)
        });

        if (!response.ok) throw new Error("Error del servidor al generar el comprobante");

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        link.href = url;
        link.download = "comprobante_pago.pdf";
        link.click();
        
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Fallo la impresión del comprobante:", error);
        alert("Ocurrió un error al intentar generar el comprobante de pago. Por favor, verifique la conexión e intente nuevamente.");
    }
};