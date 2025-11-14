// src/admin/GestionProductos.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const GestionProductos = () => {
  const [productos, setProductos] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoActual, setProductoActual] = useState({
    nombre: "",
    marca: "",
    categoria: "",
    precio: "",
    stock: "",
    descripcion: "",
    imagen: null,
  });

  // ==========================
  // CARGAR PRODUCTOS
  // ==========================
  const obtenerProductos = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/productos");
      setProductos(res.data);
    } catch (err) {
      console.error("Error cargando productos:", err);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  // ==========================
  // ABRIR MODAL (CREAR)
  // ==========================
  const abrirModalCrear = () => {
    setModoEdicion(false);
    setProductoActual({
      nombre: "",
      marca: "",
      categoria: "",
      precio: "",
      stock: "",
      descripcion: "",
      imagen: null,
    });
    setModalAbierto(true);
  };

  // ==========================
  // ABRIR MODAL (EDITAR)
  // ==========================
  const abrirModalEditar = (producto) => {
    setModoEdicion(true);
    setProductoActual({
      id: producto.id,
      nombre: producto.nombre,
      marca: producto.marca,
      categoria: producto.categoria,
      precio: producto.precio,
      stock: producto.stock,
      descripcion: producto.descripcion,
      imagen: null,
    });
    setModalAbierto(true);
  };

  // ==========================
  // CAMBIOS EN INPUTS
  // ==========================
  const handleChange = (e) => {
    setProductoActual({
      ...productoActual,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================
  // CARGAR IMAGEN
  // ==========================
  const handleImagen = (e) => {
    setProductoActual({
      ...productoActual,
      imagen: e.target.files[0],
    });
  };

  // ==========================
  // GUARDAR PRODUCTO (CREAR/EDITAR)
  // ==========================
  const guardarProducto = async () => {
    const formData = new FormData();
    formData.append("nombre", productoActual.nombre);
    formData.append("marca", productoActual.marca);
    formData.append("categoria", productoActual.categoria);
    formData.append("precio", productoActual.precio);
    formData.append("stock", productoActual.stock);
    formData.append("descripcion", productoActual.descripcion);

    if (productoActual.imagen) {
      formData.append("imagen", productoActual.imagen);
    }

    try {
      if (modoEdicion) {
        await axios.put(
          `http://localhost:3000/api/productos/${productoActual.id}`,
          formData
        );
      } else {
        await axios.post("http://localhost:3000/api/productos", formData);
      }

      obtenerProductos();
      setModalAbierto(false);
    } catch (err) {
      console.error("Error guardando producto:", err);
    }
  };

  // ==========================
  // ELIMINAR PRODUCTO
  // ==========================
  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Seguro que desea eliminar este producto?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/productos/${id}`);
      obtenerProductos();
    } catch (err) {
      console.error("Error eliminando producto:", err);
    }
  };

  return (
    <div className="gestion-container">
      {/* Botón agregar */}
      <div className="header-actions">
        <button className="btn-agregar" onClick={abrirModalCrear}>
          + Agregar Producto
        </button>
      </div>

      {/* Lista de productos */}
      <table className="tabla-productos">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Marca</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {productos.map((p) => (
            <tr key={p.id_producto}>
              <td>{p.nombre_producto}</td>
              <td>{p.marca}</td>
              <td>{p.id_categoria}</td>
              <td>${p.precio_unitario}</td>
              <td>{p.stock}</td>

              <td>
                <img
                  src={`http://localhost:3000/${p.imagen}`}
                  alt={p.nombre_producto}
                  width="50"
                  height="50"
                  style={{ objectFit: "cover", borderRadius: "6px" }}
                />
              </td>

              <td>
                <button
                  className="btn-editar"
                  onClick={() => abrirModalEditar(p)}
                >
                  Editar
                </button>
                <button
                  className="btn-eliminar"
                  onClick={() => eliminarProducto(p.id_producto)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ==========================
          MODAL CREAR / EDITAR
      ========================== */}
      {modalAbierto && (
        <div className="modal-fondo">
          <div className="modal">
            <h2>{modoEdicion ? "Editar Producto" : "Agregar Producto"}</h2>

            <div className="formulario">
              <input
                type="text"
                name="nombre"
                value={productoActual.nombre}
                onChange={handleChange}
                placeholder="Nombre del producto"
              />

              <input
                type="text"
                name="marca"
                value={productoActual.marca}
                onChange={handleChange}
                placeholder="Marca"
              />

              <input
                type="text"
                name="categoria"
                value={productoActual.categoria}
                onChange={handleChange}
                placeholder="Categoría"
              />

              <input
                type="number"
                name="precio"
                value={productoActual.precio}
                onChange={handleChange}
                placeholder="Precio"
              />

              <input
                type="number"
                name="stock"
                value={productoActual.stock}
                onChange={handleChange}
                placeholder="Stock disponible"
              />

              <textarea
                name="descripcion"
                value={productoActual.descripcion}
                onChange={handleChange}
                placeholder="Descripción"
              />

              <label>Imagen del producto:</label>
              <input type="file" onChange={handleImagen} />

              <div className="modal-acciones">
                <button onClick={() => setModalAbierto(false)}>Cancelar</button>
                <button onClick={guardarProducto}>
                  {modoEdicion ? "Guardar Cambios" : "Crear Producto"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionProductos;
