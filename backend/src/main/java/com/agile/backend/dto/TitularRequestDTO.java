package com.agile.backend.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;


@Getter @Setter
public class TitularRequestDTO {
    private Long id;
    private String tipoDocumento;
    private String numeroDocumento;
    private String nombre;
    private String apellido;
    private LocalDate fechaNacimiento;
    private String direccion;
    private String claseSolicitada;
    private String grupoSanguineo;
    private String factorRh;
    private Boolean donante;
    

}
