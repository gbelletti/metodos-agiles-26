package com.agile.backend.dao;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import com.agile.backend.repository.TitularRepository;
import com.agile.backend.dto.TitularRequestDTO;
import com.agile.backend.dto.TitularResponseDTO;
import com.agile.backend.model.Titular;

@Component
public class TitularDAO {
    @Autowired 
    private TitularRepository titularRepo;

    //Dar de alta titular
    public TitularResponseDTO crearTitular(TitularRequestDTO dto) {
       Titular t = new Titular();
       t.setNombre(dto.getNombre());
       t.setApellido(dto.getApellido());
       t.setFechaNacimiento(dto.getFechaNacimiento());
       t.setDireccion(dto.getDireccion());
       t.setClaseSolicitada(dto.getClaseSolicitada());
       t.setGrupoSanguineo(dto.getGrupoSanguineo());
       t.setFactorRh(dto.getFactorRh());
       t.setDonante(dto.getDonante());

       return toDTO(titularRepo.save(t));
    }

    public boolean existeDocumento(String numeroDocumento, String tipoDocumento) {
        return titularRepo.existsByNumeroDocumentoAndTipoDocumento(numeroDocumento, tipoDocumento);
    }

    //Mappear entidad a DTO
    private TitularResponseDTO toDTO(Titular t) {
        TitularResponseDTO dto = new TitularResponseDTO();
        dto.setId(t.getId());
        dto.setNombre(t.getNombre());
        dto.setApellido(t.getApellido());
        dto.setTipoDocumento(t.getTipoDocumento());
        dto.setNumeroDocumento(t.getNumeroDocumento());
        dto.setFechaNacimiento(t.getFechaNacimiento());
        dto.setDireccion(t.getDireccion());
        dto.setClaseSolicitada(t.getClaseSolicitada());
        dto.setGrupoSanguineo(t.getGrupoSanguineo());
        dto.setFactorRh(t.getFactorRh());
        dto.setDonante(t.getDonante());
        return dto;
    }
}
