package com.agile.backend.dto;
import java.time.LocalDate;

public class LicenciaImpresionDTO {
    
    private Long numeroLicencia;
    private String nombre;
    private String apellido;
    private String tipoDocumento;
    private String numeroDocumento;
    private LocalDate fechaNacimiento;
    private String clasesHabilitadas;
    private LocalDate fechaEmision;
    private LocalDate fechaVencimiento;
    private String grupoSanguineo;
    private String factorRh;
    private boolean donanteOrganos;
    private String observaciones;

    // Constructor vacío
    public LicenciaImpresionDTO() {
    }

    // Constructor completo
    public LicenciaImpresionDTO(Long numeroLicencia, String nombre, String apellido, String tipoDocumento, String numeroDocumento, LocalDate fechaNacimiento, String clasesHabilitadas, LocalDate fechaEmision, LocalDate fechaVencimiento, String grupoSanguineo, String factorRh, boolean donanteOrganos, String observaciones) {
        this.numeroLicencia = numeroLicencia;
        this.nombre = nombre;
        this.apellido = apellido;
        this.tipoDocumento = tipoDocumento;
        this.numeroDocumento = numeroDocumento;
        this.fechaNacimiento = fechaNacimiento;
        this.clasesHabilitadas = clasesHabilitadas;
        this.fechaEmision = fechaEmision;
        this.fechaVencimiento = fechaVencimiento;
        this.grupoSanguineo = grupoSanguineo;
        this.factorRh = factorRh;
        this.donanteOrganos = donanteOrganos;
        this.observaciones = observaciones;
    }

    // Getters y Setters
    public Long getNumeroLicencia() {
        return numeroLicencia;
    }

    public void setNumeroLicencia(Long numeroLicencia) {
        this.numeroLicencia = numeroLicencia;
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

    public String getTipoDocumento() {
        return tipoDocumento;
    }

    public void setTipoDocumento(String tipoDocumento) {
        this.tipoDocumento = tipoDocumento;
    }

    public String getNumeroDocumento() {
        return numeroDocumento;
    }

    public void setNumeroDocumento(String numeroDocumento) {
        this.numeroDocumento = numeroDocumento;
    }

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getClasesHabilitadas() {
        return clasesHabilitadas;
    }

    public void setClasesHabilitadas(String clasesHabilitadas) {
        this.clasesHabilitadas = clasesHabilitadas;
    }

    public LocalDate getFechaEmision() {
        return fechaEmision;
    }

    public void setFechaEmision(LocalDate fechaEmision) {
        this.fechaEmision = fechaEmision;
    }

    public LocalDate getFechaVencimiento() {
        return fechaVencimiento;
    }

    public void setFechaVencimiento(LocalDate fechaVencimiento) {
        this.fechaVencimiento = fechaVencimiento;
    }

    public String getGrupoSanguineo() {
        return grupoSanguineo;
    }

    public void setGrupoSanguineo(String grupoSanguineo) {
        this.grupoSanguineo = grupoSanguineo;
    }

    public String getFactorRh() {
        return factorRh;
    }

    public void setFactorRh(String factorRh) {
        this.factorRh = factorRh;
    }

    public boolean isDonanteOrganos() {
        return donanteOrganos;
    }

    public void setDonanteOrganos(boolean donanteOrganos) {
        this.donanteOrganos = donanteOrganos;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
}
