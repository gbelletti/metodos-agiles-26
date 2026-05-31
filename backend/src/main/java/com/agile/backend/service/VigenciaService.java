package com.agile.backend.service;

import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.Period;

@Service
public class VigenciaService {

    /**
     * Calcula los años de vigencia según la edad del titular al momento de emisión.
     * Menores de 21: 1 año (primera vez) o 3 años (siguientes).
     * Hasta 46: 5 años. Hasta 60: 4 años. Hasta 70: 3 años. Mayores de 70: 1 año.
     */
    public int calcularAniosVigencia(LocalDate fechaNacimiento, boolean esPrimeraLicencia) {
        int edad = Period.between(fechaNacimiento, LocalDate.now()).getYears();

        if (edad < 21) {
            return esPrimeraLicencia ? 1 : 3;
        } else if (edad <= 46) {
            return 5;
        } else if (edad <= 60) {
            return 4;
        } else if (edad <= 70) {
            return 3;
        } else {
            return 1;
        }
    }

    /**
     * La fecha de inicio siempre es la fecha actual del sistema (no editable).
     */
    public LocalDate calcularFechaInicio() {
        return LocalDate.now();
    }

    /**
     * La fecha de vencimiento tiene el mismo día y mes que la fecha de nacimiento del titular.
     */
    public LocalDate calcularFechaVencimiento(LocalDate fechaNacimiento, boolean esPrimeraLicencia) {
        int anios = calcularAniosVigencia(fechaNacimiento, esPrimeraLicencia);
        LocalDate inicio = calcularFechaInicio();
        return LocalDate.of(inicio.getYear() + anios, fechaNacimiento.getMonthValue(), fechaNacimiento.getDayOfMonth());
    }
}
