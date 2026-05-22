package com.agile.backend.config;

import com.agile.backend.model.Usuario;
import com.agile.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public void run(String... args) throws Exception {
        // Verifica si ya existe el usuario maestro
        if (!usuarioRepository.existsByNombreUsuario("usuariomaestro")) {
            Usuario maestro = new Usuario();
            maestro.setNombre("Usuario");
            maestro.setApellido("Maestro");
            maestro.setNombreUsuario("usuariomaestro");
            maestro.setContrasena("admin1234");   // TODO: aplicar BCrypt
            maestro.setRol("ADMIN");
            maestro.setFechaCreacion(LocalDateTime.now());
            // creadoPor se mantiene null porque es el usuario inicial

            usuarioRepository.save(maestro);
            System.out.println("✅ Usuario maestro creado: usuariomaestro / admin1234");
        } else {
            System.out.println("ℹ️ El usuario maestro ya existe. No se realizaron cambios.");
        }
    }
}
