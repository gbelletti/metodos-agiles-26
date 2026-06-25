package com.agile.backend.service;

import com.agile.backend.dto.LicenciaRequestDTO;
import com.agile.backend.dto.LicenciaResponseDTO;
import com.agile.backend.dto.RenovacionRequestDTO;
import com.agile.backend.dto.RenovacionResponseDTO;
import com.agile.backend.model.Licencia;
import com.agile.backend.model.Titular;
import com.agile.backend.model.Usuario;
import com.agile.backend.repository.LicenciaRepository;
import com.agile.backend.repository.TitularRepository;
import com.agile.backend.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LicenciaService {
    private static final Logger log = LoggerFactory.getLogger(LicenciaService.class);

    private final LicenciaRepository licenciaRepository;
    private final TitularRepository titularRepository;
    private final UsuarioRepository usuarioRepository;
    private final VigenciaService vigenciaService;
    private final CostoLicenciaService costoLicenciaService;

    public LicenciaService(
            LicenciaRepository licenciaRepository,
            TitularRepository titularRepository,
            UsuarioRepository usuarioRepository,
            VigenciaService vigenciaService,
            CostoLicenciaService costoLicenciaService
    ) {

        this.licenciaRepository = licenciaRepository;
        this.titularRepository = titularRepository;
        this.usuarioRepository = usuarioRepository;
        this.vigenciaService = vigenciaService;
        this.costoLicenciaService = costoLicenciaService;
    }

    public LicenciaResponseDTO emitirLicencia(LicenciaRequestDTO dto) {

        // 1. Buscar titular por DNI
        Titular titular = titularRepository.findByNumeroDocumento(dto.getNumeroDocumento())
                .orElseThrow(() -> new RuntimeException("No se encontró un titular con DNI: " + dto.getNumeroDocumento()));

        // 2. Determinar si es primera licencia
        boolean esPrimera = licenciaRepository.findByTitularId(titular.getId()).isEmpty();

        // 3. Construir la licencia reutilizando el cálculo de vigencia y costo
        Licencia licencia = construirLicencia(titular, dto.getClase(), esPrimera);
        licencia.setObservaciones(dto.getObservaciones());

        return toDTO(licenciaRepository.save(licencia));
    }

    /**
     * Renueva una licencia existente: emite una nueva licencia con la edad actual del
     * titular y archiva la anterior. La nueva queda vigente y enlazada a la previa.
     */
    @Transactional
    public RenovacionResponseDTO renovarLicencia(RenovacionRequestDTO dto) {

        // 1. Buscar la licencia a renovar
        Licencia anterior = licenciaRepository.findById(dto.getLicenciaId())
                .orElseThrow(() -> new RuntimeException("No se encontró la licencia con ID: " + dto.getLicenciaId()));

        // 2. Solo se puede renovar la licencia activa (vigente o vencida, pero no archivada)
        if (Boolean.FALSE.equals(anterior.getVigente())) {
            throw new RuntimeException("La licencia ya fue renovada o archivada, no se puede renovar.");
        }

        // 3. Buscar usuario administrativo que realiza el trámite
        Usuario usuario = usuarioRepository.findByNombreUsuario(dto.getNombreUsuario())
                .orElseThrow(() -> new RuntimeException("No se encontró el usuario: " + dto.getNombreUsuario()));

        // 4. Construir la nueva licencia con la edad actual del titular (no es primera)
        //    y el mismo costo que una emisión para esa clase y vigencia.
        Titular titular = anterior.getTitular();
        Licencia nueva = construirLicencia(titular, anterior.getClase(), false);
        nueva.setObservaciones(anterior.getObservaciones());
        nueva.setVigente(true);
        nueva.setLicenciaAnterior(anterior);
        nueva.setUsuarioTramite(usuario);
        nueva.setFechaTramite(LocalDateTime.now());

        // 5. Archivar la licencia anterior
        anterior.setVigente(false);
        licenciaRepository.save(anterior);

        return toRenovacionDTO(licenciaRepository.save(nueva));
    }

    public List<LicenciaResponseDTO> listarPorTitular(String numeroDocumento) {
        Titular titular = titularRepository.findByNumeroDocumento(numeroDocumento)
                .orElseThrow(() -> new RuntimeException("No se encontró un titular con DNI: " + numeroDocumento));
        return licenciaRepository.findByTitularId(titular.getId())
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    /**
     * Lista las licencias vigentes (renovables) de un titular dado su DNI.
     */
    public List<LicenciaResponseDTO> listarVigentesPorTitular(String numeroDocumento) {
        Titular titular = titularRepository.findByNumeroDocumento(numeroDocumento)
                .orElseThrow(() -> new RuntimeException("No se encontró un titular con DNI: " + numeroDocumento));
        return licenciaRepository.findByTitularIdAndVigenteTrue(titular.getId())
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    /**
     * Construye (sin persistir) una licencia para el titular y clase dados, calculando
     * fecha de inicio, vencimiento y costo con la lógica compartida de emisión.
     * Reutilizado tanto por la emisión como por la renovación.
     */
    private Licencia construirLicencia(Titular titular, String clase, boolean esPrimera) {
        LocalDate fechaEmision = vigenciaService.calcularFechaInicio();
        int aniosVigencia = vigenciaService.calcularAniosVigencia(titular.getFechaNacimiento(), esPrimera);
        LocalDate fechaVencimiento = vigenciaService.calcularFechaVencimiento(titular.getFechaNacimiento(), esPrimera);

        log.warn("DEBUG - clase: {} | vigencia: {}", clase, aniosVigencia);
        Integer costoTotal = costoLicenciaService.calcularCosto(clase, aniosVigencia);

        Licencia licencia = new Licencia();
        licencia.setTitular(titular);
        licencia.setClase(clase);
        licencia.setFechaEmision(fechaEmision);
        licencia.setFechaVencimiento(fechaVencimiento);
        licencia.setCostoTotal(costoTotal);
        return licencia;
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
        dto.setVigente(l.getVigente());
        return dto;
    }

    private RenovacionResponseDTO toRenovacionDTO(Licencia l) {
        RenovacionResponseDTO dto = new RenovacionResponseDTO();
        dto.setId(l.getId());
        dto.setLicenciaAnteriorId(l.getLicenciaAnterior() != null ? l.getLicenciaAnterior().getId() : null);
        dto.setNumeroDocumento(l.getTitular().getNumeroDocumento());
        dto.setNombreTitular(l.getTitular().getNombre());
        dto.setApellidoTitular(l.getTitular().getApellido());
        dto.setClase(l.getClase());
        dto.setFechaEmision(l.getFechaEmision());
        dto.setFechaVencimiento(l.getFechaVencimiento());
        dto.setCostoTotal(l.getCostoTotal());
        dto.setUsuarioTramite(l.getUsuarioTramite() != null ? l.getUsuarioTramite().getNombreUsuario() : null);
        dto.setFechaTramite(l.getFechaTramite());
        return dto;
    }

}
