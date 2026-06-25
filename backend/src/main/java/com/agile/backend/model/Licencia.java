package com.agile.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.AccessLevel;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "licencias")
@Getter @Setter
public class Licencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "titular_id", nullable = false)
    private Titular titular;

    @Column(nullable = false, length = 1)
    private String clase;

    @Column(nullable = false)
    private LocalDate fechaEmision;

    @Column(nullable = false)
    private LocalDate fechaVencimiento;

    @Column(nullable = false)
    private Integer costoTotal;

    @Column(length = 500)
    private String observaciones;

    @Column // es nullable = false pero lo dejo asi para que no choque con lo que ya se guardo en bdd
    private Boolean vigente=true;  // =false cuando se archiva la licencia y deja de ser vigente

    @ManyToOne
    @JoinColumn(name = "licencia_anterior_id")
    private Licencia licenciaAnterior;  // mapea la licencia anterior en caso de renovación

    @ManyToOne
    @JoinColumn(name = "usuario_tramite_id")
    private Usuario usuarioTramite;  // administrativo que emitió/renovó la licencia

    @Column
    private LocalDateTime fechaTramite;  // fecha y hora del trámite (emisión/renovación)

}