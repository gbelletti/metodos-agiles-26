package com.agile.backend.controller;

import com.agile.backend.dto.VigenciaResponseDTO;
import com.agile.backend.service.VigenciaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/vigencia")
public class VigenciaController {

    private final VigenciaService vigenciaService;

    public VigenciaController(VigenciaService vigenciaService) {
        this.vigenciaService = vigenciaService;
    }

    /**
     * GET /api/vigencia/calcular?fechaNacimiento=1990-05-15&esPrimeraLicencia=true
     */
    @GetMapping("/calcular")
    public ResponseEntity<VigenciaResponseDTO> calcular(
            @RequestParam String fechaNacimiento,
            @RequestParam boolean esPrimeraLicencia) {

        LocalDate fechaNac = LocalDate.parse(fechaNacimiento);
        int anios = vigenciaService.calcularAniosVigencia(fechaNac, esPrimeraLicencia);
        LocalDate inicio = vigenciaService.calcularFechaInicio();
        LocalDate vencimiento = vigenciaService.calcularFechaVencimiento(fechaNac, esPrimeraLicencia);

        return ResponseEntity.ok(new VigenciaResponseDTO(inicio, vencimiento, anios));
    }
}
