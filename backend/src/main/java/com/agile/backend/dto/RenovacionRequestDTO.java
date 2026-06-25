package com.agile.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class RenovacionRequestDTO {

    // ID de la licencia a renovar (la que quedará archivada)
    private Long licenciaId;

    // Nombre de usuario del administrativo que realiza el trámite
    private String nombreUsuario;
}
