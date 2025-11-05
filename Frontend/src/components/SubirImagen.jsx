import React, { useState } from "react";

export default function SubirImagen() {
  const [imagen, setImagen] = useState(null);
  const [idProducto, setIdProducto] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imagen) {
      setMensaje("❌ Debes seleccionar una imagen antes de subirla.");
      return;
    }

    const formData = new FormData();
    formData.append("imagen", imagen);
    if (idProducto) formData.append("id_producto", idProducto);

    try {
      const response = await fetch("http://localhost:3000/api/imagenes/subir", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje(`✅ ${data.message || "Imagen subida correctamente."}`);
      } else {
        setMensaje(`❌ ${data.message || "Error al subir imagen."}`);
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      setMensaje("❌ No se pudo conectar con el servidor.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Subir Imagen de Producto</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="number"
          placeholder="ID del Producto (opcional)"
          value={idProducto}
          onChange={(e) => setIdProducto(e.target.value)}
          style={styles.input}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagen(e.target.files[0])}
          style={styles.fileInput}
        />

        <button type="submit" style={styles.button}>
          Subir Imagen
        </button>
      </form>

      {mensaje && <p style={styles.message}>{mensaje}</p>}
    </div>
  );
}

// --- Estilos inline para hacerlo rápido ---
const styles = {
  container: {
    maxWidth: "400px",
    margin: "40px auto",
    padding: "20px",
    border: "2px solid #ccc",
    borderRadius: "12px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "20px",
  },
  input: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #aaa",
  },
  fileInput: {
    padding: "6px",
  },
  button: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "10px",
    cursor: "pointer",
  },
  message: {
    marginTop: "15px",
    fontWeight: "bold",
  },
};
