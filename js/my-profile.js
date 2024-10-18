
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes("my-profile.html")) {
        verificarLogin();
        cargarFotoPerfil(); // Cargar la foto de perfil al cargar la página
        cargarDatosMyProfile();
    }
});

function cargarDatosMyProfile() {
    const userEmail = localStorage.getItem('session');
    const myProfileDataJson = localStorage.getItem('MyProfileData-' + userEmail);
    
    if (!myProfileDataJson) {
        return;
    }

    const myProfileData = JSON.parse(myProfileDataJson);
    document.getElementById("nombre").value = myProfileData.nombre;
    document.getElementById("apellido").value = myProfileData.apellido;
    document.getElementById("email").value = myProfileData.email;
    document.getElementById("segundoNombre").value = myProfileData.segundoNombre;
    document.getElementById("segundoApellido").value = myProfileData.segundoApellido;
    document.getElementById("telefono").value = myProfileData.telefono;
    document.getElementById("fotoPreview").value = myProfileData.fotoPreview;
}

function verificarLogin() {
    const username = localStorage.getItem('session');
    if (!username) {
        window.location.href = "login.html";
    } else {
        const emailInput = document.getElementById('email');
        emailInput.value = username;
    }
}

function cambiarFotoPerfil(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
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
    const segundoNombre = document.getElementById("segundoNombre").value;
    const segundoApellido = document.getElementById("segundoApellido").value;
    const telefono = document.getElementById("telefono").value;
    const fotoPreview = document.getElementById("fotoPreview").value;

    if (!nombre || !apellido || !email) {
        document.getElementById("errorMsg").style.display = "block";
        return;
    }

    // localStorage.setItem("nombre", nombre);
    // localStorage.setItem("segundoNombre", segundoNombre);
    // localStorage.setItem("apellido", apellido);
    // localStorage.setItem("segundoApellido", segundoApellido);
    // localStorage.setItem("telefono", telefono);
    // localStorage.setItem("imagen", fotoPreview);

    const myProfileData = {
        email,
        nombre,
        segundoNombre,
        apellido,
        segundoApellido,
        telefono,
        fotoPreview
    };

    localStorage.setItem('MyProfileData-' + email, JSON.stringify(myProfileData));

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
