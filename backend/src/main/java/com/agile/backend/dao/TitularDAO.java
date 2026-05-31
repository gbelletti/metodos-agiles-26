package com.agile.backend.dao;

import org.springframework.stereotype.Component;

import java.util.stream.Collectors;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import com.agile.backend.repository.TitularRepository;
import com.agile.backend.dto.TitularRequestDTO;
import com.agile.backend.dto.TitularResponseDTO;
import com.agile.backend.model.Titular;
import java.util.Optional;


@Component
public class TitularDAO {
    @Autowired 
    private TitularRepository titularRepo;

    //Dar de alta titular
    public TitularResponseDTO crearTitular(TitularRequestDTO dto) {
       Titular t = new Titular();
       t.setTipoDocumento(dto.getTipoDocumento());
       t.setNumeroDocumento(dto.getNumeroDocumento());
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

    //Listar titulares
    public List<TitularResponseDTO> listarTodos() {
    return titularRepo.findAll().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    public boolean eliminar(Long id) {
        if (!titularRepo.existsById(id)) return false;
        titularRepo.deleteById(id);
        return true;
    }

    public boolean existeDocumento(String numeroDocumento, String tipoDocumento) {
        return titularRepo.existsByNumeroDocumentoAndTipoDocumento(numeroDocumento, tipoDocumento);
    }

    public Optional<TitularResponseDTO> buscarPorId(Long id) {
        return titularRepo.findById(id).map(this::toDTO);
    }

    public Optional<TitularResponseDTO> modificar(Long id, TitularRequestDTO dto) {
    return titularRepo.findById(id).map(t -> {
        t.setTipoDocumento(dto.getTipoDocumento());
        t.setNumeroDocumento(dto.getNumeroDocumento());
        t.setApellido(dto.getApellido());
        t.setNombre(dto.getNombre());
        t.setFechaNacimiento(dto.getFechaNacimiento());
        t.setDireccion(dto.getDireccion());
        t.setClaseSolicitada(dto.getClaseSolicitada());
        t.setGrupoSanguineo(dto.getGrupoSanguineo());
        t.setFactorRh(dto.getFactorRh());
        t.setDonante(dto.getDonante());
        return toDTO(titularRepo.save(t));
        });
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

    public Optional<TitularResponseDTO> buscarPorDni(String numeroDocumento) {
    return titularRepo.findByNumeroDocumento(numeroDocumento).map(this::toDTO);
}
}
