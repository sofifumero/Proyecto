document.addEventListener("DOMContentLoaded", () => {
  const carrito = document.getElementById("carrito");
  const mensaje = document.getElementById("mensaje");
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  carrito.innerHTML = "";
  mensaje.innerHTML = "";

  contadorProductos();

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
                        <button class="btn btn" onclick="borrarElemento(${index})">🗑️</button>  
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

function borrarElemento(index) {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  
  // Elimina el elemento del carrito
  cartItems.splice(index, 1);

  // Guarda los cambios en localStorage
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  
  // Vuelve a cargar el carrito en la vista
  location.reload(); // Recarga la página para mostrar los cambios
}

function contadorProductos() {
  // Obtiene los artículos del carrito desde el localStorage. Si no hay, se asigna un arreglo vacío.
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  
  // Calcula el total de productos en el carrito sumando la cantidad de cada artículo.
  const totalProductos = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Busca el elemento de la interfaz de usuario donde se mostrará la notificación del total de productos.
  const notificacion = document.getElementById("notificacion");
  
  // Si el elemento de notificación existe en el DOM, actualiza su contenido y visibilidad.
  if (notificacion) {
    // Establece el texto de la notificación con el total de productos.
    notificacion.textContent = totalProductos;
  }
}