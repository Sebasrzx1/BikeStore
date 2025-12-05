import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Factura.css";

const Factura = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state) {
    return (
      <div>
        No hay datos para mostrar la factura.
        <button onClick={() => navigate("/catalogo")}>
          Volver al catálogo
        </button>
      </div>
    );
  }

  const { pedido, usuario, total } = location.state;

  const imprimirFactura = () => {
    window.print();
  };

  return (
    <div className="inv-container factura-print-area">
      <header className="inv-header">
        <h1 className="inv-title">Factura - Resumen de Compra</h1>
        <div className="inv-date">
          Fecha: {new Date(pedido.fecha).toLocaleDateString("es-CO")}
        </div>
      </header>

      {/* DATOS DEL CLIENTE */}
      <section className="inv-details">
        <div className="inv-section">
          <h2 className="inv-section-title">Datos del Cliente</h2>
          <p className="inv-info">
            Nombre: {usuario.nombre} {usuario.apellido}
          </p>
          <p className="inv-info">Correo: {usuario.email}</p>
        </div>

        {/* DETALLES DEL PEDIDO */}
        <div className="inv-section">
          <h2 className="inv-section-title">Detalles del Pedido</h2>
          <p className="inv-info">Direccion de envio: {usuario.direccion} {usuario.ciudad} {usuario.departamento}</p>
          <p className="inv-info">Estado: {pedido.estado}</p>
          <p className="inv-info">Método Pago: {pedido.metodo_pago}</p>
          <p className="inv-info">
            Tarjeta: {pedido.numero_tarjeta_enmascarado}
          </p>

          <table className="inv-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cant.</th>
                <th>Precio</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {pedido.items.map((item) => (
                <tr key={item.id_detalle}>
                  <td>{item.nombre_producto}</td>
                  <td>{item.cantidad}</td>
                  <td>${item.precio_unitario.toLocaleString("es-CO")}</td>
                  <td>${item.total_item.toLocaleString("es-CO")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* TOTAL */}
      <section className="inv-summary">
        <div className="inv-summary-item">
          <span>Total Pagado</span>
          <span>${total.toLocaleString("es-CO")}</span>
        </div>
      </section>

      {/* BOTONES (NO IMPRIMIR) */}
      <div className="inv-buttons">
        <button onClick={imprimirFactura} className="btn-print">
          🖨 Imprimir Factura
        </button>

        <button
          onClick={() => navigate("/mis-pedidos")}
          className="btn-primary"
        >
          Ver Mis Pedidos
        </button>

        <button
          onClick={() => navigate("/catalogo")}
          className="btn-secondary"
        >
          Seguir Comprando
        </button>
      </div>
    </div>
  );
};

export default Factura;
