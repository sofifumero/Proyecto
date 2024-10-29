document.addEventListener("DOMContentLoaded", () => {
  const carrito = document.getElementById("carrito");
  const mensaje = document.getElementById("mensaje");
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  carrito.innerHTML = "";
  mensaje.innerHTML = "";

  if (cartItems.lenght === 0) {
    mensaje.textContent = "No hay productos en el carrito!";
  } else {
    let total = 0;
    carrito.innerHTML = `
        <div class= "carrito-head bg-dark text-white p-3 d-flex align-items-center">
        <h1 class="m-0 me-3 mb-2">🛒</h1>
        <h4 class= "m-0" > Detalles del carrito </h4>
        </div>
        <div class="p-3 border">
            ${cartItems.map((item, index) => {
      total += item.price * item.quantity;
      return `
              <div class= "producto d-flex align-items-center justify-content-between mb-3 gap-3">
                  <img src="${item.image}" alt= "${item.name}" width="120" class="me-2">
                  <span class="fw-bold flex-grow-1"> ${item.name}</span>
                  <div class="d-flex justify-content-between">
                    <div class="input-group input-group-sm me-3">
                        <button class="btn btn-outline-secondary " onclick="updateQuantity(${index}, -1)">-</button>
                        <input size="1" type="text"  value="${item.quantity}" readonly>
                        <button class="btn btn-outline-secondary " onclick="updateQuantity(${index}, 1)">+</button>
                    </div>   
                    <span class="text-end d-flex align-items-center w-min-xs">UYU $${item.price.toFixed(2)}</span>
                  </div>
                  <button class="btn btn" onclick="borrarElemento(${index})">🗑️</button>
              </div>
            `;
    })
        .join("")}
                <div class=" d-flex justify-content-between border-top pt-3">
               <strong>Importe total</strong>
               <strong class="me-5 pe-1">UYU $${total.toFixed(2)}</strong>
               </div>
        </div>           
        `;
  }
});

function updateQuantity(index, change) {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const item = cartItems[index];

  // Asegurarse de que la cantidad no sea menor a 1
  item.quantity = Math.max(1, item.quantity + change);

  // Guardar cambios y recargar el carrito
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  location.reload();
}

function borrarElemento(index) {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  // Elimina el elemento del carrito
  cartItems.splice(index, 1);

  // Guarda los cambios en localStorage
  localStorage.setItem('cartItems', JSON.stringify(cartItems));

  // Vuelve a cargar el carrito en la vista
  location.reload(); // Recarga la página para mostrar los cambios
}