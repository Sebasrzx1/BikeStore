import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import "../styles/PaymentMethod.css";
import InputSearch from "../components/InputSearchpay";

export default function Pago({ setCantidadCarrito }) {
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();
  const { mostrarToast } = useToast();
  const { isAuthenticated, user } = useAuth();

  // Función para formatear el número de tarjeta con espacios (para UX)
  const formatearTarjeta = (value) => {
    // Elimina todo lo que NO sea número
    const limpio = value.replace(/\D/g, "");
    // Limita a 16 dígitos (máximo típico para tarjetas)
    const limitado = limpio.slice(0, 16);
    // Agrupa en bloques de 4
    const grupos = limitado.match(/.{1,4}/g);
    // Une con espacios
    return grupos ? grupos.join(" ") : limitado;
  };

  const handleNumeroTarjeta = (e) => {
    setNumeroTarjeta(formatearTarjeta(e.target.value));
  };

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

    // 🟢 CORRECCIÓN: Limpia los espacios para validar y enviar
    const numeroLimpio = numeroTarjeta.replace(/\s/g, ''); // Elimina espacios

    // Valida el número limpio
    if (
      isNaN(numeroLimpio) ||
      numeroLimpio.length < 13 ||
      numeroLimpio.length > 19
    ) {
      mostrarToast("Número de tarjeta inválido.");
      return;
    }

    setCargando(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3000/api/pedidos/crear-pedido",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            metodo_pago: selectedMethod,
            numero_tarjeta: numeroLimpio, // 🟢 Envía el número SIN espacios
            items: carrito,
          }),
        }
      );

      const data = await response.json();
      console.log("Respuesta backend:", data);

      if (data.success) {
        // Usa el número limpio para enmascarar
        const numeroEnmascarado = `****${numeroLimpio.slice(-4)}`;

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
    <div className="cont-pm-page">
      <div className="pm-container">
        <div className="Cont-pm">
          <div className="pm-back-link" onClick={() => navigate("/carrito")}>
            &larr; Volver al Carrito
          </div>
          <h1 className="pm-title">Método de Pago</h1>
          <p>Completa tu información de pago de forma segura</p>
        </div>
        <div className="pm-main-content">
          <form className="pm-form" onSubmit={handleSubmit}>
            <label className="pm-label">Selecciona tu método de pago</label>

            <div className="pm-methods">
              <button
                type="button"
                className={`pm-method-btn ${selectedMethod === "Visa" ? "pm-method-selected" : ""
                  }`}
                onClick={() => setSelectedMethod("Visa")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    d="M26.6602 6.66504H5.33203C3.85963 6.66504 2.66602 7.85865 2.66602 9.33105V22.6611C2.66602 24.1335 3.85963 25.3271 5.33203 25.3271H26.6602C28.1326 25.3271 29.3262 24.1335 29.3262 22.6611V9.33105C29.3262 7.85865 28.1326 6.66504 26.6602 6.66504Z"
                    stroke="black"
                    strokeWidth="2.66602"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.66602 13.3301H29.3262"
                    stroke="black"
                    strokeWidth="2.66602"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                Visa
              </button>

              <button
                type="button"
                className={`pm-method-btn ${selectedMethod === "Mastercard" ? "pm-method-selected" : ""
                  }`}
                onClick={() => setSelectedMethod("Mastercard")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    d="M26.6602 6.66504H5.33203C3.85963 6.66504 2.66602 7.85865 2.66602 9.33105V22.6611C2.66602 24.1335 3.85963 25.3271 5.33203 25.3271H26.6602C28.1326 25.3271 29.3262 24.1335 29.3262 22.6611V9.33105C29.3262 7.85865 28.1326 6.66504 26.6602 6.66504Z"
                    stroke="black"
                    strokeWidth="2.66602"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.66602 13.3301H29.3262"
                    stroke="black"
                    strokeWidth="2.66602"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Mastercard
              </button>

              <button
                type="button"
                className={`pm-method-btn ${selectedMethod === "Paypal" ? "pm-method-selected" : ""
                  }`}
                onClick={() => setSelectedMethod("Paypal")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <g clipPath="url(#clip0_1859_419)">
                    <path
                      d="M9.43334 28.4424H3.2935C3.17017 28.4423 3.04831 28.4156 2.93629 28.364C2.82428 28.3123 2.72477 28.2371 2.6446 28.1434C2.56443 28.0496 2.5055 27.9397 2.47186 27.821C2.43821 27.7024 2.43066 27.5778 2.44971 27.456L6.59136 1.20104C6.70067 0.509209 7.29786 0 7.99635 0H17.9406C21.3664 0 24.0431 0.723823 25.5254 2.41274C26.8717 3.9457 27.2637 5.63863 26.8744 8.12735C26.8438 8.31797 26.8118 8.51126 26.7718 8.70988C25.4614 15.4416 20.9745 17.7703 15.2453 17.7703H12.326C11.6275 17.7703 11.0356 18.2795 10.9263 18.97L9.43334 28.4424ZM28.2901 9.22042C28.0506 8.94807 27.7789 8.7059 27.4809 8.49926C27.4636 8.60057 27.4463 8.73254 27.4263 8.83784C26.1866 15.207 22.0876 18.4368 15.2453 18.4368H12.326C12.1465 18.4371 11.973 18.5016 11.8371 18.6187C11.7011 18.7359 11.6116 18.8979 11.5848 19.0753L10.0025 29.1089H9.32803L9.00811 31.1297C8.99134 31.2364 8.99789 31.3453 9.02731 31.4492C9.05673 31.553 9.10831 31.6493 9.17851 31.7312C9.2487 31.8132 9.33584 31.879 9.43392 31.924C9.53199 31.9691 9.63867 31.9924 9.74659 31.9922H14.9213C15.5345 31.9922 16.0544 31.547 16.1504 30.9418C16.2303 30.5952 17.1635 24.474 17.1635 24.474C17.2093 24.1809 17.3586 23.9138 17.5842 23.7211C17.8099 23.5285 18.0971 23.4229 18.3938 23.4236H19.167C24.1791 23.4236 28.1048 21.3868 29.2512 15.4976C29.7311 13.0355 29.4831 10.9813 28.1568 9.54301L28.2901 9.22042Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1859_419">
                      <rect width="31.9922" height="31.9922" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                Paypal
              </button>
            </div>
            <div className="input-tarjeta">
              <InputSearch
                placeholder="Número de tarjeta"
                type="text"
                value={numeroTarjeta}
                onChange={handleNumeroTarjeta}
                name="numeroTarjeta"
                required
                pattern="[0-9 ]*"
              />
            </div>


            <div className="cont-pm-security">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M15.8281 9.16309H4.16602C3.2459 9.16309 2.5 9.90899 2.5 10.8291V16.6602C2.5 17.5803 3.2459 18.3262 4.16602 18.3262H15.8281C16.7482 18.3262 17.4941 17.5803 17.4941 16.6602V10.8291C17.4941 9.90899 16.7482 9.16309 15.8281 9.16309Z"
                  stroke="#00A63E"
                  strokeWidth="1.66602"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.83203 9.16309V5.83105C5.83203 4.72642 6.27085 3.66702 7.05194 2.88593C7.83304 2.10483 8.89243 1.66602 9.99707 1.66602C11.1017 1.66602 12.1611 2.10483 12.9422 2.88593C13.7233 3.66702 14.1621 4.72642 14.1621 5.83105V9.16309"
                  stroke="#00A63E"
                  strokeWidth="1.66602"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p>Pago seguro:Tu información está protegida y encriptada</p>
            </div>
            <button
              className="pm-confirm-btn"
              type="submit"
              disabled={cargando}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <g clipPath="url(#clip0_1859_458)">
                  <path
                    d="M7.99219 14.6523C11.6705 14.6523 14.6523 11.6705 14.6523 7.99219C14.6523 4.31388 11.6705 1.33203 7.99219 1.33203C4.31388 1.33203 1.33203 4.31388 1.33203 7.99219C1.33203 11.6705 4.31388 14.6523 7.99219 14.6523Z"
                    stroke="white"
                    strokeWidth="1.33203"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.99414 7.99219L7.32617 9.32422L9.99023 6.66016"
                    stroke="white"
                    strokeWidth="1.33203"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1859_458">
                    <rect width="15.9844" height="15.9844" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              {cargando ? "Procesando..." : "Confirmar Compra"}
            </button>
          </form>

          <div className="pm-summary">
            <div className="pm-summary-title">Resumen del pedido</div>
            <div className="cont-pm-general">
              {carrito.map((p) => (
                <div key={p.id_producto} className="pm-summary-item">
                  <span>{p.cantidad} productos</span>
                  <span>${p.subtotal.toLocaleString("es-CO")}</span>
                </div>
              ))}

              <div className="pm-summary-total">
                <span>Total</span>
                <div className="Total-pam">
                  <span>${total.toLocaleString("es-CO")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
