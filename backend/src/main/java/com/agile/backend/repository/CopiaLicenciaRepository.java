package com.agile.backend.repository;

import com.agile.backend.model.CopiaLicencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CopiaLicenciaRepository extends JpaRepository<CopiaLicencia, Long> {

    // Todas las copias de una licencia original (para calcular el número de copia)
    List<CopiaLicencia> findByLicenciaOriginalId(Long licenciaId);
}