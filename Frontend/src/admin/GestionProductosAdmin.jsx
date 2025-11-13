import React, { useEffect, useState } from "react";
import axios from "axios";
const GestionProductosAdmin = () => {
  const [productos, setProductos] = useState([]);
  const [formulario, setFormulario] = useState({
    id_producto: "",
    nombre_producto: "",
    marca: "",
    precio_unitario: "",
    descripcion: "",
  });
  const [imagen, setImagen] = useState(null);

  // Obtener productos al cargar
  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/productos");
      setProductos(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  // Cargar datos al seleccionar producto
  const cargarProducto = (producto) => {
    setFormulario({
      id_producto: producto.id_producto,
      nombre_producto: producto.nombre_producto,
      marca: producto.marca,
      precio_unitario: producto.precio_unitario,
      descripcion: producto.descripcion,
    });
  };

  // Editar producto
  const editarProducto = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3000/api/productos/${formulario.id_producto}`,
        formulario
      );
      alert("✅ Producto actualizado correctamente");
      obtenerProductos();
    } catch (error) {
      console.error(error);
      alert("❌ Error al actualizar producto");
    }
  };

  // Subir imagen
  const subirImagen = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("imagen", imagen);
    formData.append("id_producto", formulario.id_producto);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/imagenes/subir",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert(res.data.message);
      obtenerProductos();
    } catch (error) {
      console.error(error);
      alert("❌ Error al subir imagen");
    }
  };

  // Eliminar producto
  const eliminarProducto = async (id) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar este producto?"
    );
    if (!confirmar) return;

    try {
      await axios.delete(`http://localhost:3000/api/productos/${id}`);
      alert("🗑️ Producto eliminado correctamente");
      obtenerProductos();
    } catch (error) {
      console.error(error);
      alert("❌ Error al eliminar producto");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2 style={{ color: "#2c3e50" }}>🛒 Lista de Productos</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {productos.map((p) => (
          <div
            key={p.id_producto}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              width: "250px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h4>{p.nombre_producto}</h4>
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
            <div
              style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}
            >
              <button
                onClick={() => cargarProducto(p)}
                style={{
                  padding: "0.5rem",
                  backgroundColor: "#3498db",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Editar
              </button>
              <button
                onClick={() => eliminarProducto(p.id_producto)}
                style={{
                  padding: "0.5rem",
                  backgroundColor: "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <hr style={{ margin: "2rem 0" }} />

      <h3 style={{ color: "#2c3e50" }}>✏️ Editar Producto</h3>
      <form
        onSubmit={editarProducto}
        style={{
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <input
          type="hidden"
          name="id_producto"
          value={formulario.id_producto}
        />
        <label>Nombre:</label>
        <input
          type="text"
          name="nombre_producto"
          value={formulario.nombre_producto}
          onChange={handleChange}
          required
        />
        <label>Marca:</label>
        <input
          type="text"
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
          rows="3"
        />
        <button
          type="submit"
          style={{
            marginTop: "1rem",
            backgroundColor: "#27ae60",
            color: "white",
            padding: "0.5rem",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Guardar Cambios
        </button>
      </form>

      <h3 style={{ marginTop: "2rem", color: "#2c3e50" }}>📤 Subir Imagen</h3>
      <form
        onSubmit={subirImagen}
        style={{
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <input
          type="file"
          onChange={(e) => setImagen(e.target.files[0])}
          required
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#e67e22",
            color: "white",
            padding: "0.5rem",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Subir Imagen
        </button>
      </form>
    </div>
  );
};

export default GestionProductosAdmin;