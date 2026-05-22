package com.agile.backend.dto;

import java.time.LocalDateTime;

public class UsuarioResponseDTO {
    private Long id;
    private String nombre;
    private String apellido;
    private String nombreUsuario;
    private String rol;
    private LocalDateTime fechaCreacion;
    private String creadoPorNombre;    // Solo el nombre, sin exponer toda la entidad

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }

    public String getNombreUsuario() { return nombreUsuario; }
    public void setNombreUsuario(String nombreUsuario) { this.nombreUsuario = nombreUsuario; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public String getCreadoPorNombre() { return creadoPorNombre; }
    public void setCreadoPorNombre(String creadoPorNombre) { this.creadoPorNombre = creadoPorNombre; }
}
