import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/DetalleProducto.css";

export default function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  const [cantidadTemporal, setCantidadTemporal] = useState("1");

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/productos/${id}`);
        setProducto(res.data);
      } catch (error) {
        console.error("Error al cargar el producto:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducto();
  }, [id]);

  if (loading) return <p className="detalle-cargando">Cargando producto...</p>;
  if (!producto) return <p className="detalle-error">Producto no encontrado</p>;

  const stockDisponible = producto.entradas - producto.salidas;

  const incrementar = () => {
    const nuevaCantidad = cantidad + 1;
    if (nuevaCantidad <= stockDisponible) {
      setCantidad(nuevaCantidad);
      setCantidadTemporal(nuevaCantidad.toString());
    }
  };

  const decrementar = () => {
    const nuevaCantidad = cantidad - 1;
    if (nuevaCantidad >= 1) {
      setCantidad(nuevaCantidad);
      setCantidadTemporal(nuevaCantidad.toString());
    }
  };

  const handleCantidadChange = (e) => {
    const val = e.target.value;
    setCantidadTemporal(val); // Permite digitar libremente
  };

  const handleCantidadBlur = () => {
    const val = Number(cantidadTemporal);

    if (val < 1) {
      alert("La cantidad mínima permitida es 1.");
      setCantidad(1);
      setCantidadTemporal("1");
    } else if (val > stockDisponible) {
      alert(`Excediste la cantidad máxima del stock. Solo hay ${stockDisponible} unidades disponibles.`);
      setCantidad(1);
      setCantidadTemporal("1");
    } else {
      setCantidad(val);
    }
  };

  const agregarAlCarrito = () => {
    if (cantidad < 1 || cantidad > stockDisponible) return;

    const itemCarrito = {
      id_producto: producto.id_producto,
      nombre: producto.nombre_producto,
      precio: producto.precio_unitario,
      cantidad,
      subtotal: producto.precio_unitario * cantidad,
    };

    const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
    const existente = carritoActual.find(
      (p) => p.id_producto === producto.id_producto
    );

    if (existente) {
      existente.cantidad += cantidad;
      existente.subtotal = existente.precio * existente.cantidad;
    } else {
      carritoActual.push(itemCarrito);
    }

    localStorage.setItem("carrito", JSON.stringify(carritoActual));
    alert(`${producto.nombre_producto} añadido al carrito (${cantidad} unidades).`);
  };

  return (
    <div className="detalle-contenedor">
      <button className="btn-volver" onClick={() => navigate(-1)}>← Volver</button>

      <div className="detalle-card">
        <div className="detalle-imagen">
          <img
            src={`http://localhost:3000/${producto.imagen}`}
            alt={producto.nombre_producto}
          />
        </div>

        <div className="detalle-info">
          <p className="detalle-marca"><strong>Marca:</strong> {producto.marca}</p>
          <h1 className="detalle-nombre">{producto.nombre_producto}</h1>

          <div className="detalle-precio-stock">
            <p className="detalle-precio">${producto.precio_unitario?.toLocaleString("es-CO")}</p>
            <p className={`detalle-stock ${stockDisponible > 0 ? "ok" : "out"}`}>
              <img src="/Icon_stock.png" className="icon-stock" alt="stock" />
              {stockDisponible > 0
                ? ` En stock (${stockDisponible} disponibles)`
                : "Sin disponibilidad"}
            </p>
          </div>

          <div className="detalle-descripcion">
            <h3>Descripción</h3>
            <p>{producto.descripcion || "Sin descripción"}</p>
          </div>

          <div className="detalle-especificaciones">
            <h3>Especificaciones</h3>
            <div className="detalle-grid">
              <p><strong>Categoría:</strong> {producto.nombre_categoria || "Sin categoría"}</p>
              <p><strong>Material:</strong> {producto.material || "No especificado"}</p>
              <p><strong>Peso:</strong> {producto.peso ? `${producto.peso} kg` : "No especificado"}</p>
            </div>
          </div>

          <div className="detalle-cantidad">
            <div className="cantidad-selector">
              <button onClick={decrementar} disabled={cantidad <= 1}>−</button>
              <input
                type="number"
                value={cantidadTemporal}
                onChange={handleCantidadChange}
                onBlur={handleCantidadBlur}
                min="1"
              />
              <button onClick={incrementar} disabled={cantidad >= stockDisponible}>+</button>
            </div>
            <p className="detalle-subtotal">
              <strong>Subtotal:</strong> ${(producto.precio_unitario * cantidad).toLocaleString("es-CO")}
            </p>
          </div>

          <button className="btn-add-carrito" onClick={agregarAlCarrito}>
            Añadir al carrito 🛒
          </button>
        </div>
      </div>
    </div>
  );
}