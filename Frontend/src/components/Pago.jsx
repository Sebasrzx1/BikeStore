import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import "../styles/PaymentMethod.css";

export default function Pago({ setCantidadCarrito }) {
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();
  const { mostrarToast } = useToast();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const guardado = JSON.parse(localStorage.getItem("carrito")) || [];

    if (guardado.length === 0) {
      mostrarToast("Tu carrito está vacío. Agrega productos antes de pagar.");
      navigate("/carrito");
      return;
    }

    setCarrito(guardado);

    const nuevoTotal = guardado.reduce((acc, p) => acc + p.subtotal, 0);
    setTotal(nuevoTotal);
  }, [isAuthenticated, navigate, mostrarToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMethod || !numeroTarjeta) {
      mostrarToast("Completa todos los campos.");
      return;
    }

    if (isNaN(numeroTarjeta) || numeroTarjeta.length < 13 || numeroTarjeta.length > 19) {
      mostrarToast("Número de tarjeta inválido.");
      return;
    }

    setCargando(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3000/api/pedidos/crear-pedido", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          metodo_pago: selectedMethod,
          numero_tarjeta: numeroTarjeta,
          items: carrito,
        }),
      });

      const data = await response.json();
      console.log("Respuesta backend:", data);

      if (data.success) {
        const numeroEnmascarado = `****${numeroTarjeta.slice(-4)}`;

        const pedidoData = {
          id_pedido: data.id_pedido,
          fecha: new Date().toISOString(),
          estado: "En alistamiento",
          metodo_pago: selectedMethod,
          numero_tarjeta_enmascarado: numeroEnmascarado,
          items: carrito.map((p) => ({
            id_detalle: Math.random(),
            nombre_producto: p.nombre,
            cantidad: p.cantidad,
            precio_unitario: p.precio,
            total_item: p.subtotal,
          })),
        };

        // 🟢 Navegamos primero a FACTURA con los datos
        navigate(`/factura/${data.id_pedido}`, {
          state: {
            pedido: pedidoData,
            usuario: user,
            total,
          },
        });

        // 🟢 Limpiar carrito DESPUÉS de que React navegue (evita romper Factura)
        setTimeout(() => {
          localStorage.removeItem("carrito");
          if (typeof setCantidadCarrito === "function") {
            setCantidadCarrito(0);
          }
        }, 100);

        mostrarToast("Compra realizada con éxito.");
      } else {
        mostrarToast(data.message || "Error al procesar el pago.");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      mostrarToast("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  if (carrito.length === 0) {
    return <div className="pm-container">Cargando...</div>;
  }

  return (
    <div className="pm-container">
      <div className="pm-back-link" onClick={() => navigate("/carrito")}>
        &larr; Volver al Carrito
      </div>

      <h1 className="pm-title">Método de Pago</h1>

      <div className="pm-main-content">
        <form className="pm-form" onSubmit={handleSubmit}>
          <label className="pm-label">Selecciona tu método de pago</label>

          <div className="pm-methods">
            <button
              type="button"
              className={`pm-method-btn ${selectedMethod === "Visa" ? "pm-method-selected" : ""}`}
              onClick={() => setSelectedMethod("Visa")}
            >
              💳 Visa
            </button>

            <button
              type="button"
              className={`pm-method-btn ${selectedMethod === "Mastercard" ? "pm-method-selected" : ""}`}
              onClick={() => setSelectedMethod("Mastercard")}
            >
              💳 Mastercard
            </button>

            <button
              type="button"
              className={`pm-method-btn ${selectedMethod === "Paypal" ? "pm-method-selected" : ""}`}
              onClick={() => setSelectedMethod("Paypal")}
            >
              🅿️ Paypal
            </button>
          </div>

          <input
            className="pm-input"
            type="text"
            value={numeroTarjeta}
            onChange={(e) => setNumeroTarjeta(e.target.value)}
            placeholder="Número de tarjeta"
            required
          />

          <button className="pm-confirm-btn" type="submit" disabled={cargando}>
            {cargando ? "Procesando..." : "Confirmar Compra"}
          </button>
        </form>

        <div className="pm-summary">
          <div className="pm-summary-title">Resumen del pedido</div>

          {carrito.map((p) => (
            <div key={p.id_producto} className="pm-summary-item">
              <span>{p.nombre} (x{p.cantidad})</span>
              <span>${p.subtotal.toLocaleString("es-CO")}</span>
            </div>
          ))}

          <div className="pm-summary-total">
            <span>Total</span>
            <span>${total.toLocaleString("es-CO")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
