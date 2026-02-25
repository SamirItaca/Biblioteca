import { mensajeAlert } from './app.js'

$(function() {
    // Opcional: limpiar mensajes al cargar
});

async function iniciarSesion() {
    const username = $("#usernameLogin").val().trim();
    const password = $("#passLogin").val().trim();

    if (!username || !password) {
        mensajeAlert("No ha ingresado información", "danger");
        return;
    }

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            mensajeAlert(data.message || "Error al iniciar sesión", "danger");
            return;
        }

        localStorage.setItem("username", username);
        mensajeAlert("Inicio de sesión exitoso", "success");

        setTimeout(() => {
            window.location.href = '/biblioteca';
        }, 1000);

    } catch (error) {
        mensajeAlert("Error del servidor", "danger");
        console.error(error);
    }
}

async function registrarse() {
    const username = $("#usernameRegister").val().trim();
    const email = $("#emailRegister").val().trim();
    const password = $("#passRegister").val().trim();

    if (!username || !email || !password) {
        mensajeAlert("Debe completar todos los campos", "danger");
        return;
    }

    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            mensajeAlert(data.message || "Error al registrarse", "danger");
            return;
        }

        mensajeAlert("Registro exitoso. Ahora puedes iniciar sesión", "success");

        setTimeout(() => {
            girarTarjeta();
        }, 1000);

    } catch (error) {
        mensajeAlert("Error del servidor", "danger");
        console.error(error);
    }
}

function girarTarjeta() {
    document.getElementById("flipCard").classList.toggle("girada");
}

window.iniciarSesion = iniciarSesion;
window.registrarse = registrarse;
window.girarTarjeta = girarTarjeta;