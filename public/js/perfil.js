import { mensajeAlert, obtenerUsuario } from './app.js'

let user;

$(async function() {

    // Obtener usuario logueado
    user = await getUser();

    if (!user) return;

    // Guardar el total de libros guardados
    let totalLibros = 0;
    if (user.libros_guardados.length > 0) {
        totalLibros = user.libros_guardados.length;
    }

    $("#titulo").text(user.username + ", tienes un total de " + totalLibros + " libros agregados");
    $("#descripcion").text("Puedes leer los libros en un total de " + calcularTiempoLectura(user.libros_guardados) + " horas.");

    $("#email").val(user.email);
    $("#username").val(user.username);
    $("#password").val(user.password);
});

async function getUser() {
    const username = localStorage.getItem("username");
    return await obtenerUsuario(username);
}

function calcularTiempoLectura(libros) {
    let tiempoTotalHoras = 0; // acumulador de tiempo

    if (libros.length > 0) {

        libros.forEach(libro => {
            // Estimar tiempo de lectura por libro
            const paginas = libro.pages || 100; // si no tiene páginas, asumir 100
            const tiempoLibro = paginas / 50;   // 50 páginas por hora
            tiempoTotalHoras += tiempoLibro;
        });

    }
    
    // Redondear el tiempo total a 1 decimal
    return Math.ceil(tiempoTotalHoras * 10) / 10;
}

async function actualizarUsuario() {
    const username = $("#username").val().trim();
    const email = $("#email").val().trim();
    const password = $("#password").val().trim();

    if (username === user.username) {
        mensajeAlert("El nombre de usuario es el mismo", "warning");
    }

    if (email === user.email) {
        mensajeAlert("El email es el mismo", "warning");
    }

    if (password === user.password) {
        mensajeAlert("La contraseña es la misma", "warning");
    }

    const response = await fetch(`/api/users/update/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
        mensajeAlert(data.error, "danger");
        return;
    }

    mensajeAlert("Usuario actualizado correctamente", "success");
}

window.actualizarUsuario = actualizarUsuario;