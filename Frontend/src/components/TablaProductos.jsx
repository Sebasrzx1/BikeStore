import React from "react";
import PropTypes from "prop-types";

const TablaProductos = ({
  productos,
  obtenerNombreCategoria,
  abrirModalEditar,
  eliminarProducto,
}) => {
  return (
    <table className="tabla-productos">
      <thead>
        <tr>
          <th>Nombre del Producto</th>
          <th>Marca</th>
          <th>Categoría</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {productos.length === 0 ? (
          <tr>
            <td colSpan="7">No hay productos disponibles</td>
          </tr>
        ) : (
          productos.map((p) => {
            const stock = Number(p.stock) || 0;
            const estado = stock > 0 ? "activo" : "sin-stock";

            return (
              <tr key={p.id_producto}>
                <td>{p.nombre_producto}</td>
                <td>{p.marca}</td>
                <td>{obtenerNombreCategoria(p.id_categoria)}</td>
                <td>
                  $
                  {Number(p.precio_unitario)
                    .toFixed(2)
                    .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
                </td>
                <td>{stock}</td>
                <td>
                  <span className={`badge-estado ${estado}`}>{estado}</span>
                </td>
                <td className="acciones-producto">
                  <button
                    className="btn-editar"
                    onClick={() => abrirModalEditar(p)}
                    title="Editar"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M8 2H3.33333C2.97971 2 2.64057 2.14048 2.39052 2.39052C2.14048 2.64057 2 2.97971 2 3.33333V12.6667C2 13.0203 2.14048 13.3594 2.39052 13.6095C2.64057 13.8595 2.97971 14 3.33333 14H12.6667C13.0203 14 13.3594 13.8595 13.6095 13.6095C13.8595 13.3594 14 13.0203 14 12.6667V8"
                        stroke="black"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12.2494 1.75003C12.5146 1.48481 12.8743 1.33582 13.2494 1.33582C13.6245 1.33582 13.9842 1.48481 14.2494 1.75003C14.5146 2.01525 14.6636 2.37496 14.6636 2.75003C14.6636 3.1251 14.5146 3.48481 14.2494 3.75003L8.24075 9.75936C8.08244 9.91753 7.88688 10.0333 7.67208 10.096L5.75674 10.656C5.69938 10.6728 5.63857 10.6738 5.58068 10.6589C5.5228 10.6441 5.46996 10.614 5.42771 10.5717C5.38546 10.5295 5.35534 10.4766 5.34051 10.4188C5.32568 10.3609 5.32668 10.3001 5.34341 10.2427L5.90341 8.32736C5.96643 8.11273 6.08243 7.9174 6.24075 7.75936L12.2494 1.75003Z"
                        stroke="black"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <button
                    className="btn-eliminar1"
                    onClick={() => eliminarProducto(p.id_producto)}
                    title="Eliminar"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M6.66602 7.33337V11.3334"
                        stroke="#D4183D"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.33398 7.33337V11.3334"
                        stroke="#D4183D"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12.6673 4V13.3333C12.6673 13.687 12.5268 14.0261 12.2768 14.2761C12.0267 14.5262 11.6876 14.6667 11.334 14.6667H4.66732C4.3137 14.6667 3.97456 14.5262 3.72451 14.2761C3.47446 14.0261 3.33398 13.687 3.33398 13.3333V4"
                        stroke="#D4183D"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 4H14"
                        stroke="#D4183D"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.33398 4.00004V2.66671C5.33398 2.31309 5.47446 1.97395 5.72451 1.7239C5.97456 1.47385 6.3137 1.33337 6.66732 1.33337H9.33398C9.68761 1.33337 10.0267 1.47385 10.2768 1.7239C10.5268 1.97395 10.6673 2.31309 10.6673 2.66671V4.00004"
                        stroke="#D4183D"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
};

TablaProductos.propTypes = {
  productos: PropTypes.arrayOf(
    PropTypes.shape({
      id_producto: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      nombre_producto: PropTypes.string.isRequired,
      marca: PropTypes.string.isRequired,
      id_categoria: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      precio_unitario: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      stock: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    })
  ).isRequired,
  obtenerNombreCategoria: PropTypes.func.isRequired,
  abrirModalEditar: PropTypes.func.isRequired,
  eliminarProducto: PropTypes.func.isRequired,
};

export default TablaProductos;
