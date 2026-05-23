CREATE DATABASE skyship_express;
USE skyship_express;

-- =========================
-- ROLES
-- =========================
CREATE TABLE roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(150)
);

-- =========================
-- USUARIOS
-- =========================
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    id_rol INT NOT NULL,
    nombre_completo VARCHAR(150) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    estado ENUM('ACTIVO', 'INACTIVO') DEFAULT 'ACTIVO',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

-- =========================
-- REGIONES
-- =========================
CREATE TABLE regiones (
    id_region INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(150)
);

-- =========================
-- ESTADOS DE ENVÍO
-- =========================
CREATE TABLE estados_envio (
    id_estado INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL UNIQUE,
    descripcion VARCHAR(150)
);

-- =========================
-- ENVÍOS
-- =========================
CREATE TABLE envios (
    id_envio INT AUTO_INCREMENT PRIMARY KEY,
    codigo_guia VARCHAR(50) NOT NULL UNIQUE,
    id_usuario INT NOT NULL,
    id_region INT,
    id_estado INT NOT NULL,
    origen VARCHAR(255) NOT NULL,
    destino VARCHAR(255) NOT NULL,
    descripcion_paquete VARCHAR(255),
    peso DECIMAL(10,2),
    costo_estimado DECIMAL(10,2) NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_envio_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),

    CONSTRAINT fk_envio_region
        FOREIGN KEY (id_region) REFERENCES regiones(id_region),

    CONSTRAINT fk_envio_estado
        FOREIGN KEY (id_estado) REFERENCES estados_envio(id_estado)
);

-- =========================
-- HISTORIAL / RASTREO DE ENVÍOS
-- =========================
CREATE TABLE rastreo_envios (
    id_rastreo INT AUTO_INCREMENT PRIMARY KEY,
    id_envio INT NOT NULL,
    id_estado INT NOT NULL,
    ubicacion VARCHAR(150),
    comentario VARCHAR(255),
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_rastreo_envio
        FOREIGN KEY (id_envio) REFERENCES envios(id_envio)
        ON DELETE CASCADE,

    CONSTRAINT fk_rastreo_estado
        FOREIGN KEY (id_estado) REFERENCES estados_envio(id_estado)
);

-- =========================
-- FORMULARIO DE CONTACTO
-- =========================
CREATE TABLE contactos (
    id_contacto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    correo VARCHAR(150) NOT NULL,
    telefono VARCHAR(20),
    asunto VARCHAR(150) NOT NULL,
    mensaje TEXT NOT NULL,
    fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('PENDIENTE', 'ATENDIDO') DEFAULT 'PENDIENTE'
);

-- =========================
-- FAQ
-- =========================
CREATE TABLE faqs (
    id_faq INT AUTO_INCREMENT PRIMARY KEY,
    pregunta VARCHAR(255) NOT NULL,
    respuesta TEXT NOT NULL,
    estado ENUM('ACTIVO', 'INACTIVO') DEFAULT 'ACTIVO',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- SERVICIOS DE LA EMPRESA
-- =========================
CREATE TABLE servicios (
    id_servicio INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    estado ENUM('ACTIVO', 'INACTIVO') DEFAULT 'ACTIVO',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- INFORMACIÓN INSTITUCIONAL
-- Historia, misión, visión, valores
-- =========================
CREATE TABLE informacion_empresa (
    id_info INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('HISTORIA', 'MISION', 'VISION', 'VALORES') NOT NULL,
    titulo VARCHAR(150),
    contenido TEXT NOT NULL,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================
-- DATOS INICIALES
-- =========================

INSERT INTO roles (nombre, descripcion) VALUES
('ADMIN', 'Usuario administrador del sistema'),
('CLIENTE', 'Usuario cliente de la plataforma');

INSERT INTO estados_envio (nombre, descripcion) VALUES
('CREADO', 'El envío fue creado por el cliente'),
('EN_PROCESO', 'El envío está siendo procesado'),
('EN_TRANSITO', 'El paquete se encuentra en tránsito'),
('ENTREGADO', 'El paquete fue entregado correctamente'),
('CANCELADO', 'El envío fue cancelado');

INSERT INTO regiones (nombre, descripcion) VALUES
('Guatemala', 'Región central'),
('Occidente', 'Región occidental'),
('Oriente', 'Región oriental'),
('Norte', 'Región norte'),
('Sur', 'Región sur');

-- Usuario administrador de prueba
-- Contraseña : admin123
-- En backend debe guardarse encriptada 
INSERT INTO usuarios (
    id_rol,
    nombre_completo,
    correo,
    telefono,
    direccion,
    password_hash
) VALUES (
    1,
    'Administrador SkyShip',
    'admin@skyship.com',
    '00000000',
    'Oficina central',
    '$2b$10$'
);