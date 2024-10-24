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