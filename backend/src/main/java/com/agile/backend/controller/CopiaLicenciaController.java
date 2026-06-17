package com.agile.backend.controller;

import com.agile.backend.dto.CopiaLicenciaRequestDTO;
import com.agile.backend.dto.CopiaLicenciaResponseDTO;
import com.agile.backend.service.CopiaLicenciaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/copias")
@CrossOrigin(origins = "http://localhost:3000")
public class CopiaLicenciaController {

    private final CopiaLicenciaService service;

    public CopiaLicenciaController(CopiaLicenciaService service) {
        this.service = service;
    }

    // POST /api/copias -> emitir una copia de licencia
    @PostMapping
    public ResponseEntity<?> emitirCopia(@RequestBody CopiaLicenciaRequestDTO dto) {
        try {
            CopiaLicenciaResponseDTO response = service.emitirCopia(dto);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET /api/copias/licencia/{licenciaId} -> historial de copias de una licencia
    @GetMapping("/licencia/{licenciaId}")
    public ResponseEntity<?> listarCopias(@PathVariable Long licenciaId) {
        try {
            List<CopiaLicenciaResponseDTO> copias = service.listarCopias(licenciaId);
            return ResponseEntity.ok(copias);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
