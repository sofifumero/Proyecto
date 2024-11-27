const CATEGORIES_URL = "http://localhost:3000/cats";
const PUBLISH_PRODUCT_URL = "http://localhost:3000/sell/publish";
const PRODUCTS_URL = "http://localhost:3000/cats_products/";
const PRODUCT_INFO_URL = "http://localhost:3000/products/";
const PRODUCT_INFO_COMMENTS_URL = "http://localhost:3000/products_comments/";
const PRODUCT_INFO_DETAIL_URL = "http://localhost:3000/products/{productId}";
const CART_INFO_URL = "http://localhost:3000/user_cart/";
const CART_BUY_URL = "http://localhost:3000/cart/buy";
const EXT_TYPE = ".json";

/*Muestra el spinner (indicador de carga) en la página*/
let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block"; /*Hace visible el elemento del spinner*/
}

/*Oculta el spinner de la página*/
let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
}

/*Realiza una solicitud GET a una URL y devuelve los datos en formato JSON*/
let getJSONData = function (url) {
  const token = getToken();
  let result = {}; //Objeto donde se almacenará el resultado
  showSpinner(); // Muestra el spinner mientras se realiza la solicitud

  return fetch(url, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then(response => {
      if (response.ok) {
        return response.json(); // Si la respuesta es exitosa, la convierte en JSON
      } else {
        throw Error(response.statusText); // Si hay un error, lanza un mensaje con el error
      }
    })
    .then(function (response) {
      result.status = 'ok'; // Marca el estado como exitoso
      result.data = response; // Guarda los datos obtenidos
      hideSpinner(); // Oculta el spinner
      return result; // Retorna el resultado exitoso
    })
    .catch(function (error) {
      result.status = 'error'; // Marca el estado como error
      result.data = error; // Guarda la información del error
      hideSpinner();
      return result; // Retorna el resultado con el error
    });
}

// Evento que se ejecuta cuando el contenido del DOM está completamente cargado
document.addEventListener("DOMContentLoaded", function () {
  // Obtiene el estado de la sesión y el token desde el localStorage
  const session = localStorage.getItem('session');
  const token = localStorage.getItem('token');

  // Si no hay sesión activa o token, redirige al usuario a la página de login
  if (!session || !token) {
    window.location.href = 'login.html';
  } else {
    contadorProductos(); // Actualiza la notificación de la cantidad de productos en el carrito

    // Configura el botón de cerrar sesión
    const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');
    btnCerrarSesion.onclick = () => {
      // Limpia la sesión y otros datos del localStorage y redirige al login
      localStorage.setItem('session', '');
      localStorage.setItem('token', '');
      localStorage.setItem('nightMode', 'false');
      window.location.href = 'login.html';
    };

    // Comprueba si el modo oscuro estaba activado y lo aplica
    const myProfileDataJson = localStorage.getItem('MyProfileData-' + session);
    if (myProfileDataJson && JSON.parse(myProfileDataJson).nightMode) {
      document.body.classList.add('night-mode');
    }

    // Muestra el nombre del usuario en la barra de navegación si el elemento existe
    const usuarioElem = document.getElementById("app-nav-bar-usuario")
    if (usuarioElem) {
      usuarioElem.innerText = session;
    }
  }
});

// Función para contar los productos en el carrito y mostrar una notificación
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

  // Si hay productos en el carrito, actualiza la insignia, de lo contrario, la oculta
  if (userNameBadge && totalProductos > 0) {
    userNameBadge.textContent = totalProductos;
    userNameBadge.classList.remove("d-none");
  } else {
    userNameBadge.classList.add("d-none");
  }
}

function getToken() {
  const token = localStorage.getItem('token');
  return token;
}