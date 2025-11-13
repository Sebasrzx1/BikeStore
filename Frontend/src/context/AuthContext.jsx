// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/");

  // 🔹 Al cargar, intenta recuperar usuario y token guardados
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("usuario");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      } catch (e) {
        // si por alguna razón el JSON está corrupto, limpiamos
        console.error("Error parsing stored user:", e);
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
      }
    }
  }, []);

  // 🔹 Iniciar sesión
  const login = (usuario, token) => {
    if (token) localStorage.setItem("token", token);
    if (usuario) localStorage.setItem("usuario", JSON.stringify(usuario));
    setUser(usuario || null);
    setIsAuthenticated(Boolean(usuario));
  };

  // 🔹 Obtener token (útil para axios/interceptors)
  const getToken = () => localStorage.getItem("token");

  // 🔹 Actualizar usuario
  const updateUser = (nuevosDatos) => {
    const usuarioActualizado = { ...user, ...nuevosDatos };
    setUser(usuarioActualizado);
    localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
  };

  // 🔹 Cerrar sesión
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUser(null);
    setIsAuthenticated(false);
  };

  // 🔹 Comodín para chequear rol admin (case-insensitive)
  const isAdmin =
    Boolean(user?.rol) &&
    (user.rol.toString().toLowerCase() === "administrador" ||
      user.rol.toString().toLowerCase() === "admin");

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        updateUser,
        getToken,
        redirectPath,
        setRedirectPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
