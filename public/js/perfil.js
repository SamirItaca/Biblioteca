import { mensajeAlert } from './app.js'

let user;

$(function() {

    $("#titulo").text("Username, tienes un total de 8 libros agregados");
    $("#descripcion").text("Puedes leer los libros en un total de 8.5 horas.");

    $("#email");
    $("#username");
    $("#password");
});

function actualizarPerfil() {
    console.log("update")
}

window.actualizarPerfil = actualizarPerfil;