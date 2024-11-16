const FIXERIO_API_KEY = '9363d463ad31e9b3da99a180abbc2b1d';
const FIXERIO_TARGET_CURRENCY = 'USD,UYU';
const DEFAULT_USD_EXCHANGE = 40;
const FIXERIO_URL = `http://data.fixer.io/api/latest?access_key=${FIXERIO_API_KEY}&symbols=${FIXERIO_TARGET_CURRENCY}`;




let currentProduct = [];
let currentComment = [];
const body = document.body;
/*Definicion de modo switch*/
const modeSwitch = document.getElementById('mode-switch');

/* Verificación del almacenamiento local:*/
if (localStorage.getItem('nightMode') === 'true') {
  body.classList.add('night-mode');
  modeSwitch.checked = true;
}
/*Escucha de cambios en el interruptor */
modeSwitch.addEventListener('change', () => {
  body.classList.toggle('night-mode', modeSwitch.checked);
  localStorage.setItem('nightMode', modeSwitch.checked);
});

function showProductInfo(prod) {
  // Cargo la información de producto  
  let product = prod;
  let htmlContent = `      
      <div>
          <h2 class="catprod">${prod.category}</h2>
      </div>      
      <div class="contenedor-de-producto">
          <div class="row">
              <div class="col-2" style="width: 50%; float: left;">
                  <img src="${prod.images[0]}" width="100%" id="ProductImg" class="imgprin">
                  <div class="small-img-row">
                      ${prod.images.map((img, index) => `
                        <div class="small-img-col">
                            <img src="${img}" width="100%" class="small-img">
                        </div>
                      `).join('')}
                  </div>
              </div>
              <div class="col-2" style="width: 50%; float: left;">
                  <div class="contenedor-info">
                      <h1 class="nameprod">${prod.name}</h1>
                      <h3 class="priceprod">Precio ${prod.currency} ${product.cost}</h3>
                      <h4 class="souldprod">Cantidad de vendidos: ${prod.soldCount}</h4>
                      <h4 class="descprod">Descripción</h4>
                      <p class="descprod">${prod.description}</p>
                      <input type="button" value="Comprar Ahora" class="botoncomprar" id="buy-now-button">
                      <input type="button" value="Agregar al Carrito" class="botoncomprar" id="add-to-cart-button">
                      <div id="notification" class="notification" style="display: none;">
                          <i class="fas fa-shopping-cart"></i>
                          <span id="notification-message"></span>
                      </div>
                  </div>
              </div>
          </div>
      </div>`;

  document.getElementById("product_info").innerHTML = htmlContent;

  // Lógica para cambiar la imagen principal
  const ProductImg = document.getElementById("ProductImg");
  const SmallImg = document.getElementsByClassName("small-img");
  for (let i = 0; i < SmallImg.length; i++) {
    SmallImg[i].onclick = function () {
      ProductImg.src = SmallImg[i].src;
    };
  }

  async function addToCart(producto, navigateToCart = false) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Verifica si el producto ya está en el carrito
    const existingItemIndex = cartItems.findIndex(item => item.id === producto.id);

    if (existingItemIndex !== -1) {
      // Si existe, actualiza la cantidad
      cartItems[existingItemIndex].quantity += producto.quantity;
    } else {
      // Si no existe, añade el nuevo producto
      if (producto.currency === "USD") {
        producto.price = await obtenerPrecioProductoEnPesos(producto.price);
      }
      cartItems.push(producto);
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    contadorProductos();

    if (navigateToCart) {
      window.location.href = 'cart.html';
    } else {
      showNotification('Producto agregado al carrito. ¡Puedes seguir comprando!');
    }
  }

  // Función para mostrar notificación
  function showNotification(message) {
    const notification = document.getElementById("notification");
    const notificationMessage = document.getElementById("notification-message");
    notificationMessage.innerHTML = message;
    notification.style.display = 'flex'; // Asegúrate de que el contenedor sea visible
    notification.style.opacity = 1;

    // Ocultar notificación después de 3 segundos
    setTimeout(() => {
      notification.style.opacity = 0;
      setTimeout(() => {
        notification.style.display = 'none';
      }, 500); // Espera a que la transición de opacidad termine
    }, 3000); // 3 segundos
  }

  // Lógica para el botón "Comprar Ahora"
  document.getElementById("buy-now-button").addEventListener('click', function () {
    const producto = {
      id: product.id,
      name: product.name,
      price: product.cost,
      currency: product.currency,
      image: prod.images[0],
      quantity: 1
    };
    addToCart(producto, true);
  });

  // Lógica para el botón "Agregar al Carrito"
  document.getElementById("add-to-cart-button").addEventListener('click', function () {
    const producto = {
      id: product.id,
      name: product.name,
      price: product.cost,
      currency: product.currency,
      image: prod.images[0],
      quantity: 1
    };
    addToCart(producto);
  });
}

function showProductComments() {
  let htmlContent = `<div class="comentario-box-container">`; // Contenedor para todos los comentarios
  for (let i = 0; i < currentComment.length; i++) {
    let comment = currentComment[i];
    htmlContent += `
      <div class="box">
        <div class="box-top">
          <div class="perfil">
            <div class="username">
              <h4>${comment.user}</h4>
            </div>
          </div>
          <div class="calificacion">
            ${generateStars(comment.score)}
          </div>
        </div>
        <div class="review">
          <p>${comment.description}</p>
        </div>
        <div class="fecha">
          <h4>${comment.dateTime}</h4>
        </div>
      </div>
    `;
  }
  htmlContent += `</div>`; // Cierra el contenedor
  document.getElementById("product-comment").innerHTML = htmlContent;

  function generateStars(score) {
    let stars = "";
    for (let i = 0; i < 5; i++) {
      if (i < score) {
        stars += '<i class="fas fa-star"></i>';
      } else {
        stars += '<i class="far fa-star"></i>';
      }
    }
    return stars;
  }
}

function cargarProductosRelacionados(productosRelacionados) {
  const container = document.getElementById('product-cards');

  productosRelacionados.forEach(product => {
    const columna = document.createElement('div');
    columna.className = 'col-md-3';

    const tarjeta = document.createElement('div');
    tarjeta.className = 'card mb-2 cursor-pointer';

    tarjeta.onclick = () => {
      localStorage.setItem("prodID", product.id);
      window.location.href = 'product-info.html';
    };

    const imagen = document.createElement('img');
    imagen.src = product.image;
    imagen.className = 'card-img-top';
    imagen.alt = product.name;

    const cuarpoTarjeta = document.createElement('div');
    cuarpoTarjeta.className = 'card-body';

    const tituloTarjeta = document.createElement('h5');
    tituloTarjeta.className = 'card-title';
    tituloTarjeta.textContent = product.name;

    cuarpoTarjeta.appendChild(tituloTarjeta);
    tarjeta.appendChild(imagen);
    tarjeta.appendChild(cuarpoTarjeta);
    columna.appendChild(tarjeta);
    container.appendChild(columna);
  });
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
  getJSONData(PRODUCT_INFO_URL + localStorage.getItem('prodID') + '.json').then(function (resultObj) {
    if (resultObj.status === "ok") {
      currentProduct = resultObj.data
      showProductInfo(currentProduct);
    }
  });

});
document.addEventListener("DOMContentLoaded", function (e) {
  getJSONData(PRODUCT_INFO_COMMENTS_URL + localStorage.getItem('prodID') + '.json').then(function (resultObj) {
    if (resultObj.status === "ok") {
      currentComment = resultObj.data
      showProductComments(currentComment);
    }
  });

});

// Cargar detalle de producto
document.addEventListener("DOMContentLoaded", function (e) {
  const url = PRODUCT_INFO_DETAIL_URL.replace('{productId}', localStorage.getItem('prodID'));
  getJSONData(url)
    .then(function (resultObj) {
      if (resultObj.status === "ok") {
        cargarProductosRelacionados(resultObj.data.relatedProducts);
      }
    });
});

document.addEventListener('DOMContentLoaded', () => {
  // Agregar evento al botón de enviar
  document.getElementById('env').addEventListener('click', function (event) {
    event.preventDefault();  // Evita el envío real del formulario

    // Capturar los valores del formulario
    const review = document.getElementById('review-text').value;
    const rating = document.querySelector('input[name="rate"]:checked') ? document.querySelector('input[name="rate"]:checked').value : 0;

    // Crear nuevo comentario en HTML
    const commentBox = `
          <div class="box">
              <div class="box-top">
                  <div class="perfil">
                      <div class="username">
                          <h4>${document.getElementById('username').textContent}</h4>
                      </div>
                  </div>
                  <div class="calificacion">
                      ${generateStars(rating)}
                  </div>
              </div>
              <div class="review">
                  <p>${review}</p>
              </div>
              <div class="fecha">
                  <h4>${document.getElementById('date').textContent}</h4>
              </div>
          </div>
      `;

    // Agregar el nuevo comentario a la lista de comentarios
    document.querySelector('.comentario-box-container').innerHTML += commentBox;

    // Limpiar el formulario
    document.getElementById('review-text').value = '';
    document.querySelector('input[name="rate"]:checked').checked = false;
  });
});

// Añadir estrellas
function generateStars(rating) {
  let starsHTML = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      starsHTML += '<i class="fas fa-star"></i>';
    } else {
      starsHTML += '<i class="far fa-star"></i>';
    }
  }
  return starsHTML;
}


async function obtenerPrecioProductoEnPesos(precioEnDolares) {
  try {
    const response = await fetch(FIXERIO_URL);
    const data = await response.json();

    if (data.success) {
      const rateEurToUsd = data.rates['USD'];
      const rateEurToUyu = data.rates['UYU'];

      // Calculate USD to UYU
      const rateUsdToUyu = rateEurToUyu / rateEurToUsd;
      console.log(`FIXER.IO RESPONSE - 1 USD es igual a ${rateUsdToUyu} UYU`);
      return precioEnDolares * rateUsdToUyu;
    } else {
      console.error('Error obteniendo datos de Fixer.io', data);
      return precioEnDolares * DEFAULT_USD_EXCHANGE;
    }
  } catch (error) {
    console.error('Error obteniendo datos de Fixer.io:', error);
    return precioEnDolares * DEFAULT_USD_EXCHANGE;
  }
}
