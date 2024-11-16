document.addEventListener("DOMContentLoaded", () => {
  manejarEventoFinalizarCompra();

  const carrito = document.getElementById("carrito");
  const mensaje = document.getElementById("mensaje");
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  carrito.innerHTML = "";
  mensaje.innerHTML = "";

  if (cartItems.lenght === 0) {
    mensaje.textContent = "No hay productos en el carrito!";
  } else {
    const subtotal = calculateSubtotal(cartItems);  // Calcula el subtotal
    const shippingCost = getShippingCost();  // Obtiene el costo de envío
    const total = subtotal + shippingCost;
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
                  <button class="btn btn" onclick="borrarElemento(${index})">🗑️</button>
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

  updateCosts();
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


// Función para calcular el subtotal
function calculateSubtotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Función para obtener el costo de envío según el tipo seleccionado
function getShippingCost() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const shippingRadios = document.querySelectorAll('input[name="shipping"]:checked');
  let shippingPercentage = 0;

  shippingRadios.forEach(radio => {
    shippingPercentage = parseFloat(radio.value);  // El valor es el porcentaje
  });

  const subtotal = calculateSubtotal(cartItems);
  return subtotal * (shippingPercentage / 100);
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

function obtenerCamposVacios() {
  const resultados = [];
  const camposIds = ["campo-departamento", "campo-localidad", "campo-calle", "campo-numero", "campo-esquina"];
  camposIds.forEach(id => {
    const valor = document.getElementById(id).value;
    if (!valor) resultados.push(id);
  });
  return resultados;
}

function manejarEventoFinalizarCompra() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const botonFinalizarCompra = document.getElementById("finalizar-compra-btn");

  botonFinalizarCompra.addEventListener("click", () => {
    const camposVacios = obtenerCamposVacios();

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
        text: "La cantidad de productos en los carrito no es válida. Asegúrate de que haya al menos un produto en el carrito.",
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

    Swal.fire({
      icon: "success",
      title: "Gracias por su compra",
      text: "La compra se ha realizado correctamente.",
    });
// cuando se clickea el boton de finalizar compra se elminan los datos de envio , metodo de pago y tipo de envio 
  // tambien se borra el carrito y te redirige al index

   document.getElementById("campo-localidad").value = "";
   document.getElementById("campo-calle").value = "";
   document.getElementById("campo-numero").value = "";
   document.getElementById("campo-esquina").value = "";
   document.getElementById("campo-departamento").value = "";

   document.querySelectorAll('input[name="tarjeta"]:checked').forEach(input => input.checked = false);
   document.querySelectorAll('input[name="shipping"]:checked').forEach(input => input.checked = false);
   localStorage.removeItem("cartItems"); 
   // Eliminar el carrito de localStorage
    const carrito = document.getElementById("carrito");
    carrito.innerHTML = ""; // Limpiar el DOM del carrito
    mensaje.textContent = "No hay productos en el carrito!";

     // Redirigir al index después de un pequeño retraso
     setTimeout(() => {
      window.location.href = "index.html";
  }, 2600);
  })
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
  document.getElementById('slideCounter').textContent = `${currentSlide + 1}/${totalSlides} ${titulosContador[currentSlide]}`;
  // document.getElementById('slideCounter').textContent = titulosContador[currentSlide];
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

document.addEventListener('DOMContentLoaded', function () {
  const demoComponents = document.querySelectorAll('.demo-section');
  demoComponents.forEach(function (component) {
    component.addEventListener('click', function (event) {
      event.stopPropagation();
    });
  });
});

