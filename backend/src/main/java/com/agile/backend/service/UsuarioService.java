package com.agile.backend.service;

import com.agile.backend.dao.UsuarioDAO;
import com.agile.backend.dto.UsuarioRequestDTO;
import com.agile.backend.dto.UsuarioResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioDAO dao;

    public List<UsuarioResponseDTO> listarTodos() {
        return dao.listarTodos();
    }

    public Optional<UsuarioResponseDTO> buscarPorId(Long id) {
        return dao.buscarPorId(id);
    }

    public UsuarioResponseDTO crear(UsuarioRequestDTO dto) {
        validarUsuario(dto, null);
        // Forzar rol ADMIN
        dto.setRol("ADMIN");
        return dao.crear(dto);
    }

    public Optional<UsuarioResponseDTO> modificar(Long id, UsuarioRequestDTO dto) {
        validarUsuario(dto, id);
        // Mantener el rol existente (no se envía desde el front)
        return dao.modificar(id, dto);
    }

    private void validarUsuario(UsuarioRequestDTO dto, Long id) {
        List<String> errores = new ArrayList<>();

        if (dto.getNombre() == null || dto.getNombre().isBlank())
            errores.add("El nombre es obligatorio.");
        if (dto.getApellido() == null || dto.getApellido().isBlank())
            errores.add("El apellido es obligatorio.");
        if (dto.getNombreUsuario() == null || dto.getNombreUsuario().isBlank())
            errores.add("El nombre de usuario es obligatorio.");
        else {
            if (id == null) {
                if (dao.existeNombreUsuario(dto.getNombreUsuario())) {
                    errores.add("El nombre de usuario ya existe.");
                }
            } else {
                Optional<UsuarioResponseDTO> existente = dao.buscarPorId(id);
                if (existente.isPresent() &&
                    !existente.get().getNombreUsuario().equals(dto.getNombreUsuario()) &&
                    dao.existeNombreUsuario(dto.getNombreUsuario())) {
                    errores.add("El nombre de usuario ya está en uso.");
                }
            }
        }

        if (id == null) {
            if (dto.getContrasena() == null || dto.getContrasena().length() < 8) {
                errores.add("La contraseña debe tener al menos 8 caracteres.");
            }
        } else {
            if (dto.getContrasena() != null && dto.getContrasena().length() < 8) {
                errores.add("La contraseña debe tener al menos 8 caracteres.");
            }
        }

        // El rol ya no se valida, se asigna automáticamente

        if (!errores.isEmpty()) {
            throw new RuntimeException(String.join("; ", errores));
        }
    }
}