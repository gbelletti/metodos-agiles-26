package com.agile.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.agile.backend.dto.CopiaLicenciaRequestDTO;
import com.agile.backend.dto.CopiaLicenciaResponseDTO;
import com.agile.backend.model.CopiaLicencia;
import com.agile.backend.model.Licencia;
import com.agile.backend.model.Titular;
import com.agile.backend.model.Usuario;
import com.agile.backend.repository.CopiaLicenciaRepository;
import com.agile.backend.repository.LicenciaRepository;
import com.agile.backend.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class CopiaLicenciaServiceTest {

    @Mock
    private CopiaLicenciaRepository copiaRepository;

    @Mock
    private LicenciaRepository licenciaRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private CopiaLicenciaService service;

    private Titular titularMock() {
        Titular t = new Titular();
        t.setNombre("Ana");
        t.setApellido("García");
        t.setNumeroDocumento("12345678");
        return t;
    }

    private Licencia licenciaMock() {
        Licencia l = new Licencia();
        l.setTitular(titularMock());
        l.setClase("B");
        l.setFechaEmision(LocalDate.of(2024, 1, 1));
        l.setFechaVencimiento(LocalDate.of(2029, 1, 1));
        l.setCostoTotal(48);
        return l;
    }

    private Usuario usuarioMock() {
        Usuario u = new Usuario();
        u.setNombreUsuario("admin");
        u.setNombre("Admin");
        u.setApellido("Sistema");
        return u;
    }

    private CopiaLicenciaRequestDTO requestDTO(Long licenciaId, String motivo, String usuario) {
        CopiaLicenciaRequestDTO dto = new CopiaLicenciaRequestDTO();
        dto.setLicenciaId(licenciaId);
        dto.setMotivo(motivo);
        dto.setNombreUsuario(usuario);
        return dto;
    }

    private CopiaLicencia copiaMock(Licencia licencia, int numeroCopia) {
        CopiaLicencia c = new CopiaLicencia();
        c.setLicenciaOriginal(licencia);
        c.setNumeroCopia(numeroCopia);
        c.setMotivo("EXTRAVÍO");
        c.setUsuario(usuarioMock());
        c.setFechaTramite(LocalDateTime.now());
        c.setCostoTotal(50);
        return c;
    }

    // ── Tests ─────────────────────────────────────────────────────────────────

    @Test
    // Si no existen copias previas, se emite un duplicado
    void emitirCopia_primeraVez_retornaDuplicado() {
        Licencia licencia = licenciaMock();
        when(licenciaRepository.findById(1L)).thenReturn(Optional.of(licencia));
        when(usuarioRepository.findByNombreUsuario("admin")).thenReturn(Optional.of(usuarioMock()));
        when(copiaRepository.findByLicenciaOriginalId(any())).thenReturn(List.of());
        when(copiaRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        CopiaLicenciaResponseDTO resultado = service.emitirCopia(requestDTO(1L, "EXTRAVÍO", "admin"));

        assertEquals(2, resultado.getNumeroCopia());
        assertEquals("Duplicado", resultado.getDescripcionCopia());
        assertEquals(50, resultado.getCostoTotal());
        verify(copiaRepository).save(any());
    }

    @Test
    // Si ya existe una copia previa, se emite un triplicado
    void emitirCopia_segundaVez_retornaTriplicado() {
        Licencia licencia = licenciaMock();
        when(licenciaRepository.findById(1L)).thenReturn(Optional.of(licencia));
        when(usuarioRepository.findByNombreUsuario("admin")).thenReturn(Optional.of(usuarioMock()));
        // Ya existe una copia previa (duplicado)
        when(copiaRepository.findByLicenciaOriginalId(any())).thenReturn(List.of(copiaMock(licencia, 2)));
        when(copiaRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        CopiaLicenciaResponseDTO resultado = service.emitirCopia(requestDTO(1L, "ROBO", "admin"));

        assertEquals(3, resultado.getNumeroCopia());
        assertEquals("Triplicado", resultado.getDescripcionCopia());
    }

    @Test
    // Motivo inválido no permite emitir copia
    void emitirCopia_motivoInvalido_lanzaExcepcion() {
        CopiaLicenciaRequestDTO dto = requestDTO(1L, "PERDIDA", "admin");

        assertThrows(RuntimeException.class, () -> service.emitirCopia(dto));
        verify(licenciaRepository, never()).findById(any());
    }

    @Test
    // Si la licencia no existe, no se emite copia y se lanza excepción
    void emitirCopia_licenciaNoExiste_lanzaExcepcion() {
        when(licenciaRepository.findById(99L)).thenReturn(Optional.empty());

        CopiaLicenciaRequestDTO dto = requestDTO(99L, "ROBO", "admin");
        assertThrows(RuntimeException.class, () -> service.emitirCopia(dto));
        verify(copiaRepository, never()).save(any());
    }

    @Test
    // Si el usuario no existe, no se emite copia y se lanza excepción
    void emitirCopia_usuarioNoExiste_lanzaExcepcion() {
        when(licenciaRepository.findById(1L)).thenReturn(Optional.of(licenciaMock()));
        when(usuarioRepository.findByNombreUsuario("fantasma")).thenReturn(Optional.empty());

        CopiaLicenciaRequestDTO dto = requestDTO(1L, "DETERIORO", "fantasma");
        assertThrows(RuntimeException.class, () -> service.emitirCopia(dto));
        verify(copiaRepository, never()).save(any());
    }

    @Test
    // El costo total de la copia siempre es 50, independientemente del número de copia o motivo
    void emitirCopia_costoSiempreEs50() {
        Licencia licencia = licenciaMock();
        when(licenciaRepository.findById(1L)).thenReturn(Optional.of(licencia));
        when(usuarioRepository.findByNombreUsuario("admin")).thenReturn(Optional.of(usuarioMock()));
        when(copiaRepository.findByLicenciaOriginalId(any())).thenReturn(List.of());
        when(copiaRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        CopiaLicenciaResponseDTO resultado = service.emitirCopia(requestDTO(1L, "DETERIORO", "admin"));

        assertEquals(50, resultado.getCostoTotal());
    }

    @Test
    // El motivo y usuario del trámite quedan registrados correctamente en la copia emitida
    void emitirCopia_registraMotivo() {
        Licencia licencia = licenciaMock();
        when(licenciaRepository.findById(1L)).thenReturn(Optional.of(licencia));
        when(usuarioRepository.findByNombreUsuario("admin")).thenReturn(Optional.of(usuarioMock()));
        when(copiaRepository.findByLicenciaOriginalId(any())).thenReturn(List.of());
        when(copiaRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        CopiaLicenciaResponseDTO resultado = service.emitirCopia(requestDTO(1L, "DETERIORO", "admin"));

        assertEquals("DETERIORO", resultado.getMotivo());
        assertEquals("admin", resultado.getUsuarioTramite());
        assertNotNull(resultado.getFechaTramite());
    }
}