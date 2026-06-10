package com.agile.backend.repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.agile.backend.model.Licencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LicenciaRepository extends JpaRepository<Licencia, Long> {
    List<Licencia> findByTitularId(Long titularId);
    @Query("""
    SELECT l FROM Licencia l
    JOIN l.titular t
    WHERE l.fechaVencimiento >= CURRENT_DATE
      AND (:nombre IS NULL OR LOWER(t.nombre) LIKE LOWER(CONCAT('%', CAST(:nombre AS string), '%')))
      AND (:apellido IS NULL OR LOWER(t.apellido) LIKE LOWER(CONCAT('%', CAST(:apellido AS string), '%')))
      AND (:grupoSanguineo IS NULL OR t.grupoSanguineo = :grupoSanguineo)
      AND (:factorRh IS NULL OR t.factorRh = :factorRh)
      AND (:donante IS NULL OR t.donante = :donante)
    ORDER BY t.apellido, t.nombre, l.clase
    """)
List<Licencia> findVigentesByCriterios(
    @Param("nombre") String nombre,
    @Param("apellido") String apellido,
    @Param("grupoSanguineo") String grupoSanguineo,
    @Param("factorRh") String factorRh,
    @Param("donante") Boolean donante
);
}

