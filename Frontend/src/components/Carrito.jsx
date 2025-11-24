import React, { useEffect, useState } from "react";
import "../styles/Carrito.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

export default function Carrito({ setCantidadCarrito }) {
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const { isAuthenticated, setRedirectPath } = useAuth();
  const { mostrarToast } = useToast();

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
    const actualizado = carrito.map((p) => {
      if (p.id_producto === id_producto) {
        const stockDisponible = p.stockDisponible; // 👈 ahora sí existe

        if (cantidadNueva < 1) {
          mostrarToast("La cantidad mínima permitida es 1.");
          return { ...p, cantidad: 1, subtotal: p.precio };
        }

        if (cantidadNueva > stockDisponible) {
          mostrarToast(
            `No puedes añadir más. Stock máximo: ${stockDisponible} unidades.`
          );
          return {
            ...p,
            cantidad: stockDisponible,
            subtotal: p.precio * stockDisponible,
          };
        }

        return {
          ...p,
          cantidad: cantidadNueva,
          subtotal: p.precio * cantidadNueva,
        };
      }
      return p;
    });

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
    <div className="carrito-contenedorS">
      <div className="carrito-titulo">
        <h1>Carrito de compras</h1>
        <p>
          Tienes {carrito.reduce((acc, p) => acc + p.cantidad, 0)}{" "}
          {carrito.reduce((acc, p) => acc + p.cantidad, 0) === 1
            ? "item"
            : "items"}
        </p>
      </div>
      <div className="ContCarritoS">
        <div className="carrito-listaS">
          {carrito.map((p) => (
            <div key={p.id_producto} className="carrito-itemS">
              <div className="cicla-infoS">
                <div className="carrito-imagenS">
                  <img
                    src={
                      p.imagen?.startsWith("http")
                        ? p.imagen
                        : p.imagen
                        ? `http://localhost:3000/uploads/productos/${p.imagen}`
                        : "/placeholder.png"
                    }
                    alt={p.nombre}
                    onError={(e) => (e.target.src = "/placeholder.png")}
                  />
                </div>
                <div className="contenedor-control-descS">
                  <p>{p.marca}</p>
                  <div className="carrito-detalles">
                    <h3>{p.nombre}</h3>
                    <p>Subtotal: ${p.subtotal.toLocaleString("es-CO")}</p>
                  </div>

                  <div className="carrito-controlesS">
                    <button
                      onClick={() =>
                        actualizarCantidad(p.id_producto, p.cantidad - 1)
                      }
                    >
                      <p>−</p>
                    </button>
                    <span>{p.cantidad}</span>
                    <button
                      onClick={() =>
                        actualizarCantidad(p.id_producto, p.cantidad + 1)
                      }
                    >
                      <p>+</p>
                    </button>
                  </div>
                </div>
                <div className="ContPrecioS">
                  <div className="contenedor-eliminar-precioS">
                    <button
                      onClick={() => {
                        eliminarProducto(p.id_producto);
                        mostrarToast(`${p.nombre} eliminado del carrito.`);
                      }}
                    >
                      <img src="../public/IconDelet.svg" alt="IconoEliminar" />
                    </button>
                  </div>
                  <p id="precioUnitario">${p.precio.toLocaleString("es-CO")}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="carrito-resumen">
          <div className="ContTitulo">
            <h2>Resumen del pedido</h2>
          </div>
          <div className="ContTotal">
            <h3>Total</h3>
            <h2>${total.toLocaleString("es-CO")}</h2>
          </div>
          <button className="btn-pagar" onClick={procederPago}>
            Pagar ←
          </button>
          <button className="btn-Volver" onClick={() => navigate("/catalogo")}>
            Continuar comprando
          </button>
        </div>
      </div>
    </div>
  );
}
