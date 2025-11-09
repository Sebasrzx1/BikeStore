export function agregarUnidadAlCarrito(producto, actualizarCantidad) {
  const stockDisponible = producto.entradas - producto.salidas;
  if (stockDisponible < 1) return;

  const itemCarrito = {
    id_producto: producto.id_producto,
    nombre: producto.nombre_producto,
    precio: producto.precio_unitario,
    cantidad: 1,
    subtotal: producto.precio_unitario,
    imagen: producto.imagen
      ? `http://localhost:3000/${producto.imagen}`
      : "/placeholder.png",
  };

  const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
  const existente = carritoActual.find(
    (p) => p.id_producto === producto.id_producto
  );

  if (existente) {
    existente.cantidad += 1;
    existente.subtotal = existente.precio * existente.cantidad;
  } else {
    carritoActual.push(itemCarrito);
  }

  localStorage.setItem("carrito", JSON.stringify(carritoActual));

  // ✅ Actualiza el contador global si se pasó el callback
  if (typeof actualizarCantidad === "function") {
    const total = carritoActual.reduce((acc, item) => acc + item.cantidad, 0);
    actualizarCantidad(total);
  }

  alert(`${producto.nombre_producto} añadido al carrito (1 unidad).`);
}
