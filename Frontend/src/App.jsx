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
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import CuentaCliente from "./components/CuentaCliente";
import { ToastProvider } from "./context/ToastContext";
import ForgotPassword from "./components/ForgotPassword";
import VerifyCode from "./components/VerifyCode";
import MisPedidos from "./components/MisPedidos.jsx";
import DetallePedido from "./components/DetallePedido.jsx";
import PanelCliente from "./components/PanelCliente.jsx";
import SobreNosotros from "./components/SobreNostros.jsx";
import ScrollToTop from "./components/scrollToTop.jsx";
import Pago from "./components/Pago";
import Factura from "./components/Factura.jsx"

// 👉 Importa tus nuevos componentes
import PanelAdministrador from "./admin/PanelAdministrador";
import GestionProductos from "./admin/GestionProductosAdmin";


// 🔒 Ruta privada genérica
function RutaPrivada({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

// 🔒 Ruta privada solo para admin
function RutaAdmin({ children }) {
  const { isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to="/" replace />;
}

function AppContent({ cantidadCarrito, setCantidadCarrito }) {
  const location = useLocation();

  // Ocultamos el Navbar en estas páginas
  const hideNavbar = [
    "/login",
    "/register",
    "/forgot-password",
    "/verificar-codigo",
    "/admin",
    "/admin/gestion-productos",
  ].includes(location.pathname);

  return (
    <>

      <ScrollToTop />

      {!hideNavbar && <Navbar cantidadCarrito={cantidadCarrito} />}

      <Routes>
        {/* Rutas públicas */}
        <Route
          path="/"
          element={<Homepage setCantidadCarrito={setCantidadCarrito} />}
        />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/catalogo" element={<Catalogo setCantidadCarrito={setCantidadCarrito} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verificar-codigo" element={<VerifyCode />} />
        <Route
          path="/producto/:id"
          element={<DetalleProducto setCantidadCarrito={setCantidadCarrito} />}
        />
        <Route path="/carrito" element={<Carrito setCantidadCarrito={setCantidadCarrito} />}
        />
        <Route path="/SobreNosotros" element={<SobreNosotros />} />

        {/* Rutas privadas cliente */}
        <Route path="/cuenta" element={<RutaPrivada>  <CuentaCliente /> </RutaPrivada>} />
        <Route path="/mis-pedidos" element={<RutaPrivada><MisPedidos /></RutaPrivada>} />
        <Route path="/mis-pedidos/:id" element={<RutaPrivada><DetallePedido /></RutaPrivada>} />
        <Route path="/pago" element={<Pago setCantidadCarrito={setCantidadCarrito} />} />
        <Route
          path="/factura/:id"
          element={<RutaPrivada><Factura /></RutaPrivada>}
        />



        {/* Rutas privadas admin */}
        <Route path="/admin" element={<RutaAdmin> <PanelAdministrador /> </RutaAdmin>} />
        <Route path="/admin/gestion-productos" element={<RutaAdmin> <GestionProductos /> </RutaAdmin>} />

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
