// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/");

  // 🟢 Al montar, intenta recuperar el usuario guardado
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("usuario");

    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
  }, []);

  // 🟢 Iniciar sesión
  const login = (usuario, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    setUser(usuario);
    setIsAuthenticated(true);
  };

  // 🟢 🔄 NUEVO: Actualizar información del usuario en el contexto y localStorage
  const updateUser = (nuevosDatos) => {
    const usuarioActualizado = { ...user, ...nuevosDatos };
    setUser(usuarioActualizado);
    localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
  };

  // 🔴 Cerrar sesión
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        updateUser, // ✅ Incluimos la nueva función
        redirectPath,
        setRedirectPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
