package com.agile.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.AccessLevel;
import java.time.LocalDate;

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
}