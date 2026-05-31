package com.agile.backend.dto;

import java.time.LocalDate;

public class VigenciaResponseDTO {

    private LocalDate fechaInicio;
    private LocalDate fechaVencimiento;
    private int aniosVigencia;

    public VigenciaResponseDTO(LocalDate fechaInicio, LocalDate fechaVencimiento, int aniosVigencia) {
        this.fechaInicio = fechaInicio;
        this.fechaVencimiento = fechaVencimiento;
        this.aniosVigencia = aniosVigencia;
    }

    public LocalDate getFechaInicio() { return fechaInicio; }
    public LocalDate getFechaVencimiento() { return fechaVencimiento; }
    public int getAniosVigencia() { return aniosVigencia; }
}
