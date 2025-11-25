import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/");

  // Al cargar, intenta recuperar usuario y token guardados
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("usuario");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      } catch (e) {
        console.error("Error parsing stored user:", e);
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
      }
    }
  }, []);

  // Iniciar sesión
  const login = (usuario, token) => {
    if (token) localStorage.setItem("token", token);
    if (usuario) localStorage.setItem("usuario", JSON.stringify(usuario));
    setUser(usuario || null);
    setIsAuthenticated(Boolean(usuario));
  };

  // Obtener token
  const getToken = () => localStorage.getItem("token");

  // Actualizar usuario localmente
  const updateUser = (nuevosDatos) => {
    const usuarioActualizado = { ...user, ...nuevosDatos };
    setUser(usuarioActualizado);
    localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
  };

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUser(null);
    setIsAuthenticated(false);
  };

  // Verificar rol admin
  const isAdmin =
    Boolean(user?.rol) &&
    (user.rol.toString().toLowerCase() === "administrador" ||
      user.rol.toString().toLowerCase() === "admin");

  // Función para refrescar datos actuales del usuario desde backend
  const refrescarUsuario = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No autenticado");

      const res = await fetch("http://localhost:3000/api/usuarios/perfil/mis-datos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al obtener usuario");

      const data = await res.json();
      if (!data.success) throw new Error("Error en respuesta del usuario");

      setUser(data.usuario);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      setIsAuthenticated(true);
      return data.usuario;
    } catch (error) {
      console.error("Error refrescando usuario:", error);
      logout(); // Desloguear en caso de error
      return null;
    }
  };

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
        refrescarUsuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
