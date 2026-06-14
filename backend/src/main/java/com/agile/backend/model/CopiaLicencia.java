package com.agile.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "copias_licencia")
@Getter @Setter
public class CopiaLicencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Licencia original de la que se saca la copia
    @ManyToOne(optional = false)
    @JoinColumn(name = "licencia_id", nullable = false)
    private Licencia licenciaOriginal;

    // 2 = duplicado, 3 = triplicado, etc.
    @Column(nullable = false)
    private Integer numeroCopia;

    // EXTRAVÍO | ROBO | DETERIORO
    @Column(nullable = false, length = 50)
    private String motivo;

    // Usuario administrativo que realizó el trámite
    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    // Fecha y hora del trámite
    @Column(nullable = false)
    private LocalDateTime fechaTramite;

    // Costo fijo $50
    @Column(nullable = false)
    private Integer costoTotal;
}
