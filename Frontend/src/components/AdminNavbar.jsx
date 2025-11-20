// src/admin/AdminNavbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/AdminNavbar.css";

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <section className="panel-botones">
      <div className="Cont-Nav">
        <div className="Cont-Nav-Tit">
          <h1>Panel de administrador</h1>
          <h4>BikeStore</h4>
        </div>
        <div className="Cont-Nav-Opt">
          <button onClick={() => navigate("/admin")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 2.5H3.33333C2.8731 2.5 2.5 2.8731 2.5 3.33333V9.16667C2.5 9.6269 2.8731 10 3.33333 10H7.5C7.96024 10 8.33333 9.6269 8.33333 9.16667V3.33333C8.33333 2.8731 7.96024 2.5 7.5 2.5Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16.666 2.5H12.4993C12.0391 2.5 11.666 2.8731 11.666 3.33333V5.83333C11.666 6.29357 12.0391 6.66667 12.4993 6.66667H16.666C17.1263 6.66667 17.4993 6.29357 17.4993 5.83333V3.33333C17.4993 2.8731 17.1263 2.5 16.666 2.5Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16.666 10H12.4993C12.0391 10 11.666 10.3731 11.666 10.8333V16.6667C11.666 17.1269 12.0391 17.5 12.4993 17.5H16.666C17.1263 17.5 17.4993 17.1269 17.4993 16.6667V10.8333C17.4993 10.3731 17.1263 10 16.666 10Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7.5 13.3333H3.33333C2.8731 13.3333 2.5 13.7063 2.5 14.1666V16.6666C2.5 17.1268 2.8731 17.4999 3.33333 17.4999H7.5C7.96024 17.4999 8.33333 17.1268 8.33333 16.6666V14.1666C8.33333 13.7063 7.96024 13.3333 7.5 13.3333Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Panel de administrador
          </button>
          <button onClick={() => navigate("/admin/gestion-productos")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M7.8776 15.5619C8.09534 15.6876 8.34233 15.7538 8.59375 15.7538C8.84517 15.7538 9.09216 15.6876 9.3099 15.5619L14.3229 12.6973C14.5404 12.5718 14.7211 12.3912 14.8468 12.1737C14.9725 11.9563 15.0388 11.7096 15.0391 11.4584V5.72924C15.0388 5.47807 14.9725 5.23139 14.8468 5.01393C14.7211 4.79648 14.5404 4.6159 14.3229 4.49031L9.3099 1.62573C9.09216 1.50002 8.84517 1.43384 8.59375 1.43384C8.34233 1.43384 8.09534 1.50002 7.8776 1.62573L2.86458 4.49031C2.64706 4.6159 2.46639 4.79648 2.3407 5.01393C2.215 5.23139 2.1487 5.47807 2.14844 5.72924V11.4584C2.1487 11.7096 2.215 11.9563 2.3407 12.1737C2.46639 12.3912 2.64706 12.5718 2.86458 12.6973L7.8776 15.5619Z" stroke="white" stroke-width="1.43229" strokeLinecap="round" stroke-linejoin="round"/>
              <path d="M8.59375 15.7552V8.59375" stroke="white" stroke-width="1.43229" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2.35547 5.01294L8.5931 8.59367L14.8307 5.01294" stroke="white" stroke-width="1.43229" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M5.37109 3.05786L11.8164 6.74601" stroke="white" stroke-width="1.43229" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Gestión de Productos
          </button>
        </div>
        <div className="Cont-Logout">
          <button onClick={handleLogout}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M10.6665 11.3332L13.9998 7.99984L10.6665 4.6665" stroke="#D4183D" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14 8H6" stroke="#D4183D" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6" stroke="#D4183D" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
            Cerrar sesión</button>
          
          <button onClick={() => navigate("/")}>Volver a bikestore</button>
        </div>
      </div>
      <img src="../LogoFooter.png" alt="BikeStore Logo" />
    </section>
  );
};

export default AdminNavbar;
