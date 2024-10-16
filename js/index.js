document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("autos").addEventListener("click", function () {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function () {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function () {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });

    const session = localStorage.getItem('session');
    if (!session) {
        window.location.href = 'login.html';
    }
});
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
