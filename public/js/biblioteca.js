let libros = [];
let listaLibrosDisponiblesHtml;

$(function() {

    // Ejemplo: generar tarjetas dentro de la lista de libros disponibles
    libros = getLibros();

    // Seleccionamos la lista de libros disponibles
    listaLibrosDisponiblesHtml = $("#libros .lista-libros");
    const $listaAgregados = $("#libros-agregados .lista-libros");

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
                width: $(this).width(),
                height: $(this).height()
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
    // Ejemplo: generar tarjetas dentro de la lista de libros disponibles
    const libros = [
        {id: 1, titulo: "El Hobbit"},
        {id: 2, titulo: "Harry Potter"},
        {id: 3, titulo: "1984"},
        {id: 4, titulo: "Silo"}
    ];

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

    librosEncontrados = libros.filter(libro => libro.titulo.toLowerCase().includes(tituloLibro.toLowerCase()));

    listaLibrosDisponiblesHtml.empty(); // Limpiar lista

    crearListaLibros(librosEncontrados, listaLibrosDisponiblesHtml);

    activarDraggable();
}

function reiniciarBusqueda() {
    listaLibrosDisponiblesHtml.empty();
    crearListaLibros(getLibros(), listaLibrosDisponiblesHtml);
    activarDraggable();
}