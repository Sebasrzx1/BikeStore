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
pais enum('Argentina','Colombia','Chile','Ecuador','Mexico')
);

# -------- Creación de la tabla pedidos. --------#
CREATE TABLE pedidos(
id_pedido int primary key auto_increment,
id_usuario int,
estado enum('En alistamiento','En envío','Entregados'),
fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
metodo_pago enum('Visa','Mastercard','Paypal'),
Numero_tarjeta bigint
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
stock int not null,
precio_unitario int,
material varchar(25),
peso varchar(10),
descripcion text,
imagen varchar(225),
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
('Sebastián', 'Ramírez', 'Administrador', 'sebas@bikestore.com', '$2b$10$JzH1KI1vB.7OqfldSq/l2O4aWaqnR/NbCz1wOEBMib.obQb0iV9AK', 3004567890, 'Calle 45 #23-10', 'Medellín', 'Antioquia', 050021, 'Colombia'),
('María', 'Gómez', 'Cliente', 'maria@gmail.com', '$2b$10$JzH1KI1vB.7OqfldSq/l2O4aWaqnR/NbCz1wOEBMib.obQb0iV9AK', 3105671234, 'Carrera 12 #45-56', 'Bogotá', 'Cundinamarca', 110111, 'Colombia'),
('Carlos', 'Lopez', 'Cliente', 'carlos@hotmail.com', 'cliente456', 3118904567, 'Av. 80 #45-23', 'Cali', 'Valle del Cauca', 760001, 'Colombia'),
('Ana', 'Martínez', 'Cliente', 'ana@gmail.com', 'cliente789', 3125670987, 'Calle 9 #10-22', 'Medellín', 'Antioquia', 050022, 'Colombia');

# INSERT INTO TABLA CATEGORIAS 
INSERT INTO categorias (nombre_categoria)
VALUES
('Bicicletas'),
('Repuestos'),
('Accesorios');

#  INSERT INTO TABLA PRODUCTOS

INSERT INTO productos (id_categoria, nombre_producto, marca, stock, precio_unitario, material, peso, descripcion, imagen)
VALUES
-- Bicicletas
(1, 'Bicicleta MTB Aro 29', 'Trek', 10, 2800000, 'Aluminio', '14kg', 'Bicicleta de montaña con 21 velocidades.', 'Bicicleta1.png'),
(1, 'Bicicleta Urbana', 'Giant', 12, 1800000, 'Acero', '12kg', 'Bicicleta urbana cómoda para ciudad.', 'Bicicleta2.png'),
(1, 'Bicicleta Infantil', 'Scott', 12, 950000, 'Aluminio', '8kg', 'Ideal para niños entre 6 y 9 años.', 'Bicicleta3.png'),
(1, 'Bicicleta de Ruta Carbono', 'Specialized', 13, 5200000, 'Fibra de carbono', '7.8kg', 'Bicicleta de ruta profesional ultraliviana.', 'Bicicleta4.png'),

-- Repuestos
(2, 'Llantas MTB 29"', 'Michelin', 13, 250000, 'Caucho', '2kg', 'Llantas con agarre para terrenos difíciles.', 'Repuesto2.webp'),
(2, 'Cadena Shimano 9v', 'Shimano', 14, 120000, 'Acero', '0.5kg', 'Cadena compatible con bicicletas de 9 velocidades.', 'Repuesto1.jpg'),
(2, 'Disco de freno hidráulico', 'SRAM', 15, 180000, 'Acero inoxidable', '0.7kg', 'Disco de freno de alto rendimiento.', 'Repuesto3.webp'),
(2, 'Sillín ergonómico', 'Prologo', 16, 160000, 'Cuero sintético', '0.5kg', 'Sillín diseñado para máximo confort.', 'Repuesto4.avif'),

-- Accesorios
(3, 'Casco de ciclismo', 'Specialized', 17, 250000, 'Policarbonato', '0.3kg', 'Casco ventilado con diseño aerodinámico.', 'Accesorio2.avif'),
(3, 'Guantes de ciclismo', 'Giro', 0, 85000, 'Lycra', '0.2kg', 'Guantes con agarre antideslizante.', 'Accesorio1.webp'),
(3, 'Luz delantera LED', 'Bontrager', 0, 60000, 'Plástico', '0.1kg', 'Luz LED recargable por USB.', 'Accesorio4.webp'),
(3, 'Gafas de ciclismo UV400', 'Oakley', 1, 210000, 'Policarbonato', '0.1kg', 'Gafas con protección solar y ventilación.', 'Accesorio3.webp');



# INSERT INTO TABLA PEDIDOS
INSERT INTO pedidos (id_usuario, estado)
VALUES
(2, 'En alistamiento'),
(2, 'En envío'),
(2, 'Entregados');

# INSERT INTO TABLA DETALLE_PEDIDO
INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, total)
VALUES
(1, 1, 1, 2800000), 
(2, 9, 1, 60000),  
(3, 8, 1, 85000); 