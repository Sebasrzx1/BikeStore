import React, { useEffect, useState } from "react";
import "../styles/Carrito.css";

export default function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);

  // Cargar carrito desde localStorage
  useEffect(() => {
    const guardado = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(guardado);
  }, []);

  // Calcular total
  useEffect(() => {
    const nuevoTotal = carrito.reduce((acc, p) => acc + p.subtotal, 0);
    setTotal(nuevoTotal);
  }, [carrito]);

  // Eliminar producto del carrito
  const eliminarProducto = (id_producto) => {
    const nuevoCarrito = carrito.filter((p) => p.id_producto !== id_producto);
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  };

  // Cambiar cantidad (aumentar/disminuir)
  const actualizarCantidad = (id_producto, cantidadNueva) => {
    if (cantidadNueva < 1) return;

    const actualizado = carrito.map((p) =>
      p.id_producto === id_producto
        ? {
          ...p,
          cantidad: cantidadNueva,
          subtotal: p.precio * cantidadNueva,
        }
        : p
    );

    setCarrito(actualizado);
    localStorage.setItem("carrito", JSON.stringify(actualizado));
  };

  if (carrito.length === 0) {
    return (
      <div className="carrito-vacio">
        <h2>Tu carrito está vacío 🛒</h2>
        <p>Agrega productos desde la tienda.</p>
      </div>
    );
  }

  return (
    <div className="carrito-contenedor">
      <h1 className="carrito-titulo">Carrito de compras</h1>

      <div className="carrito-lista">
        {carrito.map((p) => (
          <div key={p.id_producto} className="carrito-item">
            {/* Imagen del producto */}

            <div className="cicla-info">
              <div className="carrito-imagen">
                <img
                  src={p.imagen}
                  alt={p.nombre}
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />
              </div>
              <div className="contenedor-control-desc">
                {/* Detalles */}
                <div className="carrito-detalles">
                  <h3>{p.nombre}</h3>
                  <p>Subtotal: ${p.subtotal.toLocaleString("es-CO")}</p>
                </div>

                {/* Controles */}
                <div className="carrito-controles">
                  <button onClick={() => actualizarCantidad(p.id_producto, p.cantidad - 1)}>−</button>
                  <span>{p.cantidad}</span>
                  <button onClick={() => actualizarCantidad(p.id_producto, p.cantidad + 1)}>+</button>

                </div>
              </div>
            </div>
            <div className="contenedor-eliminar-precio">
              <button className="btn-eliminar" onClick={() => eliminarProducto(p.id_producto)}>🗑️</button>

              <p id="precioUnitario">${p.precio.toLocaleString("es-CO")}</p>

            </div>
          </div>
        ))}
      </div>

      <div className="carrito-resumen">
        <h2>Total: ${total.toLocaleString("es-CO")}</h2>
        <button
          className="btn-pagar"
          onClick={() => alert("Redirigiendo al pago...")}
        >
          Proceder al pago
        </button>
      </div>
    </div>
  );
}
