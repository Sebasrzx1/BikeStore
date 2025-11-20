import React, { useState, useEffect } from "react";
import "../styles/ProductoModal.css";

const ProductoModal = ({
  abierto,
  modoEdicion,
  productoActual,
  categorias,
  imagenPreview,
  onCerrar,
  onChange,
  onImagenChange,
  onGuardar,
}) => {
  const [mostrar, setMostrar] = useState(false);

  // Mostrar modal cuando "abierto" cambie a true
  useEffect(() => {
    if (abierto) setMostrar(true);
  }, [abierto]);

  // Cierra modal con animación
  const handleCerrar = () => {
    setMostrar(false); // dispara animación de salida
    setTimeout(() => onCerrar(), 300); // esperar a que termine la transición
  };

  if (!mostrar) return null;

  return (
    <div className={`modal-fondo ${abierto ? "show" : ""}`}>
      <div className="modal-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M11 20.7299C11.304 20.9054 11.6489 20.9979 12 20.9979C12.3511 20.9979 12.696 20.9054 13 20.7299L20 16.7299C20.3037 16.5545 20.556 16.3024 20.7315 15.9987C20.9071 15.6951 20.9996 15.3506 21 14.9999V6.9999C20.9996 6.64918 20.9071 6.30471 20.7315 6.00106C20.556 5.69742 20.3037 5.44526 20 5.2699L13 1.2699C12.696 1.09437 12.3511 1.00195 12 1.00195C11.6489 1.00195 11.304 1.09437 11 1.2699L4 5.2699C3.69626 5.44526 3.44398 5.69742 3.26846 6.00106C3.09294 6.30471 3.00036 6.64918 3 6.9999V14.9999C3.00036 15.3506 3.09294 15.6951 3.26846 15.9987C3.44398 16.3024 3.69626 16.5545 4 16.7299L11 20.7299Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 21V11" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M3.28906 6L11.9991 11L20.7091 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7.5 3.26953L16.5 8.41953" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div className="modal-header-text">
              <h2>
                {modoEdicion ? "Editar Producto" : "Agregar Nuevo Producto"}
              </h2>
              <p>
                Complete todos los campos para agregar un producto al catálogo
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={handleCerrar}>
            &times;
          </button>
        </div>

        {/* Formulario */}
        <form
          className="modal-form"
          onSubmit={(e) => {
            e.preventDefault();
            onGuardar();
          }}
        >
          <div className="fieldset-horizontal">
            <label>
              <div style={{ display: "flex", justifyContent: "flex-start", gap: "10px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <g clip-path="url(#clip0_378_413)">
                    <path d="M8.39132 1.72367C8.14133 1.47361 7.80224 1.33308 7.44865 1.33301H2.66732C2.3137 1.33301 1.97456 1.47348 1.72451 1.72353C1.47446 1.97358 1.33398 2.31272 1.33398 2.66634V7.44767C1.33406 7.80127 1.47459 8.14035 1.72465 8.39034L7.52732 14.193C7.83033 14.4941 8.24015 14.6631 8.66732 14.6631C9.09449 14.6631 9.50431 14.4941 9.80732 14.193L14.194 9.80634C14.4951 9.50333 14.6641 9.09351 14.6641 8.66634C14.6641 8.23917 14.4951 7.82935 14.194 7.52634L8.39132 1.72367Z" stroke="#8B0000" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M4.99935 5.33366C5.18344 5.33366 5.33268 5.18442 5.33268 5.00033C5.33268 4.81623 5.18344 4.66699 4.99935 4.66699C4.81525 4.66699 4.66602 4.81623 4.66602 5.00033C4.66602 5.18442 4.81525 5.33366 4.99935 5.33366Z" fill="#8B0000" stroke="#8B0000" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_378_413">
                      <rect width="16" height="16" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              Nombre del producto
              </div>
              <input
                type="text"
                name="nombre_producto"
                value={productoActual.nombre_producto}
                placeholder="Ej: Bicicleta Mountain Pro X1"
                onChange={onChange}
                required
              />
            </label>
            <label>
              <div style={{ display: "flex", justifyContent: "flex-start", gap: "10px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <g clip-path="url(#clip0_378_413)">
                    <path d="M8.39132 1.72367C8.14133 1.47361 7.80224 1.33308 7.44865 1.33301H2.66732C2.3137 1.33301 1.97456 1.47348 1.72451 1.72353C1.47446 1.97358 1.33398 2.31272 1.33398 2.66634V7.44767C1.33406 7.80127 1.47459 8.14035 1.72465 8.39034L7.52732 14.193C7.83033 14.4941 8.24015 14.6631 8.66732 14.6631C9.09449 14.6631 9.50431 14.4941 9.80732 14.193L14.194 9.80634C14.4951 9.50333 14.6641 9.09351 14.6641 8.66634C14.6641 8.23917 14.4951 7.82935 14.194 7.52634L8.39132 1.72367Z" stroke="#8B0000" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M4.99935 5.33366C5.18344 5.33366 5.33268 5.18442 5.33268 5.00033C5.33268 4.81623 5.18344 4.66699 4.99935 4.66699C4.81525 4.66699 4.66602 4.81623 4.66602 5.00033C4.66602 5.18442 4.81525 5.33366 4.99935 5.33366Z" fill="#8B0000" stroke="#8B0000" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_378_413">
                      <rect width="16" height="16" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              Marca
              </div>
              <input
                type="text"
                name="marca"
                value={productoActual.marca}
                placeholder="Ej: Trek, Giant, Specialized"
                onChange={onChange}
                required
              />
            </label>
          </div>

          <div className="fieldset-horizontal">
            <label>
              <div style={{ display: "flex", justifyContent: "flex-start", gap: "10px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M14 5.33359C13.9998 5.09978 13.938 4.87013 13.821 4.6677C13.704 4.46527 13.5358 4.29717 13.3333 4.18026L8.66667 1.51359C8.46397 1.39657 8.23405 1.33496 8 1.33496C7.76595 1.33496 7.53603 1.39657 7.33333 1.51359L2.66667 4.18026C2.46418 4.29717 2.29599 4.46527 2.17897 4.6677C2.06196 4.87013 2.00024 5.09978 2 5.33359V10.6669C2.00024 10.9007 2.06196 11.1304 2.17897 11.3328C2.29599 11.5353 2.46418 11.7034 2.66667 11.8203L7.33333 14.4869C7.53603 14.604 7.76595 14.6656 8 14.6656C8.23405 14.6656 8.46397 14.604 8.66667 14.4869L13.3333 11.8203C13.5358 11.7034 13.704 11.5353 13.821 11.3328C13.938 11.1304 13.9998 10.9007 14 10.6669V5.33359Z" stroke="#8B0000" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2.19922 4.66699L7.99922 8.00033L13.7992 4.66699" stroke="#8B0000" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8 14.6667V8" stroke="#8B0000" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              Categoría
              </div>
              <select
                name="id_categoria"
                value={productoActual.id_categoria}
                onChange={onChange}
                required
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map((c) => (
                  <option key={c.id_categoria} value={c.id_categoria}>
                    {c.nombre_categoria}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <div style={{ display: "flex", justifyContent: "flex-start", gap: "10px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M14 5.33359C13.9998 5.09978 13.938 4.87013 13.821 4.6677C13.704 4.46527 13.5358 4.29717 13.3333 4.18026L8.66667 1.51359C8.46397 1.39657 8.23405 1.33496 8 1.33496C7.76595 1.33496 7.53603 1.39657 7.33333 1.51359L2.66667 4.18026C2.46418 4.29717 2.29599 4.46527 2.17897 4.6677C2.06196 4.87013 2.00024 5.09978 2 5.33359V10.6669C2.00024 10.9007 2.06196 11.1304 2.17897 11.3328C2.29599 11.5353 2.46418 11.7034 2.66667 11.8203L7.33333 14.4869C7.53603 14.604 7.76595 14.6656 8 14.6656C8.23405 14.6656 8.46397 14.604 8.66667 14.4869L13.3333 11.8203C13.5358 11.7034 13.704 11.5353 13.821 11.3328C13.938 11.1304 13.9998 10.9007 14 10.6669V5.33359Z" stroke="#8B0000" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2.19922 4.66699L7.99922 8.00033L13.7992 4.66699" stroke="#8B0000" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8 14.6667V8" stroke="#8B0000" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              Stock disponible
              </div>
              <input
                type="number"
                min="0"
                name="entradas"
                value={productoActual.entradas}
                onChange={onChange}
                required
              />
            </label>
            <label>
              <div style={{ display: "flex", justifyContent: "flex-start", gap: "10px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8.39132 1.72367C8.14133 1.47361 7.80224 1.33308 7.44865 1.33301H2.66732C2.3137 1.33301 1.97456 1.47348 1.72451 1.72353C1.47446 1.97358 1.33398 2.31272 1.33398 2.66634V7.44767C1.33406 7.80127 1.47459 8.14035 1.72465 8.39034L7.52732 14.193C7.83033 14.4941 8.24015 14.6631 8.66732 14.6631C9.09449 14.6631 9.50431 14.4941 9.80732 14.193L14.194 9.80634C14.4951 9.50333 14.6641 9.09351 14.6641 8.66634C14.6641 8.23917 14.4951 7.82935 14.194 7.52634L8.39132 1.72367Z" stroke="#8B0000" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M4.99935 5.33366C5.18344 5.33366 5.33268 5.18442 5.33268 5.00033C5.33268 4.81623 5.18344 4.66699 4.99935 4.66699C4.81525 4.66699 4.66602 4.81623 4.66602 5.00033C4.66602 5.18442 4.81525 5.33366 4.99935 5.33366Z" fill="#8B0000" stroke="#8B0000" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              Material
              </div>
              <input
                    type="text"
                    name="material"
                    value={productoActual.material}
                    onChange={onChange}
                    required
              />
            </label>
            <label>
              <div style={{ display: "flex", justifyContent: "flex-start", gap: "10px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8.39132 1.72367C8.14133 1.47361 7.80224 1.33308 7.44865 1.33301H2.66732C2.3137 1.33301 1.97456 1.47348 1.72451 1.72353C1.47446 1.97358 1.33398 2.31272 1.33398 2.66634V7.44767C1.33406 7.80127 1.47459 8.14035 1.72465 8.39034L7.52732 14.193C7.83033 14.4941 8.24015 14.6631 8.66732 14.6631C9.09449 14.6631 9.50431 14.4941 9.80732 14.193L14.194 9.80634C14.4951 9.50333 14.6641 9.09351 14.6641 8.66634C14.6641 8.23917 14.4951 7.82935 14.194 7.52634L8.39132 1.72367Z" stroke="#8B0000" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M4.99935 5.33366C5.18344 5.33366 5.33268 5.18442 5.33268 5.00033C5.33268 4.81623 5.18344 4.66699 4.99935 4.66699C4.81525 4.66699 4.66602 4.81623 4.66602 5.00033C4.66602 5.18442 4.81525 5.33366 4.99935 5.33366Z" fill="#8B0000" stroke="#8B0000" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              Precio
              </div>
              <input
                type="number"
                min="0"
                step="0.01"
                name="precio_unitario"
                value={productoActual.precio_unitario}
                onChange={onChange}
                required
              />
            </label>
            <label>
              <div style={{ display: "flex", justifyContent: "flex-start", gap: "10px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8.39132 1.72367C8.14133 1.47361 7.80224 1.33308 7.44865 1.33301H2.66732C2.3137 1.33301 1.97456 1.47348 1.72451 1.72353C1.47446 1.97358 1.33398 2.31272 1.33398 2.66634V7.44767C1.33406 7.80127 1.47459 8.14035 1.72465 8.39034L7.52732 14.193C7.83033 14.4941 8.24015 14.6631 8.66732 14.6631C9.09449 14.6631 9.50431 14.4941 9.80732 14.193L14.194 9.80634C14.4951 9.50333 14.6641 9.09351 14.6641 8.66634C14.6641 8.23917 14.4951 7.82935 14.194 7.52634L8.39132 1.72367Z" stroke="#8B0000" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M4.99935 5.33366C5.18344 5.33366 5.33268 5.18442 5.33268 5.00033C5.33268 4.81623 5.18344 4.66699 4.99935 4.66699C4.81525 4.66699 4.66602 4.81623 4.66602 5.00033C4.66602 5.18442 4.81525 5.33366 4.99935 5.33366Z" fill="#8B0000" stroke="#8B0000" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              Peso
              </div>
              <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="peso"
                    value={productoActual.peso}
                    onChange={onChange}
                    required
              />
            </label>
          </div>
          

          <label className="desc-label">
            Descripción
            <textarea
              name="descripcion"
              value={productoActual.descripcion}
              placeholder="Describa las características principales del producto, materiales, especificaciones técnicas, etc."
              onChange={onChange}
              rows={4}
              required
            />
          </label>

          <label className="imagenes-label">
            <div style={{ display: "flex", justifyContent: "flex-start", gap: "10px" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12.6667 2H3.33333C2.59695 2 2 2.59695 2 3.33333V12.6667C2 13.403 2.59695 14 3.33333 14H12.6667C13.403 14 14 13.403 14 12.6667V3.33333C14 2.59695 13.403 2 12.6667 2Z" stroke="#8B0000" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M5.99935 7.33366C6.73573 7.33366 7.33268 6.73671 7.33268 6.00033C7.33268 5.26395 6.73573 4.66699 5.99935 4.66699C5.26297 4.66699 4.66602 5.26395 4.66602 6.00033C4.66602 6.73671 5.26297 7.33366 5.99935 7.33366Z" stroke="#8B0000" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 10.0004L11.9427 7.94312C11.6926 7.69315 11.3536 7.55273 11 7.55273C10.6464 7.55273 10.3074 7.69315 10.0573 7.94312L4 14.0004" stroke="#8B0000" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            Imágenes del producto
            </div>
            <div className="upload-container">
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={onImagenChange}
                required={!modoEdicion}
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="32" viewBox="0 0 40 32" fill="none">
                <path d="M20 4V20" stroke="#717182" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M28.3327 10.6667L19.9993 4L11.666 10.6667" stroke="#717182" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M35 20V25.3333C35 26.0406 34.6488 26.7189 34.0237 27.219C33.3986 27.719 32.5507 28 31.6667 28H8.33333C7.44928 28 6.60143 27.719 5.97631 27.219C5.35119 26.7189 5 26.0406 5 25.3333V20" stroke="#717182" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <p>
                Haga clic para cargar imágenes
                <br />
                PNG, JPG, WEBP hasta 10MB
              </p>
            </div>
            {imagenPreview && (
              <img
                src={imagenPreview}
                alt="Vista previa"
                className="imagen-preview"
              />
            )}
          </label>

          <div className="modal-footer">
            <button type="button" className="btn-cancelar" onClick={handleCerrar}>
              Cancelar
            </button>
            <button type="submit" className="btn-guardar">
              {modoEdicion ? "Guardar cambios" : "Guardar producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductoModal;
