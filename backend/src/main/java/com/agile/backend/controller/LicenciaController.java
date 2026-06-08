package com.agile.backend.controller;

import com.agile.backend.dto.LicenciaRequestDTO;
import com.agile.backend.dto.LicenciaResponseDTO;
import com.agile.backend.service.LicenciaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/licencias")
@CrossOrigin(origins = "http://localhost:3000")
public class LicenciaController {

    private final LicenciaService service;

    public LicenciaController(LicenciaService service) {
        this.service = service;
    }

    // POST /api/licencias emitir licencia
    @PostMapping
    public ResponseEntity<?> emitir(@RequestBody LicenciaRequestDTO dto) {
        try {
            return ResponseEntity.ok(service.emitirLicencia(dto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET /api/licencias/titular/{dni} historial de licencias de un titular
    @GetMapping("/titular/{dni}")
    public ResponseEntity<?> listarPorTitular(@PathVariable String dni) {
        try {
            List<LicenciaResponseDTO> licencias = service.listarPorTitular(dni);
            return ResponseEntity.ok(licencias);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}