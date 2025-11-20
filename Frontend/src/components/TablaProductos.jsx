import React from "react";

const TablaProductos = ({
  productos,
  categorias,
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
            const stock = p.entradas - p.salidas;
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
                <td>
                  <button
                    className="btn-editar"
                    onClick={() => abrirModalEditar(p)}
                    title="Editar"
                  >
                    {/* Puedes reemplazar con tu SVG */}
                    ✏️
                  </button>
                  <button
                    className="btn-eliminar1"
                    onClick={() => eliminarProducto(p.id_producto)}
                    title="Eliminar"
                  >
                    🗑️
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

export default TablaProductos;