package com.agile.backend.model;
import jakarta.persistence.*;

@Entity
@Table(name = "tabla_costos")
public class CostoLicencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1)
    private String clase;

    @Column(name = "vigencia_anios", nullable = false)
    private Integer vigenciaAnios;

    @Column(name = "precio_base", nullable = false)
    private Integer precioBase;

    // El enunciado exige sumar $8 fijos de gasto administrativo [3, 4]
    @Column(name = "gasto_administrativo", nullable = false)
    private Integer gastoAdministrativo = 8;

    // Constructores vacíos y Getters/Setters
    public CostoLicencia() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getClase() { return clase; }
    public void setClase(String clase) { this.clase = clase; }
    public Integer getVigenciaAnios() { return vigenciaAnios; }
    public void setVigenciaAnios(Integer vigenciaAnios) { this.vigenciaAnios = vigenciaAnios; }
    public Integer getPrecioBase() { return precioBase; }
    public void setPrecioBase(Integer precioBase) { this.precioBase = precioBase; }
    public Integer getGastoAdministrativo() { return gastoAdministrativo; }
    public void setGastoAdministrativo(Integer gastoAdministrativo) { this.gastoAdministrativo = gastoAdministrativo; }
}
