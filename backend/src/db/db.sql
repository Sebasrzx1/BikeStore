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


#------- INSERT INTO de prueba -----------#

# -------- Insertar datos en usuarios --------#
INSERT INTO usuarios (nombre, apellido, rol, email, contraseña, telefono, direccion, ciudad, departamento, codigo_postal, pais)
VALUES
('Sebastián', 'Ramírez', 'Administrador', 'sebas@bikestore.com', '12345', 3001234567, 'Calle 10 #5-20', 'Medellín', 'Antioquia', 050001, 'Colombia'),
('María', 'González', 'Cliente', 'maria@correo.com', '54321', 3209876543, 'Carrera 45 #15-30', 'Bogotá', 'Cundinamarca', 110111, 'Colombia');

# -------- Insertar datos en categorias --------#
INSERT INTO categorias (nombre_categoria)
VALUES
('Bicicletas'),
('Accesorios');

# -------- Insertar datos en productos --------#
INSERT INTO productos (id_categoria, nombre_producto, marca, precio_unitario, material, peso, descripcion, imagen, entradas, salidas)
VALUES
(1, 'Bicicleta Montañera', 'Trek', 2500000, 'Aluminio', '14kg', 'Bicicleta todo terreno ideal para caminos difíciles', 'img/bici1.jpg', 10, 2),
(2, 'Casco Profesional', 'Giro', 350000, 'Policarbonato', '0.5kg', 'Casco liviano con excelente ventilación', 'img/casco1.jpg', 15, 5);

# -------- Insertar datos en pedidos --------#
INSERT INTO pedidos (id_usuario, estado)
VALUES
(2, 'En alistamiento'),
(2, 'En envío');

# -------- Insertar datos en detalle_pedido --------#
INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, total)
VALUES
(1, 1, 1, 2500000),
(2, 2, 2, 700000);
