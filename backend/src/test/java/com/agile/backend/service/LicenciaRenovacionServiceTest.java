package com.agile.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.agile.backend.dto.RenovacionRequestDTO;
import com.agile.backend.dto.RenovacionResponseDTO;
import com.agile.backend.model.Licencia;
import com.agile.backend.model.Titular;
import com.agile.backend.model.Usuario;
import com.agile.backend.repository.LicenciaRepository;
import com.agile.backend.repository.TitularRepository;
import com.agile.backend.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class LicenciaRenovacionServiceTest {

    @Mock
    private LicenciaRepository licenciaRepository;

    @Mock
    private TitularRepository titularRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private VigenciaService vigenciaService;

    @Mock
    private CostoLicenciaService costoLicenciaService;

    @InjectMocks
    private LicenciaService service;

    // ── Helpers ─────────────────────────────────────────────────────────────────

    private Titular titularMock() {
        Titular t = new Titular();
        t.setNombre("Ana");
        t.setApellido("García");
        t.setNumeroDocumento("12345678");
        t.setFechaNacimiento(LocalDate.of(1990, 5, 15));
        return t;
    }

    private Licencia licenciaVigenteMock() {
        Licencia l = new Licencia();
        l.setTitular(titularMock());
        l.setClase("B");
        l.setFechaEmision(LocalDate.of(2020, 1, 1));
        l.setFechaVencimiento(LocalDate.of(2025, 5, 15));
        l.setCostoTotal(48);
        l.setObservaciones("Lentes obligatorios");
        l.setVigente(true);
        return l;
    }

    private Usuario usuarioMock() {
        Usuario u = new Usuario();
        u.setNombreUsuario("admin");
        u.setNombre("Admin");
        u.setApellido("Sistema");
        return u;
    }

    private RenovacionRequestDTO requestDTO(Long licenciaId, String usuario) {
        RenovacionRequestDTO dto = new RenovacionRequestDTO();
        dto.setLicenciaId(licenciaId);
        dto.setNombreUsuario(usuario);
        return dto;
    }

    /** Configura los mocks del camino feliz de renovación. */
    private void stubRenovacionOk(Licencia anterior) {
        when(licenciaRepository.findById(1L)).thenReturn(Optional.of(anterior));
        when(usuarioRepository.findByNombreUsuario("admin")).thenReturn(Optional.of(usuarioMock()));
        when(vigenciaService.calcularFechaInicio()).thenReturn(LocalDate.of(2026, 6, 15));
        when(vigenciaService.calcularAniosVigencia(any(), eq(false))).thenReturn(5);
        when(vigenciaService.calcularFechaVencimiento(any(), eq(false)))
                .thenReturn(LocalDate.of(2031, 5, 15));
        when(costoLicenciaService.calcularCosto("B", 5)).thenReturn(100);
        when(licenciaRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
    }

    // ── Tests ─────────────────────────────────────────────────────────────────

    @Test
    // La renovación crea una nueva licencia vigente y archiva la anterior, dejándolas enlazadas
    void renovar_creaNuevaVigente_yArchivaAnterior() {
        Licencia anterior = licenciaVigenteMock();
        stubRenovacionOk(anterior);

        RenovacionResponseDTO resultado = service.renovarLicencia(requestDTO(1L, "admin"));

        // Se guardan ambas licencias (anterior archivada + nueva)
        ArgumentCaptor<Licencia> captor = ArgumentCaptor.forClass(Licencia.class);
        verify(licenciaRepository, times(2)).save(captor.capture());

        Licencia anteriorGuardada = captor.getAllValues().get(0);
        Licencia nuevaGuardada = captor.getAllValues().get(1);

        assertFalse(anteriorGuardada.getVigente(), "La anterior debe quedar no vigente");
        assertTrue(nuevaGuardada.getVigente(), "La nueva debe quedar vigente");
        assertSame(anterior, nuevaGuardada.getLicenciaAnterior(), "La nueva debe enlazar a la anterior");
        assertNotNull(resultado.getFechaVencimiento());
    }

    @Test
    // El trámite registra el usuario administrativo y la fecha/hora
    void renovar_registraUsuarioYFechaTramite() {
        Licencia anterior = licenciaVigenteMock();
        stubRenovacionOk(anterior);

        RenovacionResponseDTO resultado = service.renovarLicencia(requestDTO(1L, "admin"));

        assertEquals("admin", resultado.getUsuarioTramite());
        assertNotNull(resultado.getFechaTramite());
    }

    @Test
    // La vigencia se recalcula con la edad actual del titular (no es primera licencia)
    void renovar_recalculaVigenciaConEdadActual() {
        Licencia anterior = licenciaVigenteMock();
        stubRenovacionOk(anterior);

        service.renovarLicencia(requestDTO(1L, "admin"));

        // esPrimera = false en la renovación
        verify(vigenciaService).calcularAniosVigencia(anterior.getTitular().getFechaNacimiento(), false);
        verify(vigenciaService).calcularFechaVencimiento(anterior.getTitular().getFechaNacimiento(), false);
    }

    @Test
    // El costo de renovación usa el mismo cálculo que la emisión (clase + vigencia)
    void renovar_costoIgualQueEmision() {
        Licencia anterior = licenciaVigenteMock();
        stubRenovacionOk(anterior);

        RenovacionResponseDTO resultado = service.renovarLicencia(requestDTO(1L, "admin"));

        verify(costoLicenciaService).calcularCosto("B", 5);
        assertEquals(100, resultado.getCostoTotal());
    }

    @Test
    // La nueva licencia hereda la clase de la licencia renovada
    void renovar_heredaClaseDeLaAnterior() {
        Licencia anterior = licenciaVigenteMock();
        stubRenovacionOk(anterior);

        RenovacionResponseDTO resultado = service.renovarLicencia(requestDTO(1L, "admin"));

        assertEquals("B", resultado.getClase());
    }

    @Test
    // Si la licencia a renovar no existe, se lanza excepción y no se guarda nada
    void renovar_licenciaNoExiste_lanzaExcepcion() {
        when(licenciaRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.renovarLicencia(requestDTO(99L, "admin")));
        verify(licenciaRepository, never()).save(any());
    }

    @Test
    // Si el usuario administrativo no existe, se lanza excepción y no se guarda nada
    void renovar_usuarioNoExiste_lanzaExcepcion() {
        Licencia anterior = licenciaVigenteMock();
        when(licenciaRepository.findById(1L)).thenReturn(Optional.of(anterior));
        when(usuarioRepository.findByNombreUsuario("fantasma")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.renovarLicencia(requestDTO(1L, "fantasma")));
        verify(licenciaRepository, never()).save(any());
    }

    @Test
    // No se puede renovar una licencia ya archivada (vigente = false)
    void renovar_licenciaArchivada_lanzaExcepcion() {
        Licencia archivada = licenciaVigenteMock();
        archivada.setVigente(false);
        when(licenciaRepository.findById(1L)).thenReturn(Optional.of(archivada));

        assertThrows(RuntimeException.class, () -> service.renovarLicencia(requestDTO(1L, "admin")));
        verify(licenciaRepository, never()).save(any());
    }

    @Test
    // Test complementario con VigenciaService real: la vigencia se calcula sobre el año actual
    void renovar_conVigenciaReal_venceSegunEdadActual() {
        // Titular de 30 años exactos respecto a hoy → 5 años de vigencia (renovación)
        Licencia anterior = licenciaVigenteMock();
        anterior.getTitular().setFechaNacimiento(LocalDate.now().minusYears(30));

        LicenciaService servicioReal = new LicenciaService(
                licenciaRepository, titularRepository, usuarioRepository,
                new VigenciaService(), costoLicenciaService);

        when(licenciaRepository.findById(1L)).thenReturn(Optional.of(anterior));
        when(usuarioRepository.findByNombreUsuario("admin")).thenReturn(Optional.of(usuarioMock()));
        when(costoLicenciaService.calcularCosto(eq("B"), eq(5))).thenReturn(100);
        when(licenciaRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        RenovacionResponseDTO resultado = servicioReal.renovarLicencia(requestDTO(1L, "admin"));

        assertEquals(LocalDate.now().getYear() + 5, resultado.getFechaVencimiento().getYear());
        assertEquals(LocalDate.now().getYear(), resultado.getFechaEmision().getYear());
    }
}
