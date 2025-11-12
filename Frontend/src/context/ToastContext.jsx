import { createContext, useContext, useState } from "react";
import Toast from "../components/Toast";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const mostrarToast = (texto) => {
    setMensaje(texto);
    setVisible(true);
  };

  return (
    <ToastContext.Provider value={{ mostrarToast }}>
      {children}
      {visible && <Toast mensaje={mensaje} onClose={() => setVisible(false)} />}
    </ToastContext.Provider>
  );
};
