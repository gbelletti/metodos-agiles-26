package com.agile.backend.controller;

import com.agile.backend.service.CostoLicenciaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/costos")
@CrossOrigin(origins = {"http://localhost:3000", "http://192.168.100.21:3000"})
public class CostoLicenciaController {

    private final CostoLicenciaService service;
    public CostoLicenciaController(CostoLicenciaService service) {
        this.service = service;
    }

    // Endpoint para probar el cálculo
    @GetMapping("/calcular")
    public ResponseEntity<Integer> calcularCosto(
            @RequestParam String clase, 
            @RequestParam Integer vigenciaAnios) {
        
        Integer costoTotal = service.calcularCosto(clase, vigenciaAnios);
        return ResponseEntity.ok(costoTotal);
    }

    // Endpoint para que el frontend envíe la actualización
    @PutMapping("/actualizar")
    public ResponseEntity<String> actualizarCosto(
            @RequestParam String clase, 
            @RequestParam Integer vigenciaAnios, 
            @RequestParam Integer nuevoPrecio) {
        
        service.actualizarCosto(clase, vigenciaAnios, nuevoPrecio);
        return ResponseEntity.ok("Costo actualizado correctamente en la base de datos");
    }
}
