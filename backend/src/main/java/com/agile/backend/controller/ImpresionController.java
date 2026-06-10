package com.agile.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.agile.backend.dto.ComprobantePagoDTO;
import com.agile.backend.dto.LicenciaImpresionDTO;
import com.agile.backend.service.ImpresionService;

@RestController
@RequestMapping("/api/impresion")
@CrossOrigin(origins = "http://localhost:3000") 
public class ImpresionController {

    @Autowired
    private ImpresionService impresionService;

    // Endpoint para imprimir el Carnet de Conducir
    @PostMapping("/licencia")
    public ResponseEntity<byte[]> descargarLicencia(
            @RequestBody LicenciaImpresionDTO dto,
            @RequestHeader(value = "X-Usuario", defaultValue = "Administrativo") String usuario) {
        
        // Llamamos al servicio que genera el PDF
        byte[] pdfBytes = impresionService.imprimirLicencia(dto, usuario);

        // Configuramos la respuesta para que el navegador entienda que es un archivo PDF descargable
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "carnet_licencia.pdf");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    // Endpoint para imprimir el Comprobante de Pago
    @PostMapping("/comprobante")
    public ResponseEntity<byte[]> descargarComprobante(
            @RequestBody ComprobantePagoDTO dto,
            @RequestHeader(value = "X-Usuario", defaultValue = "Administrativo") String usuario) {
        
        // Llamamos al servicio que genera el PDF
        byte[] pdfBytes = impresionService.imprimirComprobantePago(dto, usuario);

        // Configuramos la respuesta para que el navegador entienda que es un archivo PDF descargable
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "comprobante_pago.pdf");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}
