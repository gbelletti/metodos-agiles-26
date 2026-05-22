CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
	apellido VARCHAR(150) NOT NULL,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE, -- Único en el sistema (tira error si se repite)
    contrasena VARCHAR(255) NOT NULL,          -- VARCHAR largo para soportar el hash de Bcrypt
    rol VARCHAR(30) NOT NULL,                  -- Ej: 'ADMIN', 'OPERADOR'
    
    -- Auditoría: Cuándo y Quién
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    creado_por_id BIGINT,                      -- ID del usuario que lo creó
    
    -- Restricciones de integridad
    CONSTRAINT fk_creado_por FOREIGN KEY (creado_por_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    CONSTRAINT chk_contrasena_largo CHECK (LENGTH(contrasena) >= 8) -- Mínimo 8 caracteres
);


--Como es el primer usuario, es la unica tupla en donde creado_por_id sera NULL.
--Luego, el resto de usuarios apuntara al nombre_usuario que lo creo.
INSERT INTO usuarios (nombre, apellido, nombre_usuario, contrasena, rol, creado_por_id)
VALUES ('Joaquin', 'Clausen', 'jlclausen', 'admin1234', 'ADMIN', NULL);

--Creacion de usuario por jlclausen
INSERT INTO usuarios (nombre, apellido, nombre_usuario, contrasena, rol, creado_por_id)
VALUES ('Juan', 'Pérez', 'jperez', 'contraseña1234', 'ADMIN', 1);

SELECT * FROM usuarios;