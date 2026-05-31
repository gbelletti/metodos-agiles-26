package com.agile.backend.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.beans.factory.annotation.Autowired;
import com.agile.backend.service.TitularService;
import com.agile.backend.dto.TitularRequestDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.agile.backend.dto.TitularResponseDTO;
import java.util.List;

@RestController
@RequestMapping("/api/titulares")
@CrossOrigin(origins = "http://localhost:3000")

public class TitularController {

    @Autowired
    private TitularService service;

    @PostMapping
    public ResponseEntity<?> darAltaTitular(@RequestBody TitularRequestDTO dto) {
        try {
            return ResponseEntity.ok(service.darAltaTitular(dto));
        } catch (RuntimeException e) {
            String msg = e.getMessage();
            if (msg.contains("Ya existe un titular con ese tipo y número de documento")) {
                return ResponseEntity.status(409).body(msg);
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public List<TitularResponseDTO> listarTitulares() {
        return service.listarTitulares();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TitularResponseDTO> buscar(@PathVariable Long id) {
        return service.buscarPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> modificar(@PathVariable Long id, @RequestBody TitularRequestDTO dto) {
        try {
            return service.modificar(id, dto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            String msg = e.getMessage();
            if (msg.contains("Ya existe un titular")) {
                return ResponseEntity.status(409).body(msg);
            }
            return ResponseEntity.badRequest().body(msg);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        return service.eliminar(id)
            ? ResponseEntity.noContent().build()
            : ResponseEntity.notFound().build();
    }

    @GetMapping("/dni/{numeroDocumento}")
    public ResponseEntity<TitularResponseDTO> buscarPorDni(@PathVariable String numeroDocumento) {
        System.out.println("DEBUG - DNI recibido: '" + numeroDocumento + "' | Longitud: " + numeroDocumento.length());
        
        return service.buscarPorDni(numeroDocumento)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

}
