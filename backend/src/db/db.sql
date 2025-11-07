CREATE DATABASE bikestore_sebas;
USE bikestore_sebas;

# -------- Creación de la tabla usuarios (Clientes y administradores) -----------#
CREATE TABLE usuarios(
id_usuario int primary key auto_increment,
nombre varchar(30),
apellido varchar(30),
rol enum('Administrador','Cliente'),
email varchar(100),
contraseña varchar(200),
telefono bigint,
direccion varchar(100),
ciudad varchar(25),
departamento varchar(25),
codigo_postal int,
pais enum('Argentina','Colombia','Chile','Ecuador','Brazil','Mexico')
);

# -------- Creación de la tabla pedidos. --------#
CREATE TABLE pedidos(
id_pedido int primary key auto_increment,
id_usuario int,
estado enum('En alistamiento','En envío','Entregados'),
fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

# -------- Creación de la tabla categorias --------#
CREATE TABLE categorias(
id_categoria int primary key auto_increment,
nombre_categoria varchar(25)
);

# -------- Creación de la tabla Productos. --------#
CREATE TABLE productos (
id_producto int primary key auto_increment,
id_categoria int,
nombre_producto varchar(30) not null,
marca varchar(30),
stock int as (entradas - salidas) virtual,
precio_unitario int,
material varchar(25),
peso varchar(10),
descripcion text,
imagen varchar(225),
entradas int,
salidas int,
CONSTRAINT fk_categoria FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);

# -------- Creación de la tabla detalle_pedido. --------#
CREATE TABLE detalle_pedido(
id_detalle int primary key auto_increment,
id_pedido int,
id_producto int,
cantidad int,
total int,
CONSTRAINT fk_pedido FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido),
CONSTRAINT fk_producto FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);



#------- INSERT INTO DE PRUEBA ----------#

# INSERT INTO TABLA USUARIOS
INSERT INTO usuarios (nombre, apellido, rol, email, contraseña, telefono, direccion, ciudad, departamento, codigo_postal, pais)
VALUES
('Sebastián', 'Ramírez', 'Administrador', 'sebas@bikestore.com', 'admin123', 3004567890, 'Calle 45 #23-10', 'Medellín', 'Antioquia', 050021, 'Colombia'),
('María', 'Gómez', 'Cliente', 'maria@gmail.com', 'cliente123', 3105671234, 'Carrera 12 #45-56', 'Bogotá', 'Cundinamarca', 110111, 'Colombia'),
('Carlos', 'Lopez', 'Cliente', 'carlos@hotmail.com', 'cliente456', 3118904567, 'Av. 80 #45-23', 'Cali', 'Valle del Cauca', 760001, 'Colombia'),
('Ana', 'Martínez', 'Cliente', 'ana@gmail.com', 'cliente789', 3125670987, 'Calle 9 #10-22', 'Medellín', 'Antioquia', 050022, 'Colombia');

# INSERT INTO TABLA CATEGORIAS 
INSERT INTO categorias (nombre_categoria)
VALUES
('Bicicletas'),
('Repuestos'),
('Accesorios');

#  INSERT INTO TABLA PRODUCTOS
INSERT INTO productos (id_categoria, nombre_producto, marca, precio_unitario, material, peso, descripcion, imagen, entradas, salidas)
VALUES
-- Bicicletas
(1, 'Bicicleta MTB Aro 29', 'Trek', 2800000, 'Aluminio', '14kg', 'Bicicleta de montaña con 21 velocidades.', 'uploads/productos/1762359316974.webp', 15, 3),
(1, 'Bicicleta Urbana', 'Giant', 1800000, 'Acero', '12kg', 'Bicicleta urbana cómoda para ciudad.', 'urbana_giant.jpg', 10, 2),
(1, 'Bicicleta Infantil', 'Scott', 950000, 'Aluminio', '8kg', 'Ideal para niños entre 6 y 9 años.', 'infantil_scott.jpg', 8, 1),
(1, 'Bicicleta de Ruta Carbono', 'Specialized', 5200000, 'Fibra de carbono', '7.8kg', 'Bicicleta de ruta profesional ultraliviana.', 'ruta_specialized.jpg', 6, 1),

-- Repuestos
(2, 'Llantas MTB 29"', 'Michelin', 250000, 'Caucho', '2kg', 'Llantas con agarre para terrenos difíciles.', 'llantas_mtb.jpg', 25, 5),
(2, 'Cadena Shimano 9v', 'Shimano', 120000, 'Acero', '0.5kg', 'Cadena compatible con bicicletas de 9 velocidades.', 'cadena_shimano.jpg', 30, 7),
(2, 'Disco de freno hidráulico', 'SRAM', 180000, 'Acero inoxidable', '0.7kg', 'Disco de freno de alto rendimiento.', 'disco_freno.jpg', 20, 4),
(2, 'Sillín ergonómico', 'Prologo', 160000, 'Cuero sintético', '0.5kg', 'Sillín diseñado para máximo confort.', 'sillin_prologo.jpg', 18, 2),

-- Accesorios
(3, 'Casco de ciclismo', 'Specialized', 250000, 'Policarbonato', '0.3kg', 'Casco ventilado con diseño aerodinámico.', 'casco_specialized.jpg', 40, 10),
(3, 'Guantes de ciclismo', 'Giro', 85000, 'Lycra', '0.2kg', 'Guantes con agarre antideslizante.', 'guantes_giro.jpg', 50, 15),
(3, 'Luz delantera LED', 'Bontrager', 60000, 'Plástico', '0.1kg', 'Luz LED recargable por USB.', 'luz_led.jpg', 35, 5),
(3, 'Gafas de ciclismo UV400', 'Oakley', 210000, 'Policarbonato', '0.1kg', 'Gafas con protección solar y ventilación.', 'gafas_oakley.jpg', 30, 8);


# INSERT INTO TABLA PEDIDOS
INSERT INTO pedidos (id_usuario, estado)
VALUES
(2, 'En alistamiento'),
(3, 'En envío'),
(4, 'Entregados');

# INSERT INTO TABLA DETALLE_PEDIDO
INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, total)
VALUES
(1, 1, 1, 2800000),  -- María compra una MTB
(1, 7, 1, 250000),   -- y un casco
(2, 4, 2, 500000),   -- Carlos compra 2 llantas MTB
(3, 9, 1, 60000),    -- Ana compra una luz LED
(3, 8, 1, 85000);    -- y unos guantes

select*from categorias;