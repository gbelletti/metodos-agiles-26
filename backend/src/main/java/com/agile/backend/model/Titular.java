package com.agile.backend.model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import lombok.AccessLevel;

@Entity
@Table(name = "titulares")

@Getter @Setter  
public class Titular {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private Long id;
    
    private String tipoDocumento;
    private String numeroDocumento;
    private String nombre;
    private String apellido;
    private LocalDate fechaNacimiento;
    private String direccion;
    private String claseSolicitada;
    private String grupoSanguineo;
    private String factorRh;
    private Boolean donante;

}
