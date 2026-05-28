package com.agile.backend.controller;

import com.agile.backend.model.Usuario;
import com.agile.backend.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UsuarioRepository repo;

    @Test
    void loginExitoso_devuelveUsuario() throws Exception {
        Usuario usuario = new Usuario();
        usuario.setNombreUsuario("testuser");
        usuario.setContrasena("password123");
        usuario.setNombre("Test");
        usuario.setApellido("User");

        when(repo.findByNombreUsuario("testuser")).thenReturn(Optional.of(usuario));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"nombreUsuario\":\"testuser\",\"contrasena\":\"password123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombreUsuario").value("testuser"));
    }

    @Test
    void loginFallido_devuelve401() throws Exception {
        when(repo.findByNombreUsuario("testuser")).thenReturn(Optional.empty());

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"nombreUsuario\":\"testuser\",\"contrasena\":\"wrong\"}"))
                .andExpect(status().isUnauthorized());
    }
}