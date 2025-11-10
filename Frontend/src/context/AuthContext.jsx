import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (usuario) => {
    // Aquí puedes guardar también el token si lo necesitas
    setUser(usuario);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(usuario));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("rol");
    localStorage.removeItem("nombre");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, redirectPath, setRedirectPath }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
