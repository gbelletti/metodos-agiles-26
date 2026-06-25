package com.agile.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class RenovacionResponseDTO {

    // Datos de la nueva licencia emitida
    private Long id;
    private Long licenciaAnteriorId;
    private String numeroDocumento;
    private String nombreTitular;
    private String apellidoTitular;
    private String clase;
    private LocalDate fechaEmision;
    private LocalDate fechaVencimiento;
    private Integer costoTotal;

    // Datos del trámite
    private String usuarioTramite;
    private LocalDateTime fechaTramite;
}
