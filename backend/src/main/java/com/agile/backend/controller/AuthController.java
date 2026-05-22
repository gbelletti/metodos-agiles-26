package com.agile.backend.controller;

import com.agile.backend.dto.UsuarioResponseDTO;
import com.agile.backend.model.Usuario;
import com.agile.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UsuarioRepository repo;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest body) {
        Optional<Usuario> opt = repo.findByNombreUsuario(body.getNombreUsuario());
        if (opt.isEmpty() || !opt.get().getContrasena().equals(body.getContrasena())) {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }

        Usuario u = opt.get();
        UsuarioResponseDTO dto = new UsuarioResponseDTO();
        dto.setId(u.getId());
        dto.setNombre(u.getNombre());
        dto.setApellido(u.getApellido());
        dto.setNombreUsuario(u.getNombreUsuario());
        dto.setRol(u.getRol());

        return ResponseEntity.ok(dto);
    }

    // DTO interno solo para el body del login
    static class LoginRequest {
        private String nombreUsuario;
        private String contrasena;

        public String getNombreUsuario() { return nombreUsuario; }
        public void setNombreUsuario(String nombreUsuario) { this.nombreUsuario = nombreUsuario; }
        public String getContrasena() { return contrasena; }
        public void setContrasena(String contrasena) { this.contrasena = contrasena; }
    }
}
