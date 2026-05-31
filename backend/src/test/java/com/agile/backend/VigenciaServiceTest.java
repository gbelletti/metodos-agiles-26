package com.agile.backend;

import com.agile.backend.service.VigenciaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class VigenciaServiceTest {

    private VigenciaService vigenciaService;

    @BeforeEach
    void setUp() {
        vigenciaService = new VigenciaService();
    }

    @Test
    void menor21_primeraLicencia_retorna1Anio() {
        LocalDate fechaNac = LocalDate.now().minusYears(18);
        assertEquals(1, vigenciaService.calcularAniosVigencia(fechaNac, true));
    }

    @Test
    void menor21_noEsPrimera_retorna3Anios() {
        LocalDate fechaNac = LocalDate.now().minusYears(19);
        assertEquals(3, vigenciaService.calcularAniosVigencia(fechaNac, false));
    }

    @Test
    void entre21y46_retorna5Anios() {
        LocalDate fechaNac = LocalDate.now().minusYears(30);
        assertEquals(5, vigenciaService.calcularAniosVigencia(fechaNac, false));
    }

    @Test
    void entre47y60_retorna4Anios() {
        LocalDate fechaNac = LocalDate.now().minusYears(55);
        assertEquals(4, vigenciaService.calcularAniosVigencia(fechaNac, false));
    }

    @Test
    void entre61y70_retorna3Anios() {
        LocalDate fechaNac = LocalDate.now().minusYears(65);
        assertEquals(3, vigenciaService.calcularAniosVigencia(fechaNac, false));
    }

    @Test
    void mayorDe70_retorna1Anio() {
        LocalDate fechaNac = LocalDate.now().minusYears(75);
        assertEquals(1, vigenciaService.calcularAniosVigencia(fechaNac, false));
    }

    @Test
    void fechaInicio_esHoy() {
        assertEquals(LocalDate.now(), vigenciaService.calcularFechaInicio());
    }

    @Test
    void fechaVencimiento_diaMesCoincideConNacimiento() {
        LocalDate fechaNac = LocalDate.of(1990, 8, 15);
        LocalDate vencimiento = vigenciaService.calcularFechaVencimiento(fechaNac, false);
        assertEquals(8, vencimiento.getMonthValue());
        assertEquals(15, vencimiento.getDayOfMonth());
    }

    @Test
    void fechaVencimiento_anioCorrectoSegunVigencia() {
        LocalDate fechaNac = LocalDate.now().minusYears(30); // 5 años de vigencia
        LocalDate vencimiento = vigenciaService.calcularFechaVencimiento(fechaNac, false);
        assertEquals(LocalDate.now().getYear() + 5, vencimiento.getYear());
    }
}
