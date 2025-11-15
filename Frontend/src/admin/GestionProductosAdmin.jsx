import React, { useState, useEffect } from "react";
import axios from "axios";

const GestionProductosAdmin = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoActual, setProductoActual] = useState({
    nombre_producto: "",
    marca: "",
    id_categoria: "",
    precio_unitario: "",
    material: "",
    peso: "",
    descripcion: "",
    entradas: "",
    salidas: "",
    imagen: null,
  });
  const [imagenPreview, setImagenPreview] = useState(null);

  // ==========================
  // CARGAR PRODUCTOS Y CATEGORÍAS
  // ==========================
  const obtenerProductos = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/productos");
      setProductos(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error cargando productos:", err);
    }
  };

  const obtenerCategorias = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/categorias");
      setCategorias(res.data);
    } catch (err) {
      console.error("Error cargando categorías:", err);
    }
  };

  useEffect(() => {
    obtenerProductos();
    obtenerCategorias();
  }, []);

  // ==========================
  // ABRIR MODAL (CREAR)
  // ==========================
  const abrirModalCrear = () => {
    setModoEdicion(false);
    setProductoActual({
      nombre_producto: "",
      marca: "",
      id_categoria: "",
      precio_unitario: "",
      material: "",
      peso: "",
      descripcion: "",
      entradas: "",
      salidas: "",
      imagen: null,
    });
    setImagenPreview(null);
    setModalAbierto(true);
  };

  // ==========================
  // ABRIR MODAL (EDITAR)
  // ==========================
  const abrirModalEditar = (producto) => {
    setModoEdicion(true);
    setProductoActual({
      ...producto,
      imagen: null,
    });
    setImagenPreview(`http://localhost:3000/uploads/productos/${producto.imagen}`);
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
    const file = e.target.files[0];
    setProductoActual({
      ...productoActual,
      imagen: file,
    });
    setImagenPreview(URL.createObjectURL(file));
  };

  // ==========================
  // GUARDAR PRODUCTO (CREAR/EDITAR)
  // ==========================
  const guardarProducto = async () => {
    const formData = new FormData();
    Object.entries(productoActual).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      if (modoEdicion) {
        await axios.put(
          `http://localhost:3000/api/productos/${productoActual.id_producto}`,
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
      <h2>Gestión de Productos</h2>

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
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {productos.length === 0 ? (
            <tr>
              <td colSpan="7">No hay productos disponibles</td>
            </tr>
          ) : (
            productos.map((p) => (
              <tr key={p.id_producto}>
                <td>{p.nombre_producto}</td>
                <td>{p.marca}</td>
                <td>{p.id_categoria}</td>
                <td>${p.precio_unitario}</td>
                <td>{p.entradas - p.salidas}</td>
                <td>
                  <button className="btn-editar" onClick={() => abrirModalEditar(p)}>
                    Editar
                  </button>
                  <button className="btn-eliminar" onClick={() => eliminarProducto(p.id_producto)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ==========================
          MODAL CREAR / EDITAR
      ========================== */}
      {modalAbierto && (
        <div className="modal-fondo">
          <div className="modal">
            <h3>{modoEdicion ? "Editar Producto" : "Agregar Producto"}</h3>

            <div className="formulario">
              <input
                type="text"
                name="nombre_producto"
                value={productoActual.nombre_producto}
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

              <select
                name="id_categoria"
                value={productoActual.id_categoria}
                onChange={handleChange}
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map((c) => (
                  <option key={c.id_categoria} value={c.id_categoria}>
                    {c.nombre_categoria}
                  </option>
                ))}
              </select>

              <input
                type="number"
                name="precio_unitario"
                value={productoActual.precio_unitario}
                onChange={handleChange}
                placeholder="Precio"
              />

              <input
                type="text"
                name="material"
                value={productoActual.material}
                onChange={handleChange}
                placeholder="Material"
              />

              <input
                type="text"
                name="peso"
                value={productoActual.peso}
                onChange={handleChange}
                placeholder="Peso"
              />

              <textarea
                name="descripcion"
                value={productoActual.descripcion}
                onChange={handleChange}
                placeholder="Descripción"
              />

              <input
                type="number"
                name="entradas"
                value={productoActual.entradas}
                onChange={handleChange}
                placeholder="Entradas"
              />

              <input
                type="number"
                name="salidas"
                value={productoActual.salidas}
                onChange={handleChange}
                placeholder="Salidas"
              />

              <label>Imagen del producto:</label>
              <input type="file" onChange={handleImagen} />
              {imagenPreview && (
                <img
                  src={imagenPreview}
                  alt="Vista previa"
                  width="100"
                  style={{ marginTop: "10px", borderRadius: "6px" }}
                />
              )}

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

export default GestionProductosAdmin;
