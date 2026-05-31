package com.agile.backend.dataloader;

import com.agile.backend.dto.TitularRequestDTO;
import com.agile.backend.service.TitularService;
import com.agile.backend.repository.TitularRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDate;

@Component
public class TitularDataLoader implements CommandLineRunner {

    private final TitularService titularService;
    private final TitularRepository titularRepository;

    public TitularDataLoader(TitularService titularService, TitularRepository titularRepository) {
        this.titularService = titularService;
        this.titularRepository = titularRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Esto se usa para verificar si la base de datos ya contiene registros y abortar la carga si es así
        if (titularRepository.count() > 0) {
            System.out.println("Datos iniciales ya cargados. Omitiendo ejecución de DataLoader.");
            return;
        }

        // Esto se usa para cargar el archivo desde la carpeta de recursos
        ClassPathResource resource = new ClassPathResource("titulares.csv");
        
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream()))) {
            String linea;
            while ((linea = reader.readLine()) != null) {
                if (linea.isBlank()) {
                    continue;
                }
                
                String[] datos = linea.split(",");
                
                TitularRequestDTO dto = new TitularRequestDTO();
                dto.setTipoDocumento(datos[0].trim());
                dto.setNumeroDocumento(datos[1].trim());
                dto.setNombre(datos[2].trim());
                dto.setApellido(datos[3].trim());
                dto.setFechaNacimiento(LocalDate.parse(datos[4].trim()));
                dto.setDireccion(datos[5].trim());
                dto.setClaseSolicitada(datos[6].trim());
                dto.setGrupoSanguineo(datos[7].trim());
                dto.setFactorRh(datos[8].trim());
                dto.setDonante(Boolean.parseBoolean(datos[9].trim()));

                try {
                    // Esto se usa para procesar el alta utilizando la lógica y validaciones del servicio existente
                    titularService.darAltaTitular(dto);
                } catch (RuntimeException e) {
                    System.err.println("Fila omitida: " + linea + " | Motivo: " + e.getMessage());
                }
            }
        }
    }
}