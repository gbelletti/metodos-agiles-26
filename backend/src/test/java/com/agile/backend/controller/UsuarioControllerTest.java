package com.agile.backend.controller;

import com.agile.backend.dto.UsuarioResponseDTO;
import com.agile.backend.service.UsuarioService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UsuarioController.class)   // ← corregido: va la clase controlador, no el test
class UsuarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UsuarioService service;

    @Test
    void listarUsuarios_devuelveLista() throws Exception {
        UsuarioResponseDTO dto = new UsuarioResponseDTO();
        dto.setId(1L);
        dto.setNombreUsuario("test");

        when(service.listarTodos()).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/usuarios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nombreUsuario").value("test"));
    }

    @Test
    void listarUsuarios_vacio_devuelveListaVacia() throws Exception {
        when(service.listarTodos()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/usuarios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }
}