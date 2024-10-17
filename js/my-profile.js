function verificarLogin() {
    const username = localStorage.getItem('session');
    if (!username) {
        window.location.href = "login.html";
    } else {
        const emailInput = document.getElementById('email');
        emailInput.value = username;
    }
}
window.onload = function () {
    if (window.location.pathname.includes("my-profile.html")) {
        verificarLogin();
        cargarFotoPerfil(); // Cargar la foto de perfil al cargar la página
    }
};

function cambiarFotoPerfil(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const fotoPerfil = e.target.result;
            document.getElementById('fotoPreview').style.backgroundImage = `url(${fotoPerfil})`;
            localStorage.setItem('fotoPerfil', fotoPerfil); // Almacenar la imagen en localStorage
        };
        reader.readAsDataURL(file);
    }
}

function cargarFotoPerfil() {
    const fotoPerfil = localStorage.getItem('fotoPerfil');
    if (fotoPerfil) {
        document.getElementById('fotoPreview').style.backgroundImage = `url(${fotoPerfil})`; // Mostrar la imagen almacenada
    }
}

function guardarCambios() {
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const email = document.getElementById("email").value;
    const imagen = document.getElementById("fotoPreview");

    if (!nombre || !apellido || !email) {
        document.getElementById("errorMsg").style.display = "block";
        return;
    }

    localStorage.setItem("nombre", nombre);
    localStorage.setItem("segundoNombre", document.getElementById("segundoNombre").value);
    localStorage.setItem("apellido", apellido);
    localStorage.setItem("segundoApellido", document.getElementById("segundoApellido").value);
    localStorage.setItem("telefono", document.getElementById("telefono").value);
    localStorage.setItem("imagen", document.getElementById("fotoPreview"));

    document.getElementById("errorMsg").style.display = "none";
    alert("Cambios guardados correctamente.");
}

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
