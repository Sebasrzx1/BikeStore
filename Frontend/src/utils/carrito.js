export function agregarUnidadAlCarrito(
  producto,
  setCantidadCarrito,
  mostrarToast,
  cantidad = 1
) {
  const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
  const existente = carritoActual.find(
    (p) => p.id_producto === producto.id_producto
  );

  // 🟢 Nuevo: ahora el stock se toma directamente desde el backend
  const stockDisponible = producto.stock || 0;

  const cantidadYaEnCarrito = existente ? existente.cantidad : 0;
  const cantidadTotalDeseada = cantidadYaEnCarrito + cantidad;

  // ⚠️ Validar que no exceda el stock actual
  if (cantidadTotalDeseada > stockDisponible) {
    const restante = Math.max(stockDisponible - cantidadYaEnCarrito, 0);
    mostrarToast(
      `No puedes añadir más. Stock máximo: ${stockDisponible} unidades. Ya tienes ${cantidadYaEnCarrito} en el carrito. Te quedan ${restante}.`
    );
    return;
  }

  // 🟩 Si ya existe en carrito, actualizar cantidad
  if (existente) {
    existente.cantidad += cantidad;
    existente.subtotal = existente.precio * existente.cantidad;
    existente.stockDisponible = stockDisponible;
  } else {
    // 🟩 Si no existe, agregar nuevo producto
    carritoActual.push({
      id_producto: producto.id_producto,
      nombre: producto.nombre_producto,
      marca: producto.marca,
      precio: producto.precio_unitario,
      cantidad,
      subtotal: producto.precio_unitario * cantidad,
      imagen: producto.imagen
        ? `http://localhost:3000/uploads/productos/${producto.imagen}`
        : "/placeholder.png",

      // 🟢 Guardamos stock actual del backend
      stockDisponible,
    });
  }

  // Guardar cambios
  localStorage.setItem("carrito", JSON.stringify(carritoActual));

  // Actualizar cantidad total del carrito
  const totalCantidad = carritoActual.reduce((acc, p) => acc + p.cantidad, 0);
  setCantidadCarrito(totalCantidad);

  mostrarToast(
    `${producto.nombre_producto} añadido al carrito (${cantidad} unidad${
      cantidad > 1 ? "es" : ""
    }).`
  );
}
