package com.agile.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class LicenciaRequestDTO {
    private String numeroDocumento;
    private String clase;
    private String observaciones;
}