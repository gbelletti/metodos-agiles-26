package com.agile.backend.service;

import com.agile.backend.dto.LicenciaResponseDTO;
import com.agile.backend.model.Licencia;
import com.agile.backend.model.Titular;
import com.agile.backend.repository.LicenciaRepository;
import com.agile.backend.repository.TitularRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

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

    private Licencia crearLicenciaMock(String nombreTitular, String apellidoTitular, String clase) {
    Titular titular = new Titular();
    titular.setNombre(nombreTitular);
    titular.setApellido(apellidoTitular);
    titular.setNumeroDocumento("12345678");

    Licencia licencia = new Licencia();
    // licencia.setId(1L);  ← se elimina, no existe el setter
    licencia.setTitular(titular);
    licencia.setClase(clase);
    licencia.setFechaEmision(LocalDate.now().minusDays(10));
    licencia.setFechaVencimiento(LocalDate.now().plusYears(1));
    licencia.setCostoTotal(50);
    licencia.setObservaciones("Test");
    return licencia;
}

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
}