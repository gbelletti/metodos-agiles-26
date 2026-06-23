package com.agile.backend.dataloader;

import com.agile.backend.model.Licencia;
import com.agile.backend.model.Titular;
import com.agile.backend.repository.LicenciaRepository;
import com.agile.backend.repository.TitularRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDate;

@Component
public class LicenciaVencidaDataLoader implements CommandLineRunner {

    private final LicenciaRepository licenciaRepository;
    private final TitularRepository titularRepository;

    public LicenciaVencidaDataLoader(
            LicenciaRepository licenciaRepository,
            TitularRepository titularRepository) {
        this.licenciaRepository = licenciaRepository;
        this.titularRepository = titularRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        long vencidas = licenciaRepository.findAll().stream()
                .filter(l -> l.getFechaVencimiento().isBefore(LocalDate.now()))
                .count();

        if (vencidas > 0) {
            System.out.println("Licencias vencidas ya cargadas. Omitiendo LicenciaVencidaDataLoader.");
            return;
        }

        ClassPathResource resource = new ClassPathResource("licencias_vencidas.csv");

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(resource.getInputStream()))) {

            String linea;
            int cargadas = 0;

            while ((linea = reader.readLine()) != null) {
                if (linea.isBlank()) continue;

                String[] datos = linea.split(",", -1);
                // formato: numero_documento,clase,fecha_emision,fecha_vencimiento,costo_total,observaciones

                String numeroDocumento = datos[0].trim();

                Titular titular = titularRepository
                        .findByNumeroDocumento(numeroDocumento)
                        .orElse(null);

                if (titular == null) {
                    System.err.println("Titular no encontrado con DNI: " + numeroDocumento + " — fila omitida.");
                    continue;
                }

                Licencia licencia = new Licencia();
                licencia.setTitular(titular);
                licencia.setClase(datos[1].trim());
                licencia.setFechaEmision(LocalDate.parse(datos[2].trim()));
                licencia.setFechaVencimiento(LocalDate.parse(datos[3].trim()));
                licencia.setCostoTotal(Integer.parseInt(datos[4].trim()));
                licencia.setObservaciones(datos[5].trim().isEmpty() ? null : datos[5].trim());

                licenciaRepository.save(licencia);
                cargadas++;
            }

            System.out.println(cargadas + " licencias vencidas cargadas correctamente.");
        }
    }
}