package com.agile.backend.service;

import com.agile.backend.dao.TitularDAO;
import com.agile.backend.dto.TitularRequestDTO;
import com.agile.backend.dto.TitularResponseDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TitularServiceTest {

    @Mock
    private TitularDAO dao;

    @InjectMocks
    private TitularService titularService;

    private TitularRequestDTO dtoValido;

    @BeforeEach
    void setUp() {
        dtoValido = new TitularRequestDTO();
        dtoValido.setTipoDocumento("DNI");
        dtoValido.setNumeroDocumento("12345678");
        dtoValido.setNombre("Juan");
        dtoValido.setApellido("Perez");
        dtoValido.setFechaNacimiento(LocalDate.of(1990, 1, 1));
        dtoValido.setDireccion("Calle Falsa 123");
        dtoValido.setClaseSolicitada("B");
        dtoValido.setGrupoSanguineo("O");
        dtoValido.setFactorRh("+");
        dtoValido.setDonante(true);
    }

    @Test
    void darAltaTitular_Exitosa() {
        when(dao.existeDocumento(dtoValido.getNumeroDocumento(), dtoValido.getTipoDocumento())).thenReturn(false);

        TitularResponseDTO responseEsperado = new TitularResponseDTO();
        responseEsperado.setId(1L);
        responseEsperado.setNumeroDocumento(dtoValido.getNumeroDocumento());

        when(dao.crearTitular(any(TitularRequestDTO.class))).thenReturn(responseEsperado);

        TitularResponseDTO resultado = titularService.darAltaTitular(dtoValido);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals("12345678", resultado.getNumeroDocumento());
        verify(dao, times(1)).crearTitular(dtoValido);
    }

    @Test
    void darAltaTitular_FalloPorDocumentoDuplicado() {
        // conflicto de documento existente
        when(dao.existeDocumento(dtoValido.getNumeroDocumento(), dtoValido.getTipoDocumento())).thenReturn(true);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            titularService.darAltaTitular(dtoValido);
        });

        assertTrue(exception.getMessage().contains("Ya existe un titular con ese tipo y número de documento."));
        verify(dao, never()).crearTitular(any(TitularRequestDTO.class));
    }

    @Test
    void darAltaTitular_FalloPorFaltaDeDatos() {
        // fallo de validacion eliminando el nombre
        dtoValido.setNombre("");

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            titularService.darAltaTitular(dtoValido);
        });

        assertTrue(exception.getMessage().contains("El nombre es obligatorio."));
        verify(dao, never()).existeDocumento(anyString(), anyString());
        verify(dao, never()).crearTitular(any(TitularRequestDTO.class));
    }
}