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

# -------- Creación de la tabla Estados para los pedidos. --------#
CREATE TABLE estados(
id_estado int primary key auto_increment,
nombre_estado enum('En alistamiento','En envio','Entregado'),
fecha_estado date
);

# -------- Creación de la tabla pedidos. --------#
CREATE TABLE pedidos(
id_pedido int primary key auto_increment,
id_usuario int,
id_estado int,
CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
CONSTRAINT fk_estado FOREIGN KEY (id_estado) REFERENCES estados(id_estado)
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
nombre_producto varchar(30),
marca varchar(30),
stock int,
precio_unitario int,
CONSTRAINT fk_categoria FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);

# -------- Creación de la tabla detalle_pedido. --------#
CREATE TABLE detalle_pepido(
id_detalle int primary key auto_increment,
id_pedido int,
id_producto int,
cantidad int,
total int,
CONSTRAINT fk_pedido FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido),
CONSTRAINT fk_producto FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);



