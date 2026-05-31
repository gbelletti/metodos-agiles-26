package com.agile.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.agile.backend.dao.TitularDAO;
import com.agile.backend.dto.TitularRequestDTO;
import com.agile.backend.dto.TitularResponseDTO;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
public class TitularService {

    @Autowired
    private TitularDAO dao;

    public TitularResponseDTO darAltaTitular(TitularRequestDTO dto) {
        validarTitular(dto, null);
        return dao.crearTitular(dto);
    }

    public List<TitularResponseDTO> listarTitulares() {
        return dao.listarTodos();
    }

    public Optional<TitularResponseDTO> buscarPorId(Long id) {
        return dao.buscarPorId(id);
    }

    public Optional<TitularResponseDTO> modificar(Long id, TitularRequestDTO dto) {
        validarTitular(dto, id);
        return dao.modificar(id, dto);
    }

    public boolean eliminar(Long id) {
        return dao.eliminar(id);
    }

    private void validarTitular(TitularRequestDTO dto, Long id) {
        List<String> errores = new ArrayList<>();

        if (dto.getTipoDocumento() == null || dto.getTipoDocumento().isBlank())
            errores.add("El tipo de documento es obligatorio.");

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

        // Validar unicidad de documento
        if (id == null) {
            // Alta Titular
            if (dao.existeDocumento(dto.getNumeroDocumento(), dto.getTipoDocumento())) {
                errores.add("Ya existe un titular con ese tipo y número de documento.");
            }
        }else {
            // Modificación Titular
            Optional<TitularResponseDTO> existente = dao.buscarPorId(id);
            if (existente.isPresent()){
                boolean cambioDocumento = !existente.get().getNumeroDocumento().equals(dto.getNumeroDocumento()) || !existente.get().getTipoDocumento().equals(dto.getTipoDocumento()); 
                if (cambioDocumento && dao.existeDocumento(dto.getNumeroDocumento(), dto.getTipoDocumento())) {
                    errores.add("Ya existe un titular con ese tipo y número de documento.");
                }
            }
        }

        if (!errores.isEmpty())
            throw new RuntimeException(String.join("; ", errores));
    }
}