package com.agile.backend.controller;

import com.agile.backend.dto.UsuarioRequestDTO;
import com.agile.backend.dto.UsuarioResponseDTO;
import com.agile.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:3000")
public class UsuarioController {

    @Autowired
    private UsuarioService service;

    @GetMapping
    public List<UsuarioResponseDTO> listar() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> buscar(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody UsuarioRequestDTO dto) {
        try {
            return ResponseEntity.ok(service.crear(dto));
        } catch (RuntimeException e) {
            String msg = e.getMessage();
            if (msg.contains("nombre de usuario ya existe")) {
                return ResponseEntity.status(409).body(msg);
            }
            return ResponseEntity.badRequest().body(msg);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> modificar(@PathVariable Long id, @RequestBody UsuarioRequestDTO dto) {
        try {
            return service.modificar(id, dto)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            String msg = e.getMessage();
            if (msg.contains("nombre de usuario ya existe")) {
                return ResponseEntity.status(409).body(msg);
            }
            return ResponseEntity.badRequest().body(msg);
        }
    }
}