package com.agile.backend.service;

import com.agile.backend.dao.UsuarioDAO;
import com.agile.backend.dto.UsuarioRequestDTO;
import com.agile.backend.dto.UsuarioResponseDTO;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioDAO dao;

    @InjectMocks
    private UsuarioService service;

    @Test
    void crearUsuario_valido_guardaCorrectamente() {
        UsuarioRequestDTO dto = new UsuarioRequestDTO();
        dto.setNombre("Nuevo");
        dto.setApellido("Usuario");
        dto.setNombreUsuario("nuevo");
        dto.setContrasena("12345678");
        dto.setRol("ADMIN");

        UsuarioResponseDTO response = new UsuarioResponseDTO();
        when(dao.existeNombreUsuario("nuevo")).thenReturn(false);
        when(dao.crear(dto)).thenReturn(response);

        UsuarioResponseDTO result = service.crear(dto);
        assertNotNull(result);
        verify(dao).crear(dto);
    }

    @Test
    void crearUsuario_sinNombre_lanzaExcepcion() {
        UsuarioRequestDTO dto = new UsuarioRequestDTO();
        dto.setApellido("Usuario");
        dto.setNombreUsuario("nuevo");
        dto.setContrasena("12345678");

        assertThrows(RuntimeException.class, () -> service.crear(dto));
    }

    @Test
    void crearUsuario_passwordCorta_lanzaExcepcion() {
        UsuarioRequestDTO dto = new UsuarioRequestDTO();
        dto.setNombre("Nuevo");
        dto.setApellido("Usuario");
        dto.setNombreUsuario("nuevo");
        dto.setContrasena("123");

        assertThrows(RuntimeException.class, () -> service.crear(dto));
    }

    @Test
    void crearUsuario_nombreUsuarioDuplicado_lanzaExcepcion() {
        when(dao.existeNombreUsuario("nuevo")).thenReturn(true);
        UsuarioRequestDTO dto = new UsuarioRequestDTO();
        dto.setNombre("Nuevo");
        dto.setApellido("Usuario");
        dto.setNombreUsuario("nuevo");
        dto.setContrasena("12345678");

        assertThrows(RuntimeException.class, () -> service.crear(dto));
    }

    @Test
    void modificarUsuario_sinCambiarPassword_ok() {
        UsuarioRequestDTO dto = new UsuarioRequestDTO();
        dto.setNombre("Editado");
        dto.setApellido("Usuario");
        dto.setNombreUsuario("usuaexistente"); // mismo que el actual
        dto.setContrasena(null); // no cambia

        UsuarioResponseDTO existente = new UsuarioResponseDTO();
        existente.setId(1L);
        existente.setNombreUsuario("usuaexistente");

        when(dao.buscarPorId(1L)).thenReturn(Optional.of(existente));
        // Línea eliminada: no hace falta mockear existeNombreUsuario porque no se llama
        when(dao.modificar(1L, dto)).thenReturn(Optional.of(new UsuarioResponseDTO()));

        Optional<UsuarioResponseDTO> result = service.modificar(1L, dto);
        assertTrue(result.isPresent());
        verify(dao).modificar(1L, dto);
    }

    @Test
    void modificarUsuario_cambiarNombreADuplicado_lanzaExcepcion() {
        UsuarioRequestDTO dto = new UsuarioRequestDTO();
        dto.setNombre("Editado");
        dto.setApellido("Usuario");
        dto.setNombreUsuario("otroexistente");
        dto.setContrasena(null);

        UsuarioResponseDTO existente = new UsuarioResponseDTO();
        existente.setId(1L);
        existente.setNombreUsuario("usuaactual");

        when(dao.buscarPorId(1L)).thenReturn(Optional.of(existente));
        when(dao.existeNombreUsuario("otroexistente")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> service.modificar(1L, dto));
    }
}