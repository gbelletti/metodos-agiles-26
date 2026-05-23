package com.agile.backend.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.beans.factory.annotation.Autowired;
import com.agile.backend.service.TitularService;
import com.agile.backend.dto.TitularRequestDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

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

}
