package com.agile.backend.controller;

import com.agile.backend.dto.LicenciaResponseDTO;
import com.agile.backend.dto.RenovacionRequestDTO;
import com.agile.backend.dto.RenovacionResponseDTO;
import com.agile.backend.service.LicenciaService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(LicenciaController.class)
class LicenciaRenovacionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LicenciaService service;

    private RenovacionResponseDTO renovacionResponseMock() {
        RenovacionResponseDTO dto = new RenovacionResponseDTO();
        dto.setId(10L);
        dto.setLicenciaAnteriorId(1L);
        dto.setNumeroDocumento("12345678");
        dto.setNombreTitular("Ana");
        dto.setApellidoTitular("García");
        dto.setClase("B");
        dto.setFechaEmision(LocalDate.of(2026, 6, 15));
        dto.setFechaVencimiento(LocalDate.of(2031, 5, 15));
        dto.setCostoTotal(100);
        dto.setUsuarioTramite("admin");
        dto.setFechaTramite(LocalDateTime.of(2026, 6, 15, 10, 30));
        return dto;
    }

    @Test
    void renovar_devuelveOk() throws Exception {
        when(service.renovarLicencia(any(RenovacionRequestDTO.class))).thenReturn(renovacionResponseMock());

        String body = "{\"licenciaId\":1,\"nombreUsuario\":\"admin\"}";

        mockMvc.perform(post("/api/licencias/renovar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.licenciaAnteriorId").value(1))
                .andExpect(jsonPath("$.clase").value("B"))
                .andExpect(jsonPath("$.costoTotal").value(100))
                .andExpect(jsonPath("$.usuarioTramite").value("admin"));
    }

    @Test
    void renovar_errorDevuelveBadRequest() throws Exception {
        when(service.renovarLicencia(any(RenovacionRequestDTO.class)))
                .thenThrow(new RuntimeException("La licencia ya fue renovada o archivada, no se puede renovar."));

        String body = "{\"licenciaId\":1,\"nombreUsuario\":\"admin\"}";

        mockMvc.perform(post("/api/licencias/renovar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void listarVigentes_devuelveLista() throws Exception {
        LicenciaResponseDTO lic = new LicenciaResponseDTO();
        lic.setId(1L);
        lic.setClase("B");
        lic.setVigente(true);

        when(service.listarVigentesPorTitular("12345678")).thenReturn(List.of(lic));

        mockMvc.perform(get("/api/licencias/titular/12345678/vigentes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].clase").value("B"))
                .andExpect(jsonPath("$[0].vigente").value(true));
    }
}
