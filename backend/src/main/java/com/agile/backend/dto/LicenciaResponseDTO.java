package com.agile.backend.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter @Setter
public class LicenciaResponseDTO {
    private Long id;
    private String numeroDocumento;
    private String nombreTitular;
    private String apellidoTitular;
    private String clase;
    private LocalDate fechaEmision;
    private LocalDate fechaVencimiento;
    private Integer costoTotal;
    private String observaciones;
}