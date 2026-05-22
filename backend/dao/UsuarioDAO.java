package com.agile.backend.dao;

import com.agile.backend.dto.UsuarioRequestDTO;
import com.agile.backend.dto.UsuarioResponseDTO;
import com.agile.backend.model.Usuario;
import com.agile.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class UsuarioDAO {

    @Autowired
    private UsuarioRepository repo;

    // Listar todos
    public List<UsuarioResponseDTO> listarTodos() {
        return repo.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Buscar por ID
    public Optional<UsuarioResponseDTO> buscarPorId(Long id) {
        return repo.findById(id).map(this::toDTO);
    }

    // Dar de alta
    public UsuarioResponseDTO crear(UsuarioRequestDTO dto) {
        if (repo.existsByNombreUsuario(dto.getNombreUsuario())) {
            throw new RuntimeException("USUARIO_DUPLICADO");
        }

        Usuario u = new Usuario();
        u.setNombre(dto.getNombre());
        u.setApellido(dto.getApellido());
        u.setNombreUsuario(dto.getNombreUsuario());
        u.setContrasena(dto.getContrasena());   // TODO: aplicar hash BCrypt
        u.setRol(dto.getRol());
        u.setFechaCreacion(LocalDateTime.now());

        if (dto.getCreadoPorId() != null) {
            repo.findById(dto.getCreadoPorId()).ifPresent(u::setCreadoPor);
        }

        return toDTO(repo.save(u));
    }

    // Modificar
    public Optional<UsuarioResponseDTO> modificar(Long id, UsuarioRequestDTO dto) {
        return repo.findById(id).map(u -> {
            // Si cambia el nombre de usuario, verificar que no exista
            if (!u.getNombreUsuario().equals(dto.getNombreUsuario())
                    && repo.existsByNombreUsuario(dto.getNombreUsuario())) {
                throw new RuntimeException("USUARIO_DUPLICADO");
            }

            u.setNombre(dto.getNombre());
            u.setApellido(dto.getApellido());
            u.setNombreUsuario(dto.getNombreUsuario());
            u.setRol(dto.getRol());

            // Solo actualiza contraseña si viene en el body
            if (dto.getContrasena() != null && !dto.getContrasena().isBlank()) {
                u.setContrasena(dto.getContrasena());  // TODO: aplicar hash BCrypt
            }

            return toDTO(repo.save(u));
        });
    }

    // Mapper entidad → DTO
    private UsuarioResponseDTO toDTO(Usuario u) {
        UsuarioResponseDTO dto = new UsuarioResponseDTO();
        dto.setId(u.getId());
        dto.setNombre(u.getNombre());
        dto.setApellido(u.getApellido());
        dto.setNombreUsuario(u.getNombreUsuario());
        dto.setRol(u.getRol());
        dto.setFechaCreacion(u.getFechaCreacion());
        if (u.getCreadoPor() != null) {
            dto.setCreadoPorNombre(u.getCreadoPor().getNombre() + " " + u.getCreadoPor().getApellido());
        }
        return dto;
    }
}
