let fotoDePerfil = null;


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


document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes("my-profile.html")) {
        verificarLogin();
        cargarDatosMyProfile();
    }
});

function cargarDatosMyProfile() {
    const userEmail = localStorage.getItem('session');
    const myProfileDataJson = localStorage.getItem('MyProfileData-' + userEmail);
    const myProfileDataFotoDePerfil = localStorage.getItem('MyProfileData-FotoDePerfil-' + userEmail);
    
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

    if (myProfileData.nightMode) {
        body.classList.add('night-mode');
        document.getElementById('mode-switch').checked = true;
    }

    if (myProfileDataFotoDePerfil) {
        document.getElementById('fotoPreview').style.backgroundImage = `url(${myProfileDataFotoDePerfil})`; // Mostrar la imagen almacenada
    }
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

function setFotoPerfil(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            fotoDePerfil = e.target.result;
            document.getElementById('fotoPreview').style.backgroundImage = `url(${fotoDePerfil})`;
        };
        reader.readAsDataURL(file);
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
    const nightMode = document.getElementById('mode-switch').checked;

    if (!nombre || !apellido || !email) {
        document.getElementById("errorMsg").style.display = "block";
        return;
    }

    const myProfileData = {
        email,
        nombre,
        segundoNombre,
        apellido,
        segundoApellido,
        telefono,
        fotoPreview,
        nightMode,
    };

    localStorage.setItem('nightMode', nightMode);
    localStorage.setItem('MyProfileData-' + email, JSON.stringify(myProfileData));
    localStorage.setItem('MyProfileData-FotoDePerfil-' + email, fotoDePerfil);
    

    document.getElementById("errorMsg").style.display = "none";
    alert("Cambios guardados correctamente.");
}
