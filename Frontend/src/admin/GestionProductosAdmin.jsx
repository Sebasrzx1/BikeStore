// src/admin/GestionProductosAdmin.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";
import "../styles/GestionProductosAdmin.css";

const GestionProductosAdmin = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoActual, setProductoActual] = useState({
    id_producto: null,
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

  // Cargar productos y categorías
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

  // Abrir modal crear
  const abrirModalCrear = () => {
    setModoEdicion(false);
    setProductoActual({
      id_producto: null,
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

  // Abrir modal editar
  const abrirModalEditar = (producto) => {
    setModoEdicion(true);

    setProductoActual({
      id_producto: producto.id_producto,
      nombre_producto: producto.nombre_producto || "",
      marca: producto.marca || "",
      id_categoria: producto.id_categoria || "",
      precio_unitario: producto.precio_unitario || "",
      material: producto.material || "",
      peso: producto.peso || "",
      descripcion: producto.descripcion || "",
      entradas: producto.entradas || "",
      salidas: producto.salidas || "",
      imagen: null, // no enviar la imagen original; solo enviar si el usuario selecciona un File
    });

    setImagenPreview(
      producto.imagen ? `http://localhost:3000/uploads/productos/${producto.imagen}` : null
    );

    setModalAbierto(true);
  };

  // Cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductoActual((prev) => ({ ...prev, [name]: value }));
  };

  // Cargar imagen (selección)
  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProductoActual((prev) => ({ ...prev, imagen: file }));
    setImagenPreview(URL.createObjectURL(file));
  };

  // Guardar producto (crear / editar)
  const guardarProducto = async () => {
    try {
      const formData = new FormData();

      // Añadir sólo campos con valor (evitar undefined)
      Object.entries(productoActual).forEach(([key, value]) => {
        if (value === null || value === undefined) return;
        // Para imagen, sólo si es un File
        if (key === "imagen") {
          if (value instanceof File) {
            formData.append("imagen", value);
          }
          return;
        }
        formData.append(key, value);
      });

      if (modoEdicion) {
        await axios.put(
          `http://localhost:3000/api/productos/${productoActual.id_producto}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        await axios.post("http://localhost:3000/api/productos", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      await obtenerProductos();
      setModalAbierto(false);
    } catch (err) {
      console.error("Error guardando producto:", err);
      alert("Ocurrió un error guardando el producto. Revisa la consola del servidor.");
    }
  };

  // Eliminar producto
  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Seguro que desea eliminar este producto?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/productos/${id}`);
      obtenerProductos();
    } catch (err) {
      console.error("Error eliminando producto:", err);
      alert("Error eliminando producto. Revisa la consola del servidor.");
    }
  };

  return (
    <div className="ContGestProduct">
      <AdminNavbar />
      <div className="gestion-container">
        <h2>Gestión de Productos</h2>

        <div className="header-actions">
          <button className="btn-agregar" onClick={abrirModalCrear}>
            + Agregar Producto
          </button>
        </div>

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

        {modalAbierto && (
          <div className="modal-fondo">
            <div className="modal">
              <h3>{modoEdicion ? "Editar Producto" : "Agregar Producto"}</h3>

              <div className="formulario">
                <input type="text" name="nombre_producto" value={productoActual.nombre_producto}
                  onChange={handleChange} placeholder="Nombre del producto" />

                <input type="text" name="marca" value={productoActual.marca}
                  onChange={handleChange} placeholder="Marca" />

                <select name="id_categoria" value={productoActual.id_categoria} onChange={handleChange}>
                  <option value="">Seleccionar categoría</option>
                  {categorias.map((c) => (
                    <option key={c.id_categoria} value={c.id_categoria}>{c.nombre_categoria}</option>
                  ))}
                </select>

                <input type="number" name="precio_unitario" value={productoActual.precio_unitario}
                  onChange={handleChange} placeholder="Precio" />

                <input type="text" name="material" value={productoActual.material}
                  onChange={handleChange} placeholder="Material" />

                <input type="text" name="peso" value={productoActual.peso}
                  onChange={handleChange} placeholder="Peso" />

                <textarea name="descripcion" value={productoActual.descripcion}
                  onChange={handleChange} placeholder="Descripción" />

                <input type="number" name="entradas" value={productoActual.entradas}
                  onChange={handleChange} placeholder="Entradas" />

                <input type="number" name="salidas" value={productoActual.salidas}
                  onChange={handleChange} placeholder="Salidas" />

                <label>Imagen del producto:</label>
                <input type="file" accept="image/*" onChange={handleImagen} />
                {imagenPreview && <img src={imagenPreview} alt="Vista previa" width="100" style={{ marginTop: "10px", borderRadius: "6px" }} />}

                <div className="modal-acciones">
                  <button onClick={() => setModalAbierto(false)}>Cancelar</button>
                  <button onClick={guardarProducto}>{modoEdicion ? "Guardar Cambios" : "Crear Producto"}</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default GestionProductosAdmin;
