// GestionProductosAdmin.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";
import ProductoModal from "../components/ProductoModal";
import "../styles/GestionProductosAdmin.css";
import TablaProductos from "../components/TablaProductos";

const GestionProductosAdmin = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  // 🔥 Producto base con STOCK (sin entradas/salidas)
  const [productoActual, setProductoActual] = useState({
    id_producto: null,
    nombre_producto: "",
    marca: "",
    id_categoria: "",
    precio_unitario: "",
    material: "",
    peso: "",
    descripcion: "",
    stock: 0,
    stock_actual: 0, // Para mostrar en edición
    cantidad_a_agregar: 0, // Para añadir en edición
    imagen: null,
  });

  const [imagenPreview, setImagenPreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ============================
  //  GET productos y categorías
  // ============================
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

  const obtenerNombreCategoria = (id) => {
    const cat = categorias.find((c) => Number(c.id_categoria) === Number(id));
    return cat ? cat.nombre_categoria : "Sin categoría";
  };

  // ============================
  //   BUSCADOR
  // ============================
  const productosFiltrados = productos.filter(
    (p) =>
      p.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.marca.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ============================
  //      CREAR PRODUCTO
  // ============================
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
      stock: 0,
      stock_actual: 0,
      cantidad_a_agregar: 0,
      imagen: null,
    });
    setImagenPreview(null);
    setModalAbierto(true);
  };

  // ============================
  //     EDITAR PRODUCTO
  // ============================
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
      stock: producto.stock || 0, // Este será el nuevo stock total
      stock_actual: producto.stock || 0, // Mostrar el actual
      cantidad_a_agregar: 0, // Resetear para añadir
      imagen: null, // se setea aparte
    });

    setImagenPreview(
      producto.imagen
        ? `http://localhost:3000/uploads/productos/${producto.imagen}`
        : null
    );

    setModalAbierto(true);
  };

  // ============================
  //     HANDLE INPUTS
  // ============================
  const handleChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;
    // Parsear a número los campos numéricos
    if (["cantidad_a_agregar", "stock", "precio_unitario", "stock_actual"].includes(name)) {
      parsedValue = parseFloat(value) || 0;
    }
    setProductoActual((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProductoActual((prev) => ({ ...prev, imagen: file }));
    setImagenPreview(URL.createObjectURL(file));
  };

  // ============================
  //     GUARDAR PRODUCTO
  // ============================
  const guardarProducto = async () => {
    try {
      const formData = new FormData();

      // Calcular stock total si es edición
      let stockFinal = productoActual.stock;
      if (modoEdicion) {
        stockFinal = productoActual.stock_actual + productoActual.cantidad_a_agregar;
      }

      // Campos a enviar al backend (excluye stock_actual y cantidad_a_agregar)
      const camposPermitidos = [
        "id_producto",
        "nombre_producto",
        "marca",
        "id_categoria",
        "precio_unitario",
        "material",
        "peso",
        "descripcion",
        "stock",
        "imagen"
      ];

      camposPermitidos.forEach((key) => {
        let value = productoActual[key];
        if (value === null || value === undefined) return;

        if (key === "imagen") {
          if (value instanceof File) formData.append("imagen", value);
          return;
        }

        // Usar stockFinal para stock
        if (key === "stock") {
          formData.append(key, stockFinal);
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
      alert("Ocurrió un error guardando el producto.");
    }
  };

  // ============================
  //      ELIMINAR PRODUCTO
  // ============================
  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Seguro que desea eliminar este producto?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/productos/${id}`);
      obtenerProductos();
    } catch (err) {
      console.error("Error eliminando producto:", err);
      alert("Error eliminando producto.");
    }
  };

  // ============================
  //          RENDER
  // ============================
  return (
    <div className="ContGestProduct">
      <AdminNavbar />

      <div className="gestion-container">
        <h2>Gestión de Productos</h2>

        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <button className="btn-agregar" onClick={abrirModalCrear}>
            + Agregar Producto
          </button>
        </div>

        <TablaProductos
          productos={productosFiltrados}
          categorias={categorias}
          obtenerNombreCategoria={obtenerNombreCategoria}
          abrirModalEditar={abrirModalEditar}
          eliminarProducto={eliminarProducto}
        />

        <ProductoModal
          abierto={modalAbierto}
          modoEdicion={modoEdicion}
          productoActual={productoActual}
          categorias={categorias}
          imagenPreview={imagenPreview}
          onCerrar={() => setModalAbierto(false)}
          onChange={handleChange}
          onImagenChange={handleImagen}
          onGuardar={guardarProducto}
        />
      </div>
    </div>
  );
};

export default GestionProductosAdmin;
