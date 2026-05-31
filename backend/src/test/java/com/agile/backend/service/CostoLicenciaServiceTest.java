package com.agile.backend.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;


import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class CostoLicenciaServiceTest {

    @Autowired
    private CostoLicenciaService service;

    @Test
    public void testCalcularCostoClaseA5Anios() {
        // Según el enunciado: Clase A por 5 años cuesta $40 + $8 (gasto admin) = $48
        Integer resultado = service.calcularCosto("A", 5);
        assertEquals(48, resultado, "El costo total de la Clase A por 5 años debería ser 48");
    }

    @Test
    public void testCalcularCostoClaseC1Anio() {
        // Según el enunciado: Clase C por 1 año cuesta $23 + $8 (gasto admin) = $31
        Integer resultado = service.calcularCosto("C", 1);
        assertEquals(31, resultado, "El costo total de la Clase C por 1 año debería ser 31");
    }
}
