import { mensajeAlert } from './app.js'

let libros = [];
let listaLibrosDisponiblesHtml;
let listaLibrosAgregadosHtml;

$(function() {

    // Seleccionamos la lista de libros disponibles
    listaLibrosDisponiblesHtml = $("#libros .lista-libros");

    // Seleccionamos lista de libros agregados
    listaLibrosAgregadosHtml = $("#libros-agregados .lista-libros");

    // Ejemplo: generar tarjetas dentro de la lista de libros disponibles
    libros = getLibros();

    // Crear tarjetas dinámicamente
    crearListaLibros(libros, listaLibrosDisponiblesHtml);

    // Hacer tarjetas draggable
    activarDraggable();

    // Hacer listas droppable
    activarDroppable();
});

function activarDraggable() {
    $(".libro-card").draggable({
        revert: "invalid",
        helper: "clone",
        cursor: "move",
        start: function(event, ui) {
            ui.helper.css({
                width: $(this).outerWidth(),
                height: $(this).outerHeight()
            });
        }
    });
}

function activarDroppable() {
    $(".lista-libros").droppable({
        accept: ".libro-card",
        drop: function(event, ui) {
            const dragged = ui.draggable;

            // Mover al contenedor donde se soltó
            $(this).append(dragged);

            // Ajustar posición
            dragged.css({ top: 0, left: 0 });
        }
    });
}

function getLibros() {

    const librosGuardados = obtenerLibrosGuardados(); // Array de libros ya agregados

    // Lista completa de libros disponibles
    const todosLibros = [
        {id: 1, titulo: "El Hobbit"},
        {id: 2, titulo: "Harry Potter"},
        {id: 3, titulo: "1984"},
        {id: 4, titulo: "Silo"}
    ];

    // Filtrar libros que ya están guardados
    const libros = todosLibros.filter(libro =>
        !librosGuardados.some(lg => lg.id === libro.id)
    );

    return libros;
}

function crearListaLibros(libros, listalibrosHtml) {
    // Crear tarjetas dinámicamente
    libros.forEach(libro => {
        const $tarjeta = $(`<div class="libro-card" data-id="${libro.id}">${libro.titulo}</div>`);
        listalibrosHtml.append($tarjeta);
    });
}

function buscarUnLibroPorTitulo() {
    const tituloLibro = $("#inputSearch").val().trim();

    if (tituloLibro === '') {
        mensajeAlert("No ha ingresado informacion", "danger");
        return;
    }

    let librosEncontrados = libros.filter(libro => libro.titulo.toLowerCase().includes(tituloLibro.toLowerCase()));

    if (librosEncontrados.length <= 0) {
        mensajeAlert("No se encontraron libros", "danger");
        return;
    } else {
        mensajeAlert("Libros encontrados: " + librosEncontrados.length, "success")
    }

    listaLibrosDisponiblesHtml.empty(); // Limpiar lista

    crearListaLibros(librosEncontrados, listaLibrosDisponiblesHtml);

    activarDraggable();
}

function reiniciarBusqueda() {
    listaLibrosDisponiblesHtml.empty();
    crearListaLibros(getLibros(), listaLibrosDisponiblesHtml);
    activarDraggable();
}

function guardarLibros() {

    const librosGuardados = obtenerLibrosGuardados();

    if (librosGuardados.length <= 0) {
        mensajeAlert("No hay libros agregados", "danger")
    }

    listaLibrosAgregadosHtml.empty();
    activarDroppable();
    reiniciarBusqueda();

    return librosGuardados;
}

function obtenerLibrosGuardados() {
    const librosGuardados = [];

    // Recorremos las tarjetas dentro de la lista de agregados
    listaLibrosAgregadosHtml.find(".libro-card").each(function() {

        const id = $(this).data("id");

        // Buscamos el libro original por id
        const libro = libros.find(l => l.id === id);

        if (libro) {
            librosGuardados.push(libro);
        }
    });

    return librosGuardados;
}

// Exponer funciones al scope global para botones inline
window.buscarUnLibroPorTitulo = buscarUnLibroPorTitulo;
window.reiniciarBusqueda = reiniciarBusqueda;
window.guardarLibros = guardarLibros;