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

  useEffect(() => {
    if (abierto) setMostrar(true);
  }, [abierto]);

  const handleCerrar = () => {
    setMostrar(false);
    setTimeout(() => onCerrar(), 300);
  };

  if (!mostrar) return null;

  return (
    <div className={`modal-fondo ${abierto ? "show" : ""}`}>
      <div className="modal-modal">
        
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-header-text">
              <h2>{modoEdicion ? "Editar Producto" : "Agregar Nuevo Producto"}</h2>
              <p>Complete todos los campos para agregar un producto al catálogo</p>
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
            {/* Categoría */}
            <label>
              <div style={{ display: "flex", justifyContent: "flex-start", gap: "10px" }}>
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

            {/* STOCK (actualizado) */}
            <label>
              <div style={{ display: "flex", justifyContent: "flex-start", gap: "10px" }}>
                Stock disponible
              </div>
              <input
                type="number"
                min="0"
                name="stock"
                value={productoActual.stock}
                onChange={onChange}
                required
              />
            </label>

            {/* Material */}
            <label>
              <div style={{ display: "flex", justifyContent: "flex-start", gap: "10px" }}>
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

            {/* Precio */}
            <label>
              <div style={{ display: "flex", justifyContent: "flex-start", gap: "10px" }}>
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

            {/* Peso */}
            <label>
              <div style={{ display: "flex", justifyContent: "flex-start", gap: "10px" }}>
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

          {/* Descripción */}
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

          {/* Imagen */}
          <label className="imagenes-label">
            <div style={{ display: "flex", justifyContent: "flex-start", gap: "10px" }}>
              Imágenes del producto
            </div>

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
              <img src={imagenPreview} alt="Vista previa" className="imagen-preview" />
            )}
          </label>

          {/* Footer */}
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
