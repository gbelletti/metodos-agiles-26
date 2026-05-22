package com.agile.backend.controller;

import com.agile.backend.dao.UsuarioDAO;
import com.agile.backend.dto.UsuarioRequestDTO;
import com.agile.backend.dto.UsuarioResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:3000")
public class UsuarioController {

    @Autowired
    private UsuarioDAO dao;

    @GetMapping
    public List<UsuarioResponseDTO> listar() {
        return dao.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> buscar(@PathVariable Long id) {
        return dao.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody UsuarioRequestDTO dto) {
        try {
            return ResponseEntity.ok(dao.crear(dto));
        } catch (RuntimeException e) {
            if ("USUARIO_DUPLICADO".equals(e.getMessage())) {
                return ResponseEntity.status(409).body("El nombre de usuario ya existe.");
            }
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> modificar(@PathVariable Long id, @RequestBody UsuarioRequestDTO dto) {
        try {
            return dao.modificar(id, dto)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            if ("USUARIO_DUPLICADO".equals(e.getMessage())) {
                return ResponseEntity.status(409).body("El nombre de usuario ya existe.");
            }
            return ResponseEntity.internalServerError().build();
        }
    }
}
