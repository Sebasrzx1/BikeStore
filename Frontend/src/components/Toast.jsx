import React, { useEffect } from "react";
import "../styles/Toast.css";

const Toast = ({ mensaje, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast-notificacion">
      <img src="../public/IconCheck.svg" alt="" />
      <p>{mensaje}</p>
    </div>
  );
};

export default Toast;
