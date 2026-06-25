package com.agile.backend.controller;

import com.agile.backend.dto.LicenciaRequestDTO;
import com.agile.backend.dto.LicenciaResponseDTO;
import com.agile.backend.service.LicenciaService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(LicenciaController.class)
class LicenciaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

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

    // --- TESTS DE LISTAR VIGENTES (INTACTOS) ---

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

    // --- TESTS DE EMITIR LICENCIA ---

    @Test
    void emitirLicencia_Endpoint_Exitoso() throws Exception {
        // esto se usa para comprobar el comportamiento del endpoint POST ante una emision correcta
        LicenciaRequestDTO dto = new LicenciaRequestDTO();
        dto.setNumeroDocumento("12345678");
        dto.setClase("B");

        LicenciaResponseDTO responseDTO = crearDTORespuesta();

        when(service.emitirLicencia(any(LicenciaRequestDTO.class))).thenReturn(responseDTO);

        mockMvc.perform(post("/api/licencias")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.numeroDocumento").value("12345678"))
                .andExpect(jsonPath("$.costoTotal").value(50));

        verify(service, times(1)).emitirLicencia(any(LicenciaRequestDTO.class));
    }

    // --- TESTS DE LISTAR VENCIDAS ---

    @Test
    void listarVencidas_Endpoint_Exitoso() throws Exception {
        // esto se usa para corroborar el mapeo de los parametros opcionales en el endpoint de vencidas
        LicenciaResponseDTO responseDTO = crearDTORespuesta();
        responseDTO.setFechaVencimiento(LocalDate.now().minusDays(5));

        when(service.listarVencidasPorCriterios("Juan", null, null, null, null))
                .thenReturn(List.of(responseDTO));

        mockMvc.perform(get("/api/licencias/vencidas")
                        .param("nombre", "Juan")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].apellidoTitular").value("Pérez"));

        verify(service, times(1)).listarVencidasPorCriterios("Juan", null, null, null, null);
    }
}