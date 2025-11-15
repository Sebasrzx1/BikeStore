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

  const stockDisponible = producto.entradas - producto.salidas;
  const cantidadYaEnCarrito = existente ? existente.cantidad : 0;
  const cantidadTotalDeseada = cantidadYaEnCarrito + cantidad;

  if (cantidadTotalDeseada > stockDisponible) {
    const restante = Math.max(stockDisponible - cantidadYaEnCarrito, 0);
    mostrarToast(
      `No puedes añadir más. Stock máximo: ${stockDisponible} unidades. Ya tienes ${cantidadYaEnCarrito} en el carrito. Te quedan ${restante}.`
    );
    return;
  }

  if (existente) {
    existente.cantidad += cantidad;
    existente.subtotal = existente.precio * existente.cantidad;
    existente.stockDisponible = stockDisponible;
  } else {
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

      stockDisponible,
    });
  }

  localStorage.setItem("carrito", JSON.stringify(carritoActual));

  const totalCantidad = carritoActual.reduce((acc, p) => acc + p.cantidad, 0);
  setCantidadCarrito(totalCantidad);

  mostrarToast(
    `${producto.nombre_producto} añadido al carrito (${cantidad} unidad${
      cantidad > 1 ? "es" : ""
    }).`
  );
}
