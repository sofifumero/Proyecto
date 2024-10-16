document.getElementById('registrationForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username && password) {
    localStorage.setItem('session', username);
    window.location.href = 'index.html';
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
