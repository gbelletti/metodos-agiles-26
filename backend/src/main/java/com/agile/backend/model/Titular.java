package com.agile.backend.model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import lombok.AccessLevel;

@Entity
@Table(name = "titulares")

@Getter @Setter  // Genera getters y setters para todos los campos
public class Titular {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE) // Evita que se modifique el ID una vez asignado
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

    public String getTipoDocumento() { return tipoDocumento; }
    public void setTipoDocumento(String tipoDocumento) { this.tipoDocumento = tipoDocumento; }
    public String getNumeroDocumento() { return numeroDocumento; }
    public void setNumeroDocumento(String numeroDocumento) { this.numeroDocumento = numeroDocumento; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    public String getClaseSolicitada() { return claseSolicitada; }
    public void setClaseSolicitada(String claseSolicitada) { this.claseSolicitada = claseSolicitada; }
    public String getGrupoSanguineo() { return grupoSanguineo; }
    public void setGrupoSanguineo(String grupoSanguineo) { this.grupoSanguineo = grupoSanguineo; }
    public String getFactorRh() { return factorRh; }
    public void setFactorRh(String factorRh) { this.factorRh = factorRh; }
    public java.time.LocalDate getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(java.time.LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }
    public Boolean getDonante() { return donante; }
    public void setDonante(Boolean donante) { this.donante = donante; }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

}
