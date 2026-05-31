package com.agile.backend.service; 

import org.springframework.stereotype.Service;

import com.agile.backend.model.CostoLicencia;
import com.agile.backend.repository.CostoLicenciaRepository;

@Service
public class CostoLicenciaService {

    private final CostoLicenciaRepository repository;

    public CostoLicenciaService(CostoLicenciaRepository repository) {
        this.repository = repository;
    }

    // TPMA2026-78: Función para calcular el costo total
    public Integer calcularCosto(String clase, Integer vigenciaAnios) {
        
        // 1. Buscamos la fila correspondiente en la base de datos
        CostoLicencia costo = repository.findByClaseAndVigenciaAnios(clase, vigenciaAnios)
                .orElseThrow(() -> new RuntimeException("Error: No se encontró un costo para la clase " + clase + " con vigencia de " + vigenciaAnios + " años."));

        // 2. Sumamos el precio base y el gasto administrativo ($8)
        Integer costoTotal = costo.getPrecioBase() + costo.getGastoAdministrativo();
        
        return costoTotal;
    }

    // Función para que el administrador actualice los costos
    public void actualizarCosto(String clase, Integer vigenciaAnios, Integer nuevoPrecioBase) {
        // Buscamos el costo actual
        CostoLicencia costo = repository.findByClaseAndVigenciaAnios(clase, vigenciaAnios)
                .orElseThrow(() -> new RuntimeException("Error: No se encontró la clase " + clase));
        
        // Le seteamos el nuevo precio base y lo guardamos
        costo.setPrecioBase(nuevoPrecioBase);
        repository.save(costo);
    }
}
