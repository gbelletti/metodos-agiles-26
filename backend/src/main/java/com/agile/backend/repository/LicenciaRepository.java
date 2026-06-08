package com.agile.backend.repository;

import com.agile.backend.model.Licencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LicenciaRepository extends JpaRepository<Licencia, Long> {
    List<Licencia> findByTitularId(Long titularId);
}