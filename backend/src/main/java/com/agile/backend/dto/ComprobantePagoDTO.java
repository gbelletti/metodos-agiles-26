package com.agile.backend.dto;

public class ComprobantePagoDTO {
    
    private Long numeroTramite;
    private String nombre;
    private String apellido;
    private String clase;
    private Double costoLicencia;
    private Double costoAdministrativo;
    private Double totalAbonar;

    // Constructor vacío
    public ComprobantePagoDTO() {
    }

    // Constructor completo
    public ComprobantePagoDTO(Long numeroTramite, String nombre, String apellido, String clase, Double costoLicencia, Double costoAdministrativo, Double totalAbonar) {
        this.numeroTramite = numeroTramite;
        this.nombre = nombre;
        this.apellido = apellido;
        this.clase = clase;
        this.costoLicencia = costoLicencia;
        this.costoAdministrativo = costoAdministrativo;
        this.totalAbonar = totalAbonar;
    }

    // Getters y Setters
    public Long getNumeroTramite() {
        return numeroTramite;
    }

    public void setNumeroTramite(Long numeroTramite) {
        this.numeroTramite = numeroTramite;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getClase() {
        return clase;
    }

    public void setClase(String clase) {
        this.clase = clase;
    }

    public Double getCostoLicencia() {
        return costoLicencia;
    }

    public void setCostoLicencia(Double costoLicencia) {
        this.costoLicencia = costoLicencia;
    }

    public Double getCostoAdministrativo() {
        return costoAdministrativo;
    }

    public void setCostoAdministrativo(Double costoAdministrativo) {
        this.costoAdministrativo = costoAdministrativo;
    }

    public Double getTotalAbonar() {
        return totalAbonar;
    }

    public void setTotalAbonar(Double totalAbonar) {
        this.totalAbonar = totalAbonar;
    }
}