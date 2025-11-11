import React, { useEffect, useState } from "react";
import "../styles/Carrito.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Carrito({ setCantidadCarrito }) {
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const { isAuthenticated, setRedirectPath } = useAuth();

  const procederPago = () => {
    if (!isAuthenticated) {
      setRedirectPath("/carrito");
      navigate("/login");
    } else {
      navigate("/pago");
    }
  };

  // Cargar carrito
  useEffect(() => {
    const guardado = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(guardado);
  }, []);

  // Calcular total y actualizar contador global
  useEffect(() => {
    const nuevoTotal = carrito.reduce((acc, p) => acc + p.subtotal, 0);
    setTotal(nuevoTotal);

    const totalCantidad = carrito.reduce((acc, p) => acc + p.cantidad, 0);
    setCantidadCarrito(totalCantidad);
  }, [carrito, setCantidadCarrito]);

  const eliminarProducto = (id_producto) => {
    const nuevoCarrito = carrito.filter((p) => p.id_producto !== id_producto);
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  };

  const actualizarCantidad = (id_producto, cantidadNueva) => {
    if (cantidadNueva < 1) return;
    const actualizado = carrito.map((p) =>
      p.id_producto === id_producto
        ? { ...p, cantidad: cantidadNueva, subtotal: p.precio * cantidadNueva }
        : p
    );
    setCarrito(actualizado);
    localStorage.setItem("carrito", JSON.stringify(actualizado));
  };

  if (carrito.length === 0) {
    return (
      <div className="carrito-vacio">
        <div className="ContIconCarrito">
          <img src="./public/IconProduct.svg" alt="" />
        </div>
        <h2 className="TitCarrito">Tu carrito está vacío</h2>
        <p>Comienza a comprar y añade productos increíbles.</p>
        <button onClick={() => navigate("/catalogo")}>
          <p>Explorar productos</p>
        </button>
      </div>
    );
  }

  return (
    <div className="carrito-contenedor">
      <h1 className="carrito-titulo">Carrito de compras</h1>

      <div className="carrito-lista">
        {carrito.map((p) => (
          <div key={p.id_producto} className="carrito-item">
            <div className="cicla-info">
              <div className="carrito-imagen">
                <img
                  src={p.imagen}
                  alt={p.nombre}
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />
              </div>
              <div className="contenedor-control-desc">
                <div className="carrito-detalles">
                  <h3>{p.nombre}</h3>
                  <p>Subtotal: ${p.subtotal.toLocaleString("es-CO")}</p>
                </div>

                <div className="carrito-controles">
                  <button
                    onClick={() =>
                      actualizarCantidad(p.id_producto, p.cantidad - 1)
                    }
                  >
                    −
                  </button>
                  <span>{p.cantidad}</span>
                  <button
                    onClick={() =>
                      actualizarCantidad(p.id_producto, p.cantidad + 1)
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className="contenedor-eliminar-precio">
              <button
                className="btn-eliminar"
                onClick={() => eliminarProducto(p.id_producto)}
              >
                🗑️
              </button>
              <p id="precioUnitario">${p.precio.toLocaleString("es-CO")}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="carrito-resumen">
        <h2>Total: ${total.toLocaleString("es-CO")}</h2>
        <button className="btn-pagar" onClick={procederPago}>
          Proceder al pago
        </button>
      </div>
    </div>
  );
}
