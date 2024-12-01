// Escuchar el evento 'DOMContentLoaded' para asegurarse de que el DOM está listo
document.addEventListener("DOMContentLoaded", () => {
  manejarEventoFinalizarCompra(); // Inicializa los eventos para finalizar la compra


  const carrito = document.getElementById("carrito");
  const mensaje = document.getElementById("mensaje");
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || []; // Recupera los ítems del carrito o inicia con un array vacío


  carrito.innerHTML = ""; // Limpia el contenido del carrito en el DOM
  mensaje.innerHTML = ""; // Limpia los mensajes previos

// Verifica si el carrito está vacío
  if (cartItems.length === 0) {
    mensaje.textContent = "No hay productos en el carrito!";
  } else {
    const subtotal = calculateSubtotal(cartItems);  // Calcula el subtotal
    const shippingCost = getShippingCost();  // Obtiene el costo de envío
    const total = subtotal + shippingCost; // Calcula el total (subtotal + envío)

    //  Genera dinámicamente el contenido del carrito 
    carrito.innerHTML = `
        <div class= "carrito-head bg-dark text-white p-3 d-flex align-items-center">
        <h1 class="m-0 me-3 mb-2">🛒</h1>
        <h4 class= "m-0" > Detalles del carrito </h4>
        </div>
        <div class="p-3 border">
            ${cartItems.map((item, index) => {
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
                    <span class="text-end d-flex align-items-center w-min-xs text-dark">UYU $${item.price.toFixed(2)}</span>
                  </div>
                  <button class="btn btn" id="borrarElemento" onclick="borrarElemento(${index})">🗑️</button>
              </div>
            `;
    })
        // se puede completar la parte de costo de envío y total como está hecho en sub total
        .join("")}
                <div class=" d-flex justify-content-between border-top pt-3">
               <strong >Sub total</strong>
               <strong class="me-5 pe-1 " id="monto-subtotal">UYU $${subtotal.toFixed(2)}</strong>
               </div>
              <div class="d-flex justify-content-between border-top pt-3">
              <strong>Costo de envío</strong>
              <strong class="me-5 pe-1 shipping-cost" id="monto-shipping-cost">UYU $${shippingCost.toFixed(2)}</strong>
              </div>
              <div class="d-flex justify-content-between border-top pt-3">
              <strong>Total</strong>
              <strong class="me-5 pe-1 total" id="monto-total">UYU $${total.toFixed(2)}</strong>
              </div>
        </div>           
        `;
  }

  updateCosts();  // Actualiza los costos mostrados en la interfaz
});

// Función para actualizar la cantidad de un producto en el carrito
function updateQuantity(index, change) {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const item = cartItems[index];

  // Asegurarse de que la cantidad no sea menor a 1
  item.quantity = Math.max(1, item.quantity + change);

  // Guardar cambios y recargar el carrito
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  location.reload();
}

// Eliminación de productos del carrito

let productIndexToDelete = null; // Variable global para almacenar el índice del producto a eliminar

function borrarElemento(index) {
  // Mostrar el modal de confirmación
  productIndexToDelete = index; // Guardamos el índice del producto que se desea eliminar
  document.getElementById('confirmModal').style.display = 'flex';
}

// Función para confirmar la eliminación
document.getElementById('confirmDelete').addEventListener('click', function() {
  if (productIndexToDelete !== null) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    // Elimina el producto seleccionado
    cartItems.splice(productIndexToDelete, 1);
    // Guarda los cambios en localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    // Recargar la página para actualizar el carrito
    location.reload();
  }
});

// Función para cancelar la eliminación
document.getElementById('cancelDelete').addEventListener('click', function() {
  document.getElementById('confirmModal').style.display = 'none'; // Cierra el modal
});


// Función para calcular el subtotal
function calculateSubtotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Función para obtener el costo de envío según el tipo seleccionado
function getShippingCost() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const shippingRadios = document.querySelectorAll('input[name="shipping"]:checked');
  let shippingPercentage = 0;

  // Obtiene el porcentaje de envío seleccionado
  shippingRadios.forEach(radio => {
    shippingPercentage = parseFloat(radio.value);  // El valor es el porcentaje
  });

  const subtotal = calculateSubtotal(cartItems); // Calcula el subtotal actual
  return subtotal * (shippingPercentage / 100); // Calcula el costo de envío
}

// Función para actualizar los costos (subtotal, envío y total)
function updateCosts() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const subtotal = calculateSubtotal(cartItems);  // Calcula el subtotal
  const shippingCost = getShippingCost();  // Obtiene el costo de envío
  const total = subtotal + shippingCost;  // Total = Subtotal + Envío

  // Actualiza los valores en el HTML
  document.getElementById("monto-subtotal").innerText = `UYU $${subtotal.toFixed(2)}`;
  document.getElementById("monto-shipping-cost").innerText = `UYU $${shippingCost.toFixed(2)}`;
  document.getElementById("monto-total").innerText = `UYU $${total.toFixed(2)}`;
}

// Escuchar cambios en el tipo de envío
const shippingRadios = document.querySelectorAll('input[name="shipping"]');
shippingRadios.forEach(radio => {
  radio.addEventListener('change', updateCosts);
});

// Manejo de campos vacíos en la dirección
function obtenerCamposVacios() {
  const resultados = [];
  const camposIds = ["campo-departamento", "campo-localidad", "campo-calle", "campo-numero", "campo-esquina"];
  camposIds.forEach(id => {
    const valor = document.getElementById(id).value;
    if (!valor) resultados.push(id);
  });
  return resultados;
}

// Maneja el evento para finalizar la compra
function manejarEventoFinalizarCompra() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const botonFinalizarCompra = document.getElementById("finalizar-compra-btn");

  botonFinalizarCompra.addEventListener("click", () => {
    const camposVacios = obtenerCamposVacios();

    // Verifica si hay campos vacíos en la dirección
    if (camposVacios.length > 0) {
      manejarCamposVaciosDireccion(camposVacios);
      return;
    }

    const shippingRadiosChecked = document.querySelectorAll('input[name="shipping"]:checked');
    if (shippingRadiosChecked.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Debe seleccionar una forma de envío.",
      });
      return;
    }

    const invalidProducts = cartItems.length === 0 || (cartItems.some(item => item.quantity < 1));
    if (invalidProducts) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "La cantidad de productos en los carrito no es válida. Asegúrate de que haya al menos un producto en el carrito.",
      });
      return;
    }

    const isPaymentMethodSelected = document.querySelectorAll('input[name="tarjeta"]:checked').length > 0;
    if (!isPaymentMethodSelected) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Debes seleccionar un método de pago.",
      });
      return;
    }

    // Enviar carrito al backend antes de mostrar el mensaje de éxito
    fetch("http://localhost:3000/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Asegúrate de que el token de autorización esté en los headers si lo necesitas
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        userId: "usuario@mail.com", // Debes ajustar esto según el usuario actual
        cartItems: cartItems,
        shippingCost: getShippingCost(),
        total: calculateSubtotal(cartItems) + getShippingCost()
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Error al guardar el carrito.");
      }
      return response.json();
    })

    Swal.fire({
      icon: "success",
      title: "Gracias por su compra",
      text: "La compra se ha realizado correctamente.",
    });

    // Limpiar campos de dirección, métodos de pago y carrito
    document.getElementById("campo-localidad").value = "";
    document.getElementById("campo-calle").value = "";
    document.getElementById("campo-numero").value = "";
    document.getElementById("campo-esquina").value = "";
    document.getElementById("campo-departamento").value = "";

    // Eliminar el carrito de localStorage
    const carrito = document.getElementById("carrito");
    const mensaje = document.getElementById("mensaje");
    carrito.innerHTML = ""; // Limpiar el DOM del carrito
    mensaje.textContent = "No hay productos en el carrito!";

    document.querySelectorAll('input[name="tarjeta"]:checked').forEach(input => input.checked = false);
    document.querySelectorAll('input[name="shipping"]:checked').forEach(input => input.checked = false);
    localStorage.removeItem("cartItems");

    // Redirigir al index después de un pequeño retraso
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2600);
  });
}

function manejarCamposVaciosDireccion(camposVacios) {
  const textos = {
    "campo-departamento": "'Departamento'",
    "campo-localidad": "'Localidad'",
    "campo-calle": "'Calle'",
    "campo-numero": "'Numero'",
    "campo-esquina": "'Esquina'"
  };
  let camposVaciosTexto = "";
  camposVacios.forEach(id => {
    const texto = textos[id];
    camposVaciosTexto += texto + " ";
  });
  const alerta = camposVacios.length == 1 ? "El campo " + camposVaciosTexto + "debe ser completado para finalizar la compra." :
    "Los campos " + camposVaciosTexto + "deben ser completados para finalizar la compra.";

  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: alerta,
  });
  return;
}


//////// Slider /////////////


let currentSlide = 0;
const totalSlides = 3;
function showSlide(n) {
  const slides = document.querySelectorAll('.slide');

  slides[currentSlide].classList.remove('active');
  slides[currentSlide].setAttribute('hidden', true);

  currentSlide = (n + totalSlides) % totalSlides;

  slides[currentSlide].classList.add('active');
  slides[currentSlide].removeAttribute('hidden');

  updateCounter();
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}

function updateCounter() {
  const titulosContador = {
      0: "Dirección",
      1: "Tipo de envío",
      2: "Método de pago",
  };

  // Actualiza el texto del contador
  document.getElementById('slideCounter').textContent = `${currentSlide + 1}/${totalSlides} ${titulosContador[currentSlide]}`;

  // Actualiza la barra de progreso
  const progressBar = document.getElementById('progressBar'); // Selecciona la barra de progreso
  const progressPercentage = ((currentSlide + 1) / totalSlides) * 100; // Calcula el porcentaje
  progressBar.style.width = `${progressPercentage}%`; // Ajusta el ancho de la barra
}


document.addEventListener('DOMContentLoaded', function () {
  updateCounter();

  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.attributeName === 'class') {
        const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));
        const popovers = document.querySelectorAll('[data-bs-toggle="popover"]');
        popovers.forEach(popover => new bootstrap.Popover(popover));
      }
    });
  });
  document.querySelectorAll('.slide').forEach(function (slide) {
    observer.observe(slide, { attributes: true });
  });
});
