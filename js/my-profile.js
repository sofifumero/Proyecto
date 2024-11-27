/* Variable para almacenar temporalmente la foto de perfil cargada por el usuario*/
let fotoDePerfil = null;

/*Referencia al elemento <body> para aplicar clases como night-mode*/
const body = document.body;
/*Definicion de modo switch*/
const modeSwitch = document.getElementById('mode-switch');

/* Verificación del almacenamiento local: Si el modo oscuro está activado, 
   aplica la clase 'night-mode' al body y activa el interruptor */
if (localStorage.getItem('nightMode') === 'true') {
    body.classList.add('night-mode');
    modeSwitch.checked = true;
}
/* Escucha de cambios en el interruptor del modo oscuro */
modeSwitch.addEventListener('change', () => {
    body.classList.toggle('night-mode', modeSwitch.checked);
    // Guarda el estado actual del modo oscuro en el almacenamiento local
    localStorage.setItem('nightMode', modeSwitch.checked);
});

/*Evento que se ejecuta cuando la página se carga completamente*/
document.addEventListener('DOMContentLoaded', () => {
    // Verifica si estamos en la página 'my-profile.html'
    if (window.location.pathname.includes("my-profile.html")) {
        verificarLogin(); /* Comprueba si el usuario está logueado*/
        cargarDatosMyProfile(); /*Carga los datos del perfil del usuario*/
    }
    });

/* Función para cargar los datos del perfil del usuario desde localStorage */
function cargarDatosMyProfile() {
     /* Obtiene el correo del usuario de la sesión activa*/
    const userEmail = localStorage.getItem('session');
    /*Obtiene los datos del perfil y la foto de perfil del usuario*/
    const myProfileDataJson = localStorage.getItem('MyProfileData-' + userEmail);
    const myProfileDataFotoDePerfil = localStorage.getItem('MyProfileData-FotoDePerfil-' + userEmail);

    /*Si no hay datos guardados, termina la ejecución*/
    if (!myProfileDataJson) {
        return;
    }

    /*Convierte los datos JSON en un objeto JavaScript*/
    const myProfileData = JSON.parse(myProfileDataJson);
    /*Asigna los valores del perfil a los campos correspondientes en la página*/
    document.getElementById("nombre").value = myProfileData.nombre;
    document.getElementById("apellido").value = myProfileData.apellido;
    document.getElementById("email").value = myProfileData.email;
    document.getElementById("segundoNombre").value = myProfileData.segundoNombre;
    document.getElementById("segundoApellido").value = myProfileData.segundoApellido;
    document.getElementById("telefono").value = myProfileData.telefono;
    document.getElementById("fotoPreview").value = myProfileData.fotoPreview;

    /*Si el modo oscuro estaba activado, lo aplica y marca el interruptor*/
    if (myProfileData.nightMode) {
        body.classList.add('night-mode');
        document.getElementById('mode-switch').checked = true;
    }
   /* Si existe una foto de perfil guardada, la muestra en el elemento fotoPreview*/
    if (myProfileDataFotoDePerfil) {
        document.getElementById('fotoPreview').style.backgroundImage = `url(${myProfileDataFotoDePerfil})`; // Mostrar la imagen almacenada
    }
}

/* Función para verificar si el usuario está logueado */
function verificarLogin() {
      /* Obtiene el nombre de usuario de la sesión activa*/
    const username = localStorage.getItem('session');
    /* Si no hay sesión activa, redirige al usuario a la página de login*/
    if (!username) {
        window.location.href = "login.html";
    } else {
         /*Si hay sesión, muestra el correo del usuario en el campo 'email'*/
        const emailInput = document.getElementById('email');
        emailInput.value = username;
    }
}

/* Función para cargar una foto de perfil seleccionada por el usuario */
function setFotoPerfil(event) {
    // Obtiene el archivo seleccionado por el usuario
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        /*Evento que se ejecuta cuando el archivo es leído completamente*/
        reader.onload = function (e) {
            fotoDePerfil = e.target.result;
            //*Muestra la imagen cargada en el elemento fotoPreview*/
            document.getElementById('fotoPreview').style.backgroundImage = `url(${fotoDePerfil})`;
        };
        reader.readAsDataURL(file); /*Lee el archivo como una URL base64*/
    }
}

/* Función para guardar los cambios realizados en el perfil */
function guardarCambios() {
     /* Obtiene los valores ingresados por el usuario en los campos del formulario*/
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const email = document.getElementById("email").value;
    const segundoNombre = document.getElementById("segundoNombre").value;
    const segundoApellido = document.getElementById("segundoApellido").value;
    const telefono = document.getElementById("telefono").value;
    const fotoPreview = document.getElementById("fotoPreview").value;
    const nightMode = document.getElementById('mode-switch').checked;

    /* Valida que los campos obligatorios no estén vacíos*/
    if (!nombre || !apellido || !email) {
        document.getElementById("errorMsg").style.display = "block";
        return;
    }

    /*Crea un objeto con los datos del perfil*/
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

    /*Guarda los datos del perfil y la foto de perfil en el almacenamiento local*/
    localStorage.setItem('nightMode', nightMode);
    localStorage.setItem('MyProfileData-' + email, JSON.stringify(myProfileData));
    localStorage.setItem('MyProfileData-FotoDePerfil-' + email, fotoDePerfil);

    /*Oculta el mensaje de error y muestra una alerta de éxito*/
    document.getElementById("errorMsg").style.display = "none";
    alert("Cambios guardados correctamente.");
}
