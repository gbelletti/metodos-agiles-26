package com.agile.backend.service;

import org.springframework.stereotype.Service;

import com.agile.backend.dto.ComprobantePagoDTO;
import com.agile.backend.dto.LicenciaImpresionDTO;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;

@Service
public class ImpresionService {

    public byte[] imprimirLicencia(LicenciaImpresionDTO dto, String usuarioLogueado) {
        if (dto == null) {
            throw new IllegalArgumentException("Los datos de la licencia no pueden estar vacíos.");
        }
        registrarAuditoriaImpresion("LICENCIA", dto.getNumeroLicencia(), usuarioLogueado);
        
        return generarPdfLicencia(dto);
    }

    public byte[] imprimirComprobantePago(ComprobantePagoDTO dto, String usuarioLogueado) {
        if (dto == null) {
            throw new IllegalArgumentException("Los datos del comprobante no pueden estar vacíos.");
        }
        registrarAuditoriaImpresion("COMPROBANTE", dto.getNumeroTramite(), usuarioLogueado);
        
        return generarPdfComprobante(dto);
    }

    // ---------------- MÉTODOS PARA GENERAR LOS PDF ---------------- //

    private byte[] generarPdfLicencia(LicenciaImpresionDTO dto) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();
            
            document.add(new Paragraph("--- CARNET DE CONDUCIR MUNICIPAL ---"));
            document.add(new Paragraph("N° de licencia: " + dto.getNumeroLicencia()));
            document.add(new Paragraph("Titular: " + dto.getApellido() + ", " + dto.getNombre()));
            document.add(new Paragraph("Documento: " + dto.getTipoDocumento() + " " + dto.getNumeroDocumento()));
            document.add(new Paragraph("Fecha de nacimiento: " + dto.getFechaNacimiento()));
            document.add(new Paragraph("Clase(s) habilitada(s): " + dto.getClasesHabilitadas()));
            document.add(new Paragraph("Emisión: " + dto.getFechaEmision() + " | Vencimiento: " + dto.getFechaVencimiento()));
            document.add(new Paragraph("Grupo sanguíneo y RH: " + dto.getGrupoSanguineo() + " " + dto.getFactorRh()));
            document.add(new Paragraph("Donante de órganos: " + (dto.isDonanteOrganos() ? "SI" : "NO")));
            
            String obs = dto.getObservaciones() != null && !dto.getObservaciones().isEmpty() ? dto.getObservaciones() : "Ninguna";
            document.add(new Paragraph("Observaciones: " + obs));

            document.close();
        } catch (DocumentException e) {
            throw new RuntimeException("Error al generar el PDF de la Licencia", e);
        }

        return out.toByteArray();
    }

    private byte[] generarPdfComprobante(ComprobantePagoDTO dto) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();
            
            document.add(new Paragraph("--- COMPROBANTE DE PAGO ---"));
            document.add(new Paragraph("N° de trámite: " + dto.getNumeroTramite()));
            document.add(new Paragraph("Titular: " + dto.getApellido() + ", " + dto.getNombre()));
            document.add(new Paragraph("Clase solicitada: " + dto.getClase()));
            document.add(new Paragraph("Costo base de la licencia: $" + dto.getCostoLicencia()));
            document.add(new Paragraph("Costo administrativo: $" + dto.getCostoAdministrativo()));
            document.add(new Paragraph("--------------------------------"));
            document.add(new Paragraph("TOTAL A ABONAR: $" + dto.getTotalAbonar()));

            document.close();
        } catch (DocumentException e) {
            throw new RuntimeException("Error al generar el PDF del Comprobante", e);
        }

        return out.toByteArray();
    }

    private void registrarAuditoriaImpresion(String tipoDocumento, Long idReferencia, String usuario) {
        LocalDateTime fechaHoraActual = LocalDateTime.now();
        System.out.println("AUDITORÍA: El usuario '" + usuario + "' imprimió un " + tipoDocumento + " (Ref: " + idReferencia + ") el " + fechaHoraActual);
    }
}
