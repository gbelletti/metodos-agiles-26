package com.agile.backend.service;

import com.agile.backend.dto.LicenciaRequestDTO;
import com.agile.backend.dto.LicenciaResponseDTO;
import com.agile.backend.model.Licencia;
import com.agile.backend.model.Titular;
import com.agile.backend.repository.LicenciaRepository;
import com.agile.backend.repository.TitularRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LicenciaServiceTest {

    @Mock
    private LicenciaRepository licenciaRepository;

    @Mock
    private TitularRepository titularRepository;

    @Mock
    private VigenciaService vigenciaService;

    @Mock
    private CostoLicenciaService costoLicenciaService;

    @InjectMocks
    private LicenciaService licenciaService;

    private LicenciaRequestDTO requestDTO;
    private Titular titularMock;

    private Licencia crearLicenciaMock(String nombreTitular, String apellidoTitular, String clase) {
        Titular titular = new Titular();
        titular.setNombre(nombreTitular);
        titular.setApellido(apellidoTitular);
        titular.setNumeroDocumento("12345678");

        Licencia licencia = new Licencia();
        licencia.setTitular(titular);
        licencia.setClase(clase);
        licencia.setFechaEmision(LocalDate.now().minusDays(10));
        licencia.setFechaVencimiento(LocalDate.now().plusYears(1));
        licencia.setCostoTotal(50);
        licencia.setObservaciones("Test");
        return licencia;
    }

    @BeforeEach
    void setUp() {
        requestDTO = new LicenciaRequestDTO();
        requestDTO.setNumeroDocumento("12345678");
        requestDTO.setClase("B");
        requestDTO.setObservaciones("Uso de lentes");

        titularMock = new Titular();
        titularMock.setId(1L);
        titularMock.setNumeroDocumento("12345678");
        titularMock.setNombre("Juan");
        titularMock.setApellido("Perez");
        titularMock.setFechaNacimiento(LocalDate.of(1990, 1, 1));
    }

    // --- TESTS DE LISTAR VIGENTES (INTACTOS) ---

    @Test
    void listarVigentesPorCriterios_sinFiltros_devuelveTodasLasVigentes() {
        Licencia lic1 = crearLicenciaMock("Juan", "Pérez", "B");
        Licencia lic2 = crearLicenciaMock("María", "Gómez", "A");
        when(licenciaRepository.findVigentesByCriterios(null, null, null, null, null))
                .thenReturn(List.of(lic1, lic2));

        List<LicenciaResponseDTO> resultado = licenciaService.listarVigentesPorCriterios(null, null, null, null, null);
        assertEquals(2, resultado.size());
    }

    @Test
    void listarVigentesPorCriterios_filtroPorApellido_devuelveSoloCoincidentes() {
        Licencia lic = crearLicenciaMock("Ana", "López", "C");
        when(licenciaRepository.findVigentesByCriterios(null, "López", null, null, null))
                .thenReturn(List.of(lic));

        List<LicenciaResponseDTO> resultado = licenciaService.listarVigentesPorCriterios(null, "López", null, null, null);
        assertEquals(1, resultado.size());
        assertEquals("López", resultado.get(0).getApellidoTitular());
    }

    @Test
    void listarVigentesPorCriterios_filtroDonanteTrue_devuelveSoloDonantes() {
        Licencia licDonante = crearLicenciaMock("Pedro", "Ramírez", "B");
        when(licenciaRepository.findVigentesByCriterios(null, null, null, null, true))
                .thenReturn(List.of(licDonante));

        List<LicenciaResponseDTO> resultado = licenciaService.listarVigentesPorCriterios(null, null, null, null, true);
        assertEquals(1, resultado.size());
    }

    @Test
    void listarVigentesPorCriterios_filtroGrupoSanguineoYFactor_devuelveCoincidentes() {
        Licencia lic = crearLicenciaMock("Lucía", "Díaz", "A");
        when(licenciaRepository.findVigentesByCriterios(null, null, "O", "+", null))
                .thenReturn(List.of(lic));

        List<LicenciaResponseDTO> resultado = licenciaService.listarVigentesPorCriterios(null, null, "O", "+", null);
        assertEquals(1, resultado.size());
    }

    @Test
    void listarVigentesPorCriterios_sinResultados_devuelveListaVacia() {
        when(licenciaRepository.findVigentesByCriterios("Nadie", null, null, null, null))
                .thenReturn(List.of());

        List<LicenciaResponseDTO> resultado = licenciaService.listarVigentesPorCriterios("Nadie", null, null, null, null);
        assertTrue(resultado.isEmpty());
    }

    // --- TESTS DE EMITIR LICENCIA ---

    @Test
    void emitirLicencia_Exitosa() {
        // esto se usa para configurar el escenario de emision exitosa
        when(titularRepository.findByNumeroDocumento("12345678")).thenReturn(Optional.of(titularMock));
        when(licenciaRepository.findByTitularId(1L)).thenReturn(Collections.emptyList());

        LocalDate fechaEmision = LocalDate.now();
        LocalDate fechaVencimiento = LocalDate.now().plusYears(5);
        when(vigenciaService.calcularFechaInicio()).thenReturn(fechaEmision);
        when(vigenciaService.calcularFechaVencimiento(any(), eq(true))).thenReturn(fechaVencimiento);
        when(vigenciaService.calcularAniosVigencia(any(), eq(true))).thenReturn(5);
        when(costoLicenciaService.calcularCosto("B", 5)).thenReturn(48);

        Licencia licenciaGuardada = new Licencia();
        licenciaGuardada.setTitular(titularMock);
        licenciaGuardada.setClase("B");
        licenciaGuardada.setFechaEmision(fechaEmision);
        licenciaGuardada.setFechaVencimiento(fechaVencimiento);
        licenciaGuardada.setCostoTotal(48);
        licenciaGuardada.setObservaciones("Uso de lentes");

        when(licenciaRepository.save(any(Licencia.class))).thenReturn(licenciaGuardada);

        LicenciaResponseDTO response = licenciaService.emitirLicencia(requestDTO);

        assertNotNull(response);
        // El ID no se evalua ya que no existe un setter en el modelo
        assertEquals(48, response.getCostoTotal());
        assertEquals("B", response.getClase());
        verify(licenciaRepository, times(1)).save(any(Licencia.class));
    }

    @Test
    void emitirLicencia_FalloPorTitularNoEncontrado() {
        // esto se usa para validar la excepcion cuando el titular no existe
        when(titularRepository.findByNumeroDocumento(anyString())).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            licenciaService.emitirLicencia(requestDTO);
        });

        assertTrue(exception.getMessage().contains("No se encontró un titular con DNI: 12345678"));
        verify(licenciaRepository, never()).save(any(Licencia.class));
        verify(vigenciaService, never()).calcularAniosVigencia(any(), anyBoolean());
    }

    // --- TESTS DE LISTAR VENCIDAS ---

    @Test
    void listarVencidasPorCriterios_Exitosa() {
        // esto se usa para verificar que el servicio delegue correctamente la busqueda al repositorio de expiradas
        Licencia licVencida = crearLicenciaMock("Juan", "Perez", "B");
        licVencida.setFechaVencimiento(LocalDate.now().minusDays(5));

        when(licenciaRepository.findVencidasByCriterios("Juan", "Perez", "O", "+", true))
                .thenReturn(List.of(licVencida));

        List<LicenciaResponseDTO> resultado = licenciaService.listarVencidasPorCriterios("Juan", "Perez", "O", "+", true);

        assertNotNull(resultado);
        assertFalse(resultado.isEmpty());
        assertEquals(1, resultado.size());
        assertEquals("Juan", resultado.get(0).getNombreTitular());
        verify(licenciaRepository, times(1)).findVencidasByCriterios("Juan", "Perez", "O", "+", true);
    }

    @Test
    void listarVencidasPorCriterios_SinResultados() {
        // esto se usa para constatar que una consulta sin coincidencias retorne una lista vacia sin fallos
        when(licenciaRepository.findVencidasByCriterios(null, null, null, null, null))
                .thenReturn(List.of());

        List<LicenciaResponseDTO> resultado = licenciaService.listarVencidasPorCriterios(null, null, null, null, null);

        assertNotNull(resultado);
        assertTrue(resultado.isEmpty());
        verify(licenciaRepository, times(1)).findVencidasByCriterios(null, null, null, null, null);
    }
}