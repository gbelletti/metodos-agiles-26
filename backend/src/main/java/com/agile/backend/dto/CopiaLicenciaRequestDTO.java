package com.agile.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CopiaLicenciaRequestDTO {

    // ID de la licencia original a copiar
    private Long licenciaId;

    // Motivo: EXTRAVÍO, ROBO o DETERIORO
    private String motivo;

    // Nombre de usuario del administrativo que realiza el trámite
    private String nombreUsuario;
}