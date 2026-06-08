package com.agile.backend.service;

import com.agile.backend.dto.CopiaLicenciaRequestDTO;
import com.agile.backend.dto.CopiaLicenciaResponseDTO;
import com.agile.backend.model.CopiaLicencia;
import com.agile.backend.model.Licencia;
import com.agile.backend.model.Usuario;
import com.agile.backend.repository.CopiaLicenciaRepository;
import com.agile.backend.repository.LicenciaRepository;
import com.agile.backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CopiaLicenciaService {

    private static final int COSTO_COPIA = 50;

    private final CopiaLicenciaRepository copiaRepository;
    private final LicenciaRepository licenciaRepository;
    private final UsuarioRepository usuarioRepository;

    public CopiaLicenciaService(
            CopiaLicenciaRepository copiaRepository,
            LicenciaRepository licenciaRepository,
            UsuarioRepository usuarioRepository
    ) {
        this.copiaRepository = copiaRepository;
        this.licenciaRepository = licenciaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public CopiaLicenciaResponseDTO emitirCopia(CopiaLicenciaRequestDTO dto) {

        // 1. Validar motivo
        String motivo = dto.getMotivo();
        if (motivo == null || (!motivo.equals("EXTRAVÍO") && !motivo.equals("ROBO") && !motivo.equals("DETERIORO"))) {
            throw new RuntimeException("El motivo debe ser EXTRAVÍO, ROBO o DETERIORO.");
        }

        // 2. Buscar licencia original
        Licencia licenciaOriginal = licenciaRepository.findById(dto.getLicenciaId())
                .orElseThrow(() -> new RuntimeException("No se encontró la licencia con ID: " + dto.getLicenciaId()));

        // 3. Buscar usuario administrativo
        Usuario usuario = usuarioRepository.findByNombreUsuario(dto.getNombreUsuario())
                .orElseThrow(() -> new RuntimeException("No se encontró el usuario: " + dto.getNombreUsuario()));

        // 4. Calcular número de copia automáticamente
        //    copias existentes de esa licencia + 2 (el primero es duplicado = 2)
        int copiasExistentes = copiaRepository.findByLicenciaOriginalId(licenciaOriginal.getId()).size();
        int numeroCopia = copiasExistentes + 2;

        // 5. Crear y guardar la copia
        CopiaLicencia copia = new CopiaLicencia();
        copia.setLicenciaOriginal(licenciaOriginal);
        copia.setNumeroCopia(numeroCopia);
        copia.setMotivo(motivo);
        copia.setUsuario(usuario);
        copia.setFechaTramite(LocalDateTime.now());
        copia.setCostoTotal(COSTO_COPIA);

        return toDTO(copiaRepository.save(copia));
    }

    public List<CopiaLicenciaResponseDTO> listarCopias(Long licenciaId) {
        // Verifica que la licencia exista
        licenciaRepository.findById(licenciaId)
                .orElseThrow(() -> new RuntimeException("No se encontró la licencia con ID: " + licenciaId));

        return copiaRepository.findByLicenciaOriginalId(licenciaId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private CopiaLicenciaResponseDTO toDTO(CopiaLicencia c) {
        Licencia original = c.getLicenciaOriginal();

        CopiaLicenciaResponseDTO dto = new CopiaLicenciaResponseDTO();
        dto.setId(c.getId());
        dto.setLicenciaOriginalId(original.getId());
        dto.setNumeroDocumento(original.getTitular().getNumeroDocumento());
        dto.setNombreTitular(original.getTitular().getNombre());
        dto.setApellidoTitular(original.getTitular().getApellido());
        dto.setClase(original.getClase());
        dto.setFechaEmisionOriginal(original.getFechaEmision());
        dto.setFechaVencimiento(original.getFechaVencimiento());
        dto.setObservaciones(original.getObservaciones());
        dto.setNumeroCopia(c.getNumeroCopia());
        dto.setDescripcionCopia(numeroCopiaToTexto(c.getNumeroCopia()));
        dto.setMotivo(c.getMotivo());
        dto.setUsuarioTramite(c.getUsuario().getNombreUsuario());
        dto.setFechaTramite(c.getFechaTramite());
        dto.setCostoTotal(c.getCostoTotal());
        return dto;
    }

    // 2 → "Duplicado", 3 → "Triplicado", 4 → "Cuadruplicado", etc.
    private String numeroCopiaToTexto(int numero) {
        return switch (numero) {
            case 2 -> "Duplicado";
            case 3 -> "Triplicado";
            case 4 -> "Cuadruplicado";
            case 5 -> "Quintuplicado";
            default -> "Copia N° " + numero;
        };
    }
}