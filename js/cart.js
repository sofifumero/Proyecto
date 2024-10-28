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
        <div class= "carrito-head bg-dark text-white p-2 d-flex align-items-center">
        <i class= "bi bi-cart me-2"></i>
        <h1>🛒</h1>
        <h4 class= "m-0" > Detalles del carrito </h4>
        </div>
        <div class="p-3 border">
            ${cartItems
              .map((item, index) => {
                total += item.price * item.quantity;
                return `
                    <div class= "producto d-flex align-items-center justify-content-between mb-3">
                        <img src="${item.image}" alt= "${
                  item.name
                }" width="120" class="me-2">
                        <span class="fw-bold"> ${item.name}</span>
                        <div class=" input-group input-group-sm">
                            <button class="btn btn-outline-secondary " onclick="updateQuantity(${index}, -1)">-</button>
                            <input size="1" type="text"  value="${
                              item.quantity
                            }" readonly>
                             <button class="btn btn-outline-secondary " onclick="updateQuantity(${index}, 1)">+</button>
                        </div>   
                        <span class=" text-end ">$${item.price.toFixed(2)}
                        </span> 
                        <button onclick="borrarElemento">🗑️</button>   
                    </div>    
                 `;
              })
              .join("")}
                <div class=" d-flex justify-content-between border-top pt-3">
               <strong>Importe total</strong>
               <strong>$${total.toFixed(2)}</strong>
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

function borrarElemento (index){
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const item = cartItems[index];
}
