import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./components/Homepage";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Catalogo from "./components/CatalogoProductos";
import DetalleProducto from "./components/DetalleProducto";
import Carrito from "./components/Carrito";
import FooterBikestore from "./components/FooterBikestore";
import { AuthProvider } from "./context/AuthContext.jsx";
import CuentaCliente from "./components/CuentaCliente";
import { ToastProvider } from "./context/ToastContext";
import ForgotPassword from "./components/ForgotPassword";
import VerifyCode from "./components/VerifyCode";

const Pago = () => (
  <div style={{ padding: "100px", textAlign: "center" }}>
    <h1>Página de Pago 💳</h1>
    <p>Aquí irán los métodos de pago y la confirmación de compra.</p>
  </div>
);

function RutaPrivada({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function AppContent({ cantidadCarrito, setCantidadCarrito }) {
  const location = useLocation();

  // 🔧 Ajuste importante:
  // Ocultamos el Navbar solo en login, register, forgot-password y verificar-codigo
  const hideNavbar =
    ["/login", "/register", "/forgot-password", "/verificar-codigo"].includes(
      location.pathname
    );

  return (
    <>
      {!hideNavbar && <Navbar cantidadCarrito={cantidadCarrito} />}

      <Routes>
        <Route
          path="/"
          element={<Homepage setCantidadCarrito={setCantidadCarrito} />}
        />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/catalogo"
          element={<Catalogo setCantidadCarrito={setCantidadCarrito} />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verificar-codigo" element={<VerifyCode />} />

        <Route
          path="/cuenta"
          element={
            <RutaPrivada>
              <CuentaCliente />
            </RutaPrivada>
          }
        />
        <Route
          path="/producto/:id"
          element={<DetalleProducto setCantidadCarrito={setCantidadCarrito} />}
        />
        <Route
          path="/carrito"
          element={<Carrito setCantidadCarrito={setCantidadCarrito} />}
        />
        <Route path="/pago" element={<Pago />} />
      </Routes>

      {!hideNavbar && <FooterBikestore />}
    </>
  );
}

export default function App() {
  const [cantidadCarrito, setCantidadCarrito] = useState(0);

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    const cantidadTotal = carritoGuardado.reduce(
      (acc, item) => acc + item.cantidad,
      0
    );
    setCantidadCarrito(cantidadTotal);
  }, []);

  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <AppContent
            cantidadCarrito={cantidadCarrito}
            setCantidadCarrito={setCantidadCarrito}
          />
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}