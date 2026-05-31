package com.agile.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.agile.backend.model.CostoLicencia;

import java.util.Optional;

@Repository
public interface CostoLicenciaRepository extends JpaRepository<CostoLicencia, Long> {
    Optional<CostoLicencia> findByClaseAndVigenciaAnios(String clase, Integer vigenciaAnios);
}