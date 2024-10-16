


// Cambiar la foto de perfil
function cambiarFotoPerfil(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('fotoPreview').style.backgroundImage = `url(${e.target.result})`;
        };
        reader.readAsDataURL(file);
    }
}


// Guardar cambios en almacenamiento local
function guardarCambios() {
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const email = document.getElementById("email").value;


    // Validar que los campos obligatorios estén completos
    if (!nombre || !apellido || !email) {
        document.getElementById("errorMsg").style.display = "block";
        return;
    }


    // Guardar datos en localStorage
    localStorage.setItem("nombre", nombre);
    localStorage.setItem("segundoNombre", document.getElementById("segundoNombre").value);
    localStorage.setItem("apellido", apellido);
    localStorage.setItem("segundoApellido", document.getElementById("segundoApellido").value);
    localStorage.setItem("telefono", document.getElementById("telefono").value);


    document.getElementById("errorMsg").style.display = "none";
    alert("Cambios guardados correctamente.");
}




