$(function() {

});

async function iniciarSesion() {
    const username = $("#usernameLogin").val();
    const password = $("#passLogin").val();

    const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    console.log(data);
}

async function registrarse() {
    const username = $("#usernameRegister").val();
    const email = $("#emailRegister").val();
    const password = $("#passRegister").val();

    console.log(username, email, password)

    const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();
    console.log(data);
}

async function obtenerUsuario(username) {
    const response = await fetch(`/api/users/${username}`);
    const data = await response.json();
    console.log(data);
}

function girarTarjeta() {
    document.getElementById("flipCard").classList.toggle("girada");
}

window.iniciarSesion = iniciarSesion;
window.registrarse = registrarse;
window.girarTarjeta = girarTarjeta;