package com.agile.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.agile.backend.dao.TitularDAO;
import com.agile.backend.dto.TitularRequestDTO;
import com.agile.backend.dto.TitularResponseDTO;
import java.util.ArrayList;
import java.util.List;

@Service
public class TitularService {

    @Autowired
    private TitularDAO dao;

    public TitularResponseDTO darAltaTitular(TitularRequestDTO dto) {
        validarTitular(dto);
        return dao.crearTitular(dto);
    }

    private void validarTitular(TitularRequestDTO dto) {
        List<String> errores = new ArrayList<>();

        if (dto.getTipoDocumento() == null || dto.getTipoDocumento().isBlank())
            errores.add("El tipo de documento es obligatorio.");

        if (dto.getNumeroDocumento() == null || dto.getNumeroDocumento().isBlank())
            errores.add("El número de documento es obligatorio.");
        else if (dao.existeDocumento(dto.getNumeroDocumento(), dto.getTipoDocumento()))
            errores.add("Ya existe un titular con ese tipo y número de documento.");

        if (dto.getNombre() == null || dto.getNombre().isBlank())
            errores.add("El nombre es obligatorio.");

        if (dto.getApellido() == null || dto.getApellido().isBlank())
            errores.add("El apellido es obligatorio.");

        if (dto.getFechaNacimiento() == null)
            errores.add("La fecha de nacimiento es obligatoria.");

        if (dto.getDireccion() == null || dto.getDireccion().isBlank())
            errores.add("La dirección es obligatoria.");

        if (dto.getClaseSolicitada() == null || dto.getClaseSolicitada().isBlank())
            errores.add("La clase solicitada es obligatoria.");

        if (dto.getGrupoSanguineo() == null || dto.getGrupoSanguineo().isBlank())
            errores.add("El grupo sanguíneo es obligatorio.");

        if (dto.getFactorRh() == null)
            errores.add("El factor RH es obligatorio.");

        if (dto.getDonante() == null)
            errores.add("El campo donante es obligatorio.");

        if (!errores.isEmpty())
            throw new RuntimeException(String.join("; ", errores));
    }
}