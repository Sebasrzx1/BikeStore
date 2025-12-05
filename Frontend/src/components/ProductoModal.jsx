import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
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
  const [errores, setErrores] = useState({});
  const [modalExito, setModalExito] = useState(false); // Nuevo: para modal de éxito
  const [mensajeExito, setMensajeExito] = useState(""); // Nuevo: mensaje dinámico

  useEffect(() => {
    if (abierto) setMostrar(true);
  }, [abierto]);

  const handleCerrar = () => {
    setMostrar(false);
    setErrores({});
    setModalExito(false); // Limpiar modal de éxito
    setMensajeExito("");
    setTimeout(() => onCerrar(), 300);
  };

  // Función para validar un campo específico (igual que antes)
  const validarCampo = (name, value) => {
    let error = "";
    switch (name) {
      case "nombre_producto":
        if (!value.trim()) {
          error = "El nombre del producto es obligatorio.";
        } else if (value.length > 100) {
          error = "El nombre no puede exceder 100 caracteres.";
        } else if (!/^[\p{L}0-9\s\-_.,]+$/u.test(value)) {
          error = "El nombre solo puede contener letras, números, espacios y caracteres básicos.";
        }
        break;
      case "marca":
        if (!value.trim()) {
          error = "La marca es obligatoria.";
        } else if (value.length > 50) {
          error = "La marca no puede exceder 50 caracteres.";
        } else if (!/^[\p{L}0-9\s\-_.,]+$/u.test(value)) {
          error = "La marca solo puede contener letras, números, espacios y caracteres básicos.";
        }
        break;
      case "id_categoria":
        if (!value) {
          error = "Debe seleccionar una categoría.";
        }
        break;
      case "stock":
        if (modoEdicion) break;
        if (value === "" || value < 0) {
          error = "El stock debe ser un número entero positivo.";
        } else if (!Number.isInteger(Number(value))) {
          error = "El stock debe ser un número entero.";
        }
        break;
      case "cantidad_a_agregar":
        if (!modoEdicion) break;
        if (value !== "" && (value < 0 || !Number.isInteger(Number(value)))) {
          error = "La cantidad a agregar debe ser un número entero positivo o cero.";
        }
        break;
      case "material":
        if (!value.trim()) {
          error = "El material es obligatorio.";
        } else if (value.length > 50) {
          error = "El material no puede exceder 50 caracteres.";
        } else if (!/^[\p{L}0-9\s\-_.,]+$/u.test(value)) {
          error = "El material solo puede contener letras, números, espacios y caracteres básicos.";
        }
        break;
      case "precio_unitario":
        if (value === "" || value <= 0) {
          error = "El precio debe ser un número positivo mayor a 0.";
        } else if (!/^\d+(\.\d{1,2})?$/.test(value)) {
          error = "El precio debe tener hasta 2 decimales.";
        }
        break;
      case "peso":
        if (!value.trim()) {
          error = "El peso es obligatorio.";
        } else if (value.length > 20) {
          error = "El peso no puede exceder 20 caracteres.";
        } else if (!/^\d+(\.\d{1,2})?\s?(kg|lb|g|oz)$/i.test(value)) {
          error = "El peso debe estar en formato como '5kg', '10.5lb', etc.";
        }
        break;
      case "descripcion":
        if (!value.trim()) {
          error = "La descripción es obligatoria.";
        } else if (value.length > 500) {
          error = "La descripción no puede exceder 500 caracteres.";
        }
        break;
      default:
        break;
    }
    setErrores((prev) => ({ ...prev, [name]: error }));
  };

  // Manejar cambios en inputs con validación (igual que antes)
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(e);
    validarCampo(name, value);
  };

  // Manejar cambio de imagen con validación (igual que antes)
  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
      const maxSize = 10 * 1024 * 1024;
      if (!allowedTypes.includes(file.type)) {
        setErrores((prev) => ({ ...prev, imagen: "Solo se permiten imágenes PNG, JPG o WEBP." }));
        return;
      }
      if (file.size > maxSize) {
        setErrores((prev) => ({ ...prev, imagen: "La imagen no puede exceder 10MB." }));
        return;
      }
      setErrores((prev) => ({ ...prev, imagen: "" }));
    }
    onImagenChange(e);
  };

  // Modificado: Verificar errores y mostrar modal de éxito después de guardar
  const handleSubmit = (e) => {
    e.preventDefault();
    const camposObligatorios = [
      "nombre_producto",
      "marca",
      "id_categoria",
      "material",
      "precio_unitario",
      "peso",
      "descripcion",
    ];
    if (!modoEdicion) camposObligatorios.push("stock");
    let hayErrores = false;
    camposObligatorios.forEach((campo) => {
      validarCampo(campo, productoActual[campo]);
      if (errores[campo]) hayErrores = true;
    });
    if (errores.imagen) hayErrores = true;
    if (!hayErrores) {
      onGuardar();
      // Nuevo: Mostrar modal de éxito
      setMensajeExito(modoEdicion ? "Producto editado con éxito" : "Producto añadido con éxito");
      setModalExito(true);
      setTimeout(() => {
        setModalExito(false);
        handleCerrar();
      }, 2500);
    }
  };

  if (!mostrar) return null;

  return (
    <div className={`modal-fondo ${abierto ? "show" : ""}`}>
      <div className="modal-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M11 20.7299C11.304 20.9054 11.6489 20.9979 12 20.9979C12.3511 20.9979 12.696 20.9054 13 20.7299L20 16.7299C20.3037 16.5545 20.556 16.3024 20.7315 15.9987C20.9071 15.6951 20.9996 15.3506 21 14.9999V6.9999C20.9996 6.64918 20.9071 6.30471 20.7315 6.00106C20.556 5.69742 20.3037 5.44526 20 5.2699L13 1.2699C12.696 1.09437 12.3511 1.00195 12 1.00195C11.6489 1.00195 11.304 1.09437 11 1.2699L4 5.2699C3.69626 5.44526 3.44398 5.69742 3.26846 6.00106C3.09294 6.30471 3.00036 6.64918 3 6.9999V14.9999C3.00036 15.3506 3.09294 15.6951 3.26846 15.9987C3.44398 16.3024 3.69626 16.5545 4 16.7299L11 20.7299Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 21V11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.28906 6L11.9991 11L20.7091 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7.5 3.26953L16.5 8.41953" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
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
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="fieldset-horizontal">
            <label>
              Nombre del producto
              <input
                type="text"
                name="nombre_producto"
                value={productoActual.nombre_producto}
                placeholder="Ej: Bicicleta Mountain Pro X1"
                onChange={handleChange}
                required
              />
              {errores.nombre_producto && <span className="error">{errores.nombre_producto}</span>}
            </label>

            <label>
              Marca
              <input
                type="text"
                name="marca"
                value={productoActual.marca}
                placeholder="Ej: Trek, Giant, Specialized"
                onChange={handleChange}
                required
              />
              {errores.marca && <span className="error">{errores.marca}</span>}
            </label>
          </div>

          <div className="fieldset-horizontal">
            <label>
              Categoría
              <select
                name="id_categoria"
                value={productoActual.id_categoria}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map((c) => (
                  <option key={c.id_categoria} value={c.id_categoria}>
                    {c.nombre_categoria}
                  </option>
                ))}
              </select>
              {errores.id_categoria && <span className="error">{errores.id_categoria}</span>}
            </label>

            {modoEdicion ? (
              <>
                <label>
                  Stock actual
                  <input
                    type="number"
                    value={productoActual.stock_actual}
                    readOnly
                    style={{ backgroundColor: '#f0f0f0' }}
                  />
                </label>
                <label>
                  Añadir al stock
                  <input
                    type="number"
                    min="0"
                    name="cantidad_a_agregar"
                    value={productoActual.cantidad_a_agregar}
                    onChange={handleChange}
                    placeholder="Cantidad a añadir (ej: 10)"
                  />
                  {errores.cantidad_a_agregar && <span className="error">{errores.cantidad_a_agregar}</span>}
                </label>
              </>
            ) : (
              <label>
                Stock disponible
                <input
                  type="number"
                  min="0"
                  name="stock"
                  value={productoActual.stock}
                  onChange={handleChange}
                  required
                />
                {errores.stock && <span className="error">{errores.stock}</span>}
              </label>
            )}

            <label>
              Material
              <input
                type="text"
                name="material"
                value={productoActual.material}
                onChange={handleChange}
                required
              />
              {errores.material && <span className="error">{errores.material}</span>}
            </label>

            <label>
              Precio
              <input
                type="number"
                min="0"
                step="0.01"
                name="precio_unitario"
                value={productoActual.precio_unitario}
                onChange={handleChange}
                required
              />
              {errores.precio_unitario && <span className="error">{errores.precio_unitario}</span>}
            </label>

            <label>
              Peso
              <input
                type="text"
                name="peso"
                value={productoActual.peso}
                onChange={handleChange}
                required
                placeholder="Ej: 5kg, 10lb"
              />
              {errores.peso && <span className="error">{errores.peso}</span>}
            </label>
          </div>

          <label className="desc-label">
            Descripción
            <textarea
              name="descripcion"
              value={productoActual.descripcion}
              placeholder="Describa las características principales del producto"
              onChange={handleChange}
              rows={4}
              required
            />
            {errores.descripcion && <span className="error">{errores.descripcion}</span>}
          </label>

          <label className="imagenes-label">
            Imágenes del producto
            <div className="upload-container">
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleImagenChange}
                required={!modoEdicion}
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="32" viewBox="0 0 40 32" fill="none">
                <path d="M20 4V20" stroke="#717182" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M28.3327 10.6667L19.9993 4L11.666 10.6667" stroke="#717182" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M35 20V25.3333C35 26.0406 34.6488 26.7189 34.0237 27.219C33.3986 27.719 32.5507 28 31.6667 28H8.33333C7.44928 28 6.60143 27.719 5.97631 27.219C5.35119 26.7189 5 26.0406 5 25.3333V20" stroke="#717182" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p>
                Haga clic para cargar imágenes
                <br />
                PNG, JPG, WEBP hasta 10MB
              </p>
            </div>
            {errores.imagen && <span className="error">{errores.imagen}</span>}
            {imagenPreview && (
              <img src={imagenPreview} alt="Vista previa" className="imagen-preview" />
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

        {/* Nuevo: Modal de éxito usando clases existentes del CSS */}
        {modalExito && (
          <div className="modal-overlay" role="presentation">
            <div className="modal-contenido" role="presentation">
              <h3 style={{ color: "green" }}>✔ {mensajeExito}</h3>
              <p>El modal se cerrará automáticamente...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ProductoModal.propTypes = {
  abierto: PropTypes.bool.isRequired,
  modoEdicion: PropTypes.bool.isRequired,
  productoActual: PropTypes.shape({
    nombre_producto: PropTypes.string,
    marca: PropTypes.string,
    id_categoria: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stock_actual: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    cantidad_a_agregar: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stock: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    material: PropTypes.string,
    precio_unitario: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    peso: PropTypes.string,
    descripcion: PropTypes.string,
  }).isRequired,
  categorias: PropTypes.arrayOf(
    PropTypes.shape({
      id_categoria: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      nombre_categoria: PropTypes.string.isRequired,
    })
  ).isRequired,
  imagenPreview: PropTypes.string,
  onCerrar: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onImagenChange: PropTypes.func.isRequired,
  onGuardar: PropTypes.func.isRequired,
};

export default ProductoModal;

