package com.agile.backend.service;
import com.agile.backend.dto.LicenciaImpresionDTO;
import com.agile.backend.dto.ComprobantePagoDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
public class ImpresionServiceTest {

    @Autowired
    private ImpresionService impresionService;

    @Test
    public void testImprimirLicencia_DebeRetornarPdfValido() {
        // 1. Preparamos los datos de prueba (Arrange)
        LicenciaImpresionDTO licencia = new LicenciaImpresionDTO();
        licencia.setNombre("Juan");
        licencia.setApellido("Pérez");
        licencia.setTipoDocumento("DNI");
        licencia.setNumeroDocumento("30123456");
        licencia.setClasesHabilitadas("B");
        licencia.setGrupoSanguineo("O");
        licencia.setFactorRh("+");
        
        // 2. Ejecutamos el método imprimirLicencia
       byte[] pdfGenerado = impresionService.imprimirLicencia(licencia, "Administrativo_Prueba");

        // 3. Verificamos que todo haya salido bien (Assert)
        assertNotNull(pdfGenerado, "El arreglo de bytes del PDF no debe ser nulo");
        assertTrue(pdfGenerado.length > 0, "El PDF generado debe contener información (tamaño mayor a 0)");
    }

    @Test
    public void testImprimirComprobante_DebeRetornarPdfValido() {
        // 1. Preparamos los datos
        ComprobantePagoDTO comprobante = new ComprobantePagoDTO();
        comprobante.setNumeroTramite(12345L);
        comprobante.setNombre("Juan");
        comprobante.setApellido("Pérez");
        comprobante.setClase("B");
        comprobante.setCostoLicencia(40.0);
        comprobante.setCostoAdministrativo(8.0);
        comprobante.setTotalAbonar(48.0);

        // 2. Ejecutamos el método imprimirComprobantePago
        byte[] pdfGenerado = impresionService.imprimirComprobantePago(comprobante, "Administrativo_Prueba");

        // 3. Verificamos
        assertNotNull(pdfGenerado, "El comprobante generado no debe ser nulo");
        assertTrue(pdfGenerado.length > 0, "El comprobante debe tener tamaño mayor a 0");
    }
}
