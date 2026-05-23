-- Usar la base de datos existente
USE skyship_express;

-- Crear la tabla para destinos internacionales
CREATE TABLE destinos_internacionales (
    id_destino INT AUTO_INCREMENT PRIMARY KEY,
    pais VARCHAR(100) NOT NULL UNIQUE,
    continente VARCHAR(100) NOT NULL,
    precio_base DECIMAL(10, 2) NOT NULL,
    estado ENUM('ACTIVO', 'INACTIVO') DEFAULT 'ACTIVO'
);

-- Insertar datos de ejemplo (5 por continente)
INSERT INTO destinos_internacionales (pais, continente, precio_base) VALUES
-- América
('Estados Unidos', 'América', 150.00),
('Canadá', 'América', 160.00),
('México', 'América', 120.00),
('Brasil', 'América', 250.00),
('Argentina', 'América', 260.00),

-- Europa
('España', 'Europa', 300.00),
('Alemania', 'Europa', 320.00),
('Francia', 'Europa', 310.00),
('Reino Unido', 'Europa', 330.00),
('Italia', 'Europa', 315.00),

-- Asia
('Japón', 'Asia', 450.00),
('China', 'Asia', 420.00),
('Corea del Sur', 'Asia', 460.00),
('India', 'Asia', 400.00),
('Singapur', 'Asia', 480.00),

-- África
('Sudáfrica', 'África', 380.00),
('Nigeria', 'África', 390.00),
('Egipto', 'África', 370.00),
('Kenia', 'África', 400.00),
('Marruecos', 'África', 360.00),

-- Oceanía
('Australia', 'Oceanía', 500.00),
('Nueva Zelanda', 'Oceanía', 520.00),
('Fiyi', 'Oceanía', 550.00),
('Papúa Nueva Guinea', 'Oceanía', 560.00),
('Samoa', 'Oceanía', 570.00);

-- Mensaje de confirmación
SELECT 'Tabla destinos_internacionales creada y poblada con éxito.' AS 'Estado';
