package com.agile.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CopiaLicenciaResponseDTO {

    private Long id;

    // Datos de la licencia original
    private Long licenciaOriginalId;
    private String numeroDocumento;
    private String nombreTitular;
    private String apellidoTitular;
    private String clase;
    private LocalDate fechaEmisionOriginal;
    private LocalDate fechaVencimiento;
    private String observaciones;

    // Datos de la copia
    private Integer numeroCopia;   // 2=duplicado, 3=triplicado, etc.
    private String descripcionCopia; // "Duplicado", "Triplicado", etc.
    private String motivo;
    private String usuarioTramite;
    private LocalDateTime fechaTramite;
    private Integer costoTotal;    // siempre 50
}
