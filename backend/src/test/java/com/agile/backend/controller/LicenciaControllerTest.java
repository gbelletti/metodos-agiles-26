
package com.agile.backend.controller;

import com.agile.backend.dto.LicenciaResponseDTO;
import com.agile.backend.service.LicenciaService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(LicenciaController.class)
class LicenciaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LicenciaService service;

    private LicenciaResponseDTO crearDTORespuesta() {
        LicenciaResponseDTO dto = new LicenciaResponseDTO();
        dto.setId(1L);
        dto.setNombreTitular("Juan");
        dto.setApellidoTitular("Pérez");
        dto.setNumeroDocumento("12345678");
        dto.setClase("B");
        dto.setFechaEmision(LocalDate.of(2026, 1, 15));
        dto.setFechaVencimiento(LocalDate.of(2027, 1, 15));
        dto.setCostoTotal(50);
        dto.setObservaciones("Ninguna");
        return dto;
    }

    @Test
    void listarVigentes_conParametros_devuelveLista() throws Exception {
        when(service.listarVigentesPorCriterios("Juan", "Pérez", "A", "+", true))
                .thenReturn(List.of(crearDTORespuesta()));

        mockMvc.perform(get("/api/licencias/vigentes")
                .param("nombre", "Juan")
                .param("apellido", "Pérez")
                .param("grupoSanguineo", "A")
                .param("factorRh", "+")
                .param("donante", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nombreTitular").value("Juan"))
                .andExpect(jsonPath("$[0].apellidoTitular").value("Pérez"));
    }

    @Test
    void listarVigentes_sinParametros_devuelveListaVacia() throws Exception {
        when(service.listarVigentesPorCriterios(null, null, null, null, null))
                .thenReturn(List.of());

        mockMvc.perform(get("/api/licencias/vigentes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }
}