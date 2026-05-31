package com.agile.backend.repository;
import com.agile.backend.model.Titular;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TitularRepository extends JpaRepository<Titular, Long> {
    boolean existsByNumeroDocumentoAndTipoDocumento(String numeroDocumento, String tipoDocumento);
    Optional<Titular> findByNumeroDocumento(String numeroDocumento);
}
