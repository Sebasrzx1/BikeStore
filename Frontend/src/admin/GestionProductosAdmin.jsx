import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:3000/api";

export default function GestionProductosAdmin() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const [formulario, setFormulario] = useState({
    id_producto: "",
    nombre_producto: "",
    marca: "",
    precio_unitario: "",
    descripcion: "",
  });

  const [imagen, setImagen] = useState(null);

  // =============================
  // Cargar productos al iniciar
  // =============================
  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      const res = await axios.get(`${API}/productos`);
      setProductos(res.data);
    } catch (error) {
      console.error("Error al obtener productos", error);
    }
  };

  // =============================
  // Manejar formulario
  // =============================
  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  // =============================
  // Cargar producto en inputs (Modo edición)
  // =============================
  const cargarProducto = (p) => {
    setFormulario({
      id_producto: p.id_producto,
      nombre_producto: p.nombre_producto,
      marca: p.marca,
      precio_unitario: p.precio_unitario,
      descripcion: p.descripcion,
    });
  };

// =======================
// CREAR PRODUCTO CON IMAGEN
// =======================
const crearProducto = async (e) => {
  e.preventDefault();

  if (!imagen) {
    return alert("Debes seleccionar una imagen para el producto");
  }

  const formData = new FormData();
  formData.append("nombre_producto", formulario.nombre_producto);
  formData.append("marca", formulario.marca);
  formData.append("precio_unitario", formulario.precio_unitario);
  formData.append("descripcion", formulario.descripcion);
  formData.append("imagen", imagen); // 👈 AÑADIMOS LA IMAGEN

  try {
    await axios.post(`${API}/productos`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("✅ Producto creado con imagen");

    limpiarFormulario();
    obtenerProductos();
  } catch (error) {
    console.error(error);
    alert("❌ Error al crear producto");
  }
};

  // =============================
  // Editar producto
  // =============================
  const editarProducto = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${API}/productos/${formulario.id_producto}`, formulario);
      alert("✏️ Producto actualizado");
      obtenerProductos();
    } catch (error) {
      console.error(error);
      alert("❌ Error al editar");
    }
  };

  // =============================
  // Subir imagen
  // =============================
  const subirImagen = async (e) => {
    e.preventDefault();

    if (!imagen) return alert("Debes seleccionar una imagen");
    if (!formulario.id_producto)
      return alert("Debes seleccionar un producto primero");

    const formData = new FormData();
    formData.append("imagen", imagen);
    formData.append("id_producto", formulario.id_producto);

    try {
      const res = await axios.post(`${API}/imagenes/subir`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("📸 Imagen subida correctamente");
      obtenerProductos();
    } catch (error) {
      console.error(error);
      alert("❌ Error al subir imagen");
    }
  };

  // =============================
  // Eliminar producto
  // =============================
  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;

    try {
      await axios.delete(`${API}/productos/${id}`);
      alert("🗑 Producto eliminado");
      obtenerProductos();
    } catch (error) {
      console.error(error);
      alert("❌ No se pudo eliminar");
    }
  };

  // =============================
  // Limpiar formulario
  // =============================
  const limpiarFormulario = () => {
    setFormulario({
      id_producto: "",
      nombre_producto: "",
      marca: "",
      precio_unitario: "",
      descripcion: "",
    });
    setImagen(null);
  };

  // =============================
  // Filtrar productos por búsqueda
  // =============================
  const productosFiltrados = productos.filter((p) =>
    p.nombre_producto.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🛠 Gestión de Productos</h1>

      {/* =============================
           BUSCADOR
      ============================= */}
      <input
        type="text"
        placeholder="🔍 Buscar producto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{
          padding: "8px",
          width: "300px",
          marginBottom: "20px",
        }}
      />

      {/* =============================
           LISTA DE PRODUCTOS
      ============================= */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "3rem",
        }}
      >
        {productosFiltrados.map((p) => (
          <div
            key={p.id_producto}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              width: "250px",
              borderRadius: "8px",
            }}
          >
            <h3>{p.nombre_producto}</h3>
            <p>
              <strong>Marca:</strong> {p.marca}
            </p>
            <p>
              <strong>Precio:</strong> ${p.precio_unitario}
            </p>

            {p.imagen && (
              <img
                src={`http://localhost:3000${p.imagen}`}
                alt="producto"
                style={{ width: "100%", borderRadius: "4px" }}
              />
            )}

            <button
              onClick={() => cargarProducto(p)}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "8px",
                background: "#3498db",
                color: "white",
                border: "none",
              }}
            >
              Editar
            </button>

            <button
              onClick={() => eliminarProducto(p.id_producto)}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "8px",
                background: "#e74c3c",
                color: "white",
                border: "none",
              }}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      {/* =============================
           FORMULARIO EDITAR
      ============================= */}
      <h2>✏️ Editar Producto</h2>

      <form
        onSubmit={editarProducto}
        style={{
          width: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <input
          type="hidden"
          name="id_producto"
          value={formulario.id_producto}
        />

        <label>Nombre:</label>
        <input
          name="nombre_producto"
          value={formulario.nombre_producto}
          onChange={handleChange}
          required
        />

        <label>Marca:</label>
        <input
          name="marca"
          value={formulario.marca}
          onChange={handleChange}
          required
        />

        <label>Precio:</label>
        <input
          type="number"
          name="precio_unitario"
          value={formulario.precio_unitario}
          onChange={handleChange}
          required
        />

        <label>Descripción:</label>
        <textarea
          name="descripcion"
          value={formulario.descripcion}
          onChange={handleChange}
          rows={3}
        ></textarea>

        <button
          type="submit"
          style={{ padding: "10px", background: "#27ae60", color: "white" }}
        >
          Guardar Cambios
        </button>
      </form>

      {/* =============================
           SUBIR IMAGEN
      ============================= */}
      <h2 style={{ marginTop: "2rem" }}>📸 Subir Imagen</h2>

      <form
        onSubmit={subirImagen}
        style={{ width: "400px", display: "flex", flexDirection: "column" }}
      >
        <input type="file" onChange={(e) => setImagen(e.target.files[0])} />

        <button
          type="submit"
          style={{ padding: "10px", background: "#e67e22", color: "white" }}
        >
          Subir Imagen
        </button>
      </form>

      {/* =============================
           CREAR PRODUCTO
      ============================= */}
      <h2 style={{ marginTop: "3rem" }}>➕ Crear Producto</h2>

      <form
        onSubmit={crearProducto}
        style={{ width: "400px", display: "flex", flexDirection: "column" }}
      >
        <label>Nombre:</label>
        <input
          name="nombre_producto"
          value={formulario.nombre_producto}
          onChange={handleChange}
          required
        />

        <label>Marca:</label>
        <input
          name="marca"
          value={formulario.marca}
          onChange={handleChange}
          required
        />

        <label>Precio:</label>
        <input
          name="precio_unitario"
          type="number"
          value={formulario.precio_unitario}
          onChange={handleChange}
          required
        />

        <label>Descripción:</label>
        <textarea
          name="descripcion"
          rows={3}
          value={formulario.descripcion}
          onChange={handleChange}
        ></textarea>

        <button
          type="submit"
          style={{
            padding: "10px",
            background: "#8e44ad",
            color: "white",
            marginTop: "10px",
          }}
        >
          Crear Producto
        </button>
      </form>
    </div>
  );
}