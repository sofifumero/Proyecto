const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const PRODUCT_INFO_DETAIL_URL = "https://japceibal.github.io/emercado-api/products/{productId}.json";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function (url) {
  let result = {};
  showSpinner();
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = 'ok';
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const session = localStorage.getItem('session');
  if (!session) {
    window.location.href = 'login.html';
  } else {
    contadorProductos();

    const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');
    btnCerrarSesion.onclick = () => {
      localStorage.setItem('session', '');
      localStorage.setItem('nightMode', 'false');
      window.location.href = 'login.html';
    };

    const myProfileDataJson = localStorage.getItem('MyProfileData-' + session);
    if (myProfileDataJson && JSON.parse(myProfileDataJson).nightMode) {
      body.classList.add('night-mode');
    }

    const usuarioElem = document.getElementById("app-nav-bar-usuario")
    if (usuarioElem) {
      usuarioElem.innerText = session;
    }
  }
});

function contadorProductos() {
  // Obtiene los artículos del carrito desde el localStorage. Si no hay, se asigna un arreglo vacío.
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  // Calcula el total de productos en el carrito sumando la cantidad de cada artículo.
  const totalProductos = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Busca el elemento de la interfaz de usuario donde se mostrará la notificación del total de productos.
  const notificacion = document.getElementById("notificacion");
  const userNameBadge = document.getElementById("app-user-name-badge");


  // Si el elemento de notificación existe en el DOM, actualiza su contenido y visibilidad.
  if (notificacion) {
    // Establece el texto de la notificación con el total de productos.
    notificacion.textContent = totalProductos;
  }

  if (userNameBadge && totalProductos > 0) {
    userNameBadge.textContent = totalProductos;
    userNameBadge.classList.remove("d-none");
  } else {
    userNameBadge.classList.add("d-none");
  }
}