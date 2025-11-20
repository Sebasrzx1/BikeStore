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
              Nombre del producto
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
              Marca
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
              Categoría
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
              Stock disponible
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
              Precio
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
            Imágenes del producto
            <div className="upload-container">
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={onImagenChange}
                required={!modoEdicion}
              />
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
