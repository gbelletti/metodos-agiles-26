package com.agile.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.agile.backend.model.CostoLicencia;
import com.agile.backend.repository.CostoLicenciaRepository;

@Component
public class CostosDataLoader implements CommandLineRunner {

    private final CostoLicenciaRepository repository;

    public CostosDataLoader(CostoLicenciaRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Solo cargamos los datos si la tabla está vacía
        if (repository.count() == 0) {
            
            // Valores para Clases A, B y G [3, 4]
            guardarCosto("A", 5, 40); guardarCosto("A", 4, 30); guardarCosto("A", 3, 25); guardarCosto("A", 1, 20);
            guardarCosto("B", 5, 40); guardarCosto("B", 4, 30); guardarCosto("B", 3, 25); guardarCosto("B", 1, 20);
            guardarCosto("G", 5, 40); guardarCosto("G", 4, 30); guardarCosto("G", 3, 25); guardarCosto("G", 1, 20);

            // Valores para Clase C [3, 4]
            guardarCosto("C", 5, 47); guardarCosto("C", 4, 35); guardarCosto("C", 3, 30); guardarCosto("C", 1, 23);

            // Valores para Clases D y F [3, 4]
            guardarCosto("D", 5, 44); guardarCosto("D", 4, 33); guardarCosto("D", 3, 28); guardarCosto("D", 1, 22);
            guardarCosto("F", 5, 44); guardarCosto("F", 4, 33); guardarCosto("F", 3, 28); guardarCosto("F", 1, 22);

            // Valores para Clase E [3, 4]
            guardarCosto("E", 5, 59); guardarCosto("E", 4, 44); guardarCosto("E", 3, 39); guardarCosto("E", 1, 29);

            System.out.println("✅ Seed inicial de tabla_costos cargado con éxito.");
        }
    }

    private void guardarCosto(String clase, Integer vigencia, Integer precioBase) {
        CostoLicencia costo = new CostoLicencia();
        costo.setClase(clase);
        costo.setVigenciaAnios(vigencia);
        costo.setPrecioBase(precioBase);
        repository.save(costo);
    }
}
