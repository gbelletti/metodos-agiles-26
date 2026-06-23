package com.agile.backend.service;

import com.agile.backend.dto.LicenciaRequestDTO;
import com.agile.backend.dto.LicenciaResponseDTO;
import com.agile.backend.model.Licencia;
import com.agile.backend.model.Titular;
import com.agile.backend.repository.LicenciaRepository;
import com.agile.backend.repository.TitularRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LicenciaService {
    private static final Logger log = LoggerFactory.getLogger(LicenciaService.class);

    private final LicenciaRepository licenciaRepository;
    private final TitularRepository titularRepository;
    private final VigenciaService vigenciaService;
    private final CostoLicenciaService costoLicenciaService;

    public LicenciaService(
            LicenciaRepository licenciaRepository,
            TitularRepository titularRepository,
            VigenciaService vigenciaService,
            CostoLicenciaService costoLicenciaService
    ) {

        this.licenciaRepository = licenciaRepository;
        this.titularRepository = titularRepository;
        this.vigenciaService = vigenciaService;
        this.costoLicenciaService = costoLicenciaService;
    }

    public LicenciaResponseDTO emitirLicencia(LicenciaRequestDTO dto) {

        // 1. Buscar titular por DNI
        Titular titular = titularRepository.findByNumeroDocumento(dto.getNumeroDocumento())
                .orElseThrow(() -> new RuntimeException("No se encontró un titular con DNI: " + dto.getNumeroDocumento()));

        // 2. Determinar si es primera licencia
        boolean esPrimera = licenciaRepository.findByTitularId(titular.getId()).isEmpty();

        // 3. Calcular vigencia y fecha con VigenciaService
        LocalDate fechaEmision = vigenciaService.calcularFechaInicio();
        LocalDate fechaVencimiento = vigenciaService.calcularFechaVencimiento(
                titular.getFechaNacimiento(), esPrimera
        );
        int aniosVigencia = vigenciaService.calcularAniosVigencia(
                titular.getFechaNacimiento(), esPrimera
        );

        // 4. Calcular costo con CostoLicenciaService
        log.warn("DEBUG - clase: {} | vigencia: {}", dto.getClase(), aniosVigencia);
        Integer costoTotal = costoLicenciaService.calcularCosto(dto.getClase(), aniosVigencia);

        // 5. Crear y guardar la licencia
        Licencia licencia = new Licencia();
        licencia.setTitular(titular);
        licencia.setClase(dto.getClase());
        licencia.setFechaEmision(fechaEmision);
        licencia.setFechaVencimiento(fechaVencimiento);
        licencia.setCostoTotal(costoTotal);
        licencia.setObservaciones(dto.getObservaciones());

        return toDTO(licenciaRepository.save(licencia));
    }

    public List<LicenciaResponseDTO> listarPorTitular(String numeroDocumento) {
        Titular titular = titularRepository.findByNumeroDocumento(numeroDocumento)
                .orElseThrow(() -> new RuntimeException("No se encontró un titular con DNI: " + numeroDocumento));
        return licenciaRepository.findByTitularId(titular.getId())
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    private LicenciaResponseDTO toDTO(Licencia l) {
        LicenciaResponseDTO dto = new LicenciaResponseDTO();
        dto.setId(l.getId());
        dto.setNumeroDocumento(l.getTitular().getNumeroDocumento());
        dto.setNombreTitular(l.getTitular().getNombre());
        dto.setApellidoTitular(l.getTitular().getApellido());
        dto.setClase(l.getClase());
        dto.setFechaEmision(l.getFechaEmision());
        dto.setFechaVencimiento(l.getFechaVencimiento());
        dto.setCostoTotal(l.getCostoTotal());
        dto.setObservaciones(l.getObservaciones());
        return dto;
    }
        /**
         * Lista licencias vigentes (no vencidas) aplicando filtros opcionales.
         * Todos los parámetros pueden ser nulos para ignorar el filtro.
         */
        public List<LicenciaResponseDTO> listarVigentesPorCriterios(
                String nombre, String apellido, String grupoSanguineo, String factorRh, Boolean donante) {
        return licenciaRepository.findVigentesByCriterios(nombre, apellido, grupoSanguineo, factorRh, donante)
                .stream().map(this::toDTO).collect(Collectors.toList());
        }

        public List<LicenciaResponseDTO> listarVencidasPorCriterios(
        String nombre, String apellido, String grupoSanguineo, String factorRh, Boolean donante) {
        return licenciaRepository.findVencidasByCriterios(nombre, apellido, grupoSanguineo, factorRh, donante).stream().map(this::toDTO).collect(Collectors.toList());
}
}