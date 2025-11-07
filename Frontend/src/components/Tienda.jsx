import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Tienda() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProd, resCat] = await Promise.all([
          axios.get("http://localhost:3000/api/productos"),
          axios.get("http://localhost:3000/api/categorias"),
        ]);
        setProductos(resProd.data);
        setCategorias(resCat.data);
      } catch (error) {
        console.error("Error al cargar productos o categorías:", error);
      }
    };
    fetchData();
  }, []);

  // Manejar selección/deselección de categorías
  const toggleCategoria = (idCategoria) => {
    setCategoriasSeleccionadas((prev) =>
      prev.includes(idCategoria)
        ? prev.filter((id) => id !== idCategoria)
        : [...prev, idCategoria]
    );
  };

  // Filtrado de productos
  const productosFiltrados = productos.filter((prod) => {
    const coincideBusqueda = prod.nombre_producto
      ?.toLowerCase()
      .includes(busqueda.toLowerCase());

    const coincideCategoria =
      categoriasSeleccionadas.length === 0 ||
      categoriasSeleccionadas.includes(prod.id_categoria);

    return coincideBusqueda && coincideCategoria;
  });

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Sidebar de filtros */}
      <aside className="w-full md:w-1/4 bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Filtros
        </h2>

        {/* Buscar producto */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-medium">
            Buscar producto:
          </label>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Ej. Bicicleta, casco..."
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Filtro por categorías */}
        <div>
          <h3 className="text-lg font-medium mb-3 text-gray-800">
            Categorías
          </h3>
          <ul className="space-y-2">
            {categorias.map((cat) => (
              <li key={cat.id_categoria} className="flex items-center">
                <input
                  type="checkbox"
                  id={`cat-${cat.id_categoria}`}
                  checked={categoriasSeleccionadas.includes(cat.id_categoria)}
                  onChange={() => toggleCategoria(cat.id_categoria)}
                  className="mr-2 accent-blue-600"
                />
                <label
                  htmlFor={`cat-${cat.id_categoria}`}
                  className="cursor-pointer text-gray-700 hover:text-blue-600"
                >
                  {cat.nombre_categoria}
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* Botón limpiar filtros */}
        {categoriasSeleccionadas.length > 0 || busqueda ? (
          <button
            onClick={() => {
              setCategoriasSeleccionadas([]);
              setBusqueda("");
            }}
            className="mt-6 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-md font-medium transition"
          >
            Limpiar filtros
          </button>
        ) : null}
      </aside>

      {/* Grid de productos */}
      <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((prod) => (
            <div
              key={prod.id_producto}
              className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition p-4"
            >
              <img
                src={
                  prod.imagen
                    ? `http://localhost:3000/${prod.imagen}`
                    : "/placeholder.png"
                }
                alt={prod.nombre_producto}
                className="w-full h-48 object-cover rounded-md mb-3"
              />
              <h3 className="text-lg font-semibold text-gray-800">
                {prod.nombre_producto}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                {prod.descripcion?.slice(0, 60)}...
              </p>
              <p className="text-blue-600 font-bold text-lg">
                ${prod.precio_unitario.toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 text-lg mt-10">
            No se encontraron productos.
          </div>
        )}
      </section>
    </div>
  );
}
