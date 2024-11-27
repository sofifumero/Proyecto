/* Agrega un evento al formulario de registro para manejar su envío*/
document.getElementById('registrationForm').addEventListener('submit', function (event) {
  event.preventDefault(); /* Evita el comportamiento predeterminado del formulario (recargar la página)*/

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  /* Expresión regular para validar el correo electrónico*/
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailPattern.test(username) && password) {
    const loginUrl = "http://localhost:3000/login";
    const body = {
      username,
      password,
    };
    fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(response => {
        console.log(response);
        if (response.status != 200) {
          throw new Error("Invalid Login");
        }

        return response;
      })
      .then(response => response.json())
      .then(data => {
        console.log('datalogin', data);
        localStorage.setItem('session', username);
        localStorage.setItem('token', data?.token);
        window.location.href = 'index.html';
      })
      .catch(error => {
        Swal.fire({
          icon: "error",
          title: "Error de login",
          text: "Por favor, verifica tus credenciales.",
        });
      });
  } else {
    alert('Por favor, introduce un correo electrónico válido.');
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
