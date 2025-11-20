import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/DetalleProducto.css";
import { useToast } from "../context/ToastContext";

export default function DetalleProducto({ setCantidadCarrito }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  const [cantidadTemporal, setCantidadTemporal] = useState("1");
  const { mostrarToast } = useToast();

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/productos/${id}`
        );
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

  // 💥 ADAPTADO → Ahora stockDisponible viene directamente de la BD
  const stockDisponible = Number(producto.stock) || 0;

  // Helpers para saber lo que ya hay en carrito
  const getCantidadYaEnCarrito = () => {
    const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
    const existente = carritoActual.find(
      (p) => p.id_producto === producto.id_producto
    );
    return existente ? existente.cantidad : 0;
  };

  const incrementar = () => {
    const cantidadYaEnCarrito = getCantidadYaEnCarrito();
    const restante = Math.max(stockDisponible - cantidadYaEnCarrito, 0);

    const nuevaCantidad = cantidad + 1;
    if (nuevaCantidad <= restante) {
      setCantidad(nuevaCantidad);
      setCantidadTemporal(nuevaCantidad.toString());
    } else {
      mostrarToast(
        `No puedes añadir más. Quedan ${restante} unidades disponibles.`
      );
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
    setCantidadTemporal(e.target.value);
  };

  const handleCantidadBlur = () => {
    const cantidadYaEnCarrito = getCantidadYaEnCarrito();
    const restante = Math.max(stockDisponible - cantidadYaEnCarrito, 0);

    const val = Number(cantidadTemporal);

    if (val < 1) {
      mostrarToast("La cantidad mínima permitida es 1.");
      setCantidad(1);
      setCantidadTemporal("1");
    } else if (val > restante) {
      mostrarToast(
        `Excediste el máximo disponible. Solo puedes añadir ${restante} unidades más.`
      );
      const permitido = Math.max(restante, 0);
      setCantidad(permitido || 1);
      setCantidadTemporal((permitido || 1).toString());
    } else {
      setCantidad(val);
    }
  };

  const agregarAlCarrito = () => {
    const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
    const existente = carritoActual.find(
      (p) => p.id_producto === producto.id_producto
    );

    const cantidadYaEnCarrito = existente ? existente.cantidad : 0;
    const cantidadTotalDeseada = cantidadYaEnCarrito + cantidad;

    if (cantidad < 1) return;

    if (cantidadTotalDeseada > stockDisponible) {
      const restante = Math.max(stockDisponible - cantidadYaEnCarrito, 0);
      mostrarToast(
        `No puedes añadir más. Stock máximo: ${stockDisponible}. Ya tienes ${cantidadYaEnCarrito} en el carrito. Te quedan ${restante}.`
      );
      return;
    }

    if (existente) {
      existente.cantidad += cantidad;
      existente.subtotal = existente.precio * existente.cantidad;
      existente.stockDisponible = stockDisponible;
    } else {
      carritoActual.push({
        id_producto: producto.id_producto,
        nombre: producto.nombre_producto,
        marca: producto.marca,
        precio: producto.precio_unitario,
        cantidad,
        subtotal: producto.precio_unitario * cantidad,
        imagen: producto.imagen
          ? `http://localhost:3000/uploads/productos/${producto.imagen}`
          : "/placeholder.png",
        stockDisponible, // 👈 se conserva para Carrito.jsx
      });
    }

    localStorage.setItem("carrito", JSON.stringify(carritoActual));

    const totalCantidad = carritoActual.reduce((acc, p) => acc + p.cantidad, 0);
    setCantidadCarrito(totalCantidad);

    mostrarToast(
      `${producto.nombre_producto} añadido al carrito (${cantidad} unidades).`
    );
  };

  return (
    <div className="detalle-contenedor">
      <div className="ContVolver">
        <button className="btn-volver" onClick={() => navigate(-1)}>
          ← Volver al catalogo
        </button>
      </div>

      <div className="detalle-card">
        <div className="detalle-imagen">
          <img
            src={
              producto.imagen
                ? `http://localhost:3000/uploads/productos/${producto.imagen}`
                : "/placeholder.png"
            }
            alt={producto.nombre_producto}
          />
        </div>

        <div className="detalle-info">
          <div className="ContTitulo">
            <p className="detalle-marca">
              <strong>Marca:</strong> {producto.marca}
            </p>
            <h1 className="detalle-nombre">{producto.nombre_producto}</h1>
            <div className="detalle-precio-stock">
              <p className="detalle-precio">
                ${producto.precio_unitario?.toLocaleString("es-CO")}
              </p>
              <p
                className={`detalle-stock ${
                  stockDisponible > 0 ? "ok" : "out"
                }`}
              >
                <img src="/Icon_stock.png" className="icon-stock" alt="stock" />
                {stockDisponible > 0
                  ? ` En stock (${stockDisponible} disponibles)`
                  : "Sin disponibilidad"}
              </p>
            </div>
          </div>

          <div className="detalle-descripcion">
            <h3>Descripción</h3>
            <p>{producto.descripcion || "Sin descripción"}</p>
          </div>

          <div className="detalle-especificaciones">
            <h3>Especificaciones</h3>
            <div className="detalle-grid">
              <p>
                <strong>Categoría: </strong>
                {producto.nombre_categoria || "Sin categoría"}
              </p>
              <p>
                <strong>Material: </strong>
                {producto.material || "No especificado"}
              </p>
              <p>
                <strong>Peso: </strong>
                {producto.peso || "No especificado"}
              </p>
            </div>
          </div>

          <div className="Contdetalle">
            <p>Cantidad</p>
            <div className="detalle-cantidad">
              <div className="cantidad-selector">
                <button onClick={decrementar} disabled={cantidad <= 1}>
                  −
                </button>
                <input
                  type="number"
                  value={cantidadTemporal}
                  onChange={handleCantidadChange}
                  onBlur={handleCantidadBlur}
                  min="1"
                />
                <button onClick={incrementar}>+</button>
              </div>
              <p className="detalle-subtotal">
                <strong>Subtotal:</strong> $
                {(producto.precio_unitario * cantidad).toLocaleString("es-CO")}
              </p>
            </div>
          </div>

          <button className="btn-add-carrito" onClick={agregarAlCarrito}>
            <img src="./public/IconCarritoBoton.svg" alt="" />
            <p>Añadir al carrito</p>
          </button>

          <div className="ContDecoration"></div>
        </div>
      </div>
    </div>
  );
}
