import { mensajeAlert } from './app.js'

let libros = [];
let listaLibrosDisponiblesHtml;
let listaLibrosAgregadosHtml;

$(function() {

    // Seleccionamos la lista de libros disponibles
    listaLibrosDisponiblesHtml = $("#libros .lista-libros");

    // Seleccionamos lista de libros agregados
    listaLibrosAgregadosHtml = $("#libros-agregados .lista-libros");

    cargarLibros().then(librosObtenidos => {

        libros = librosObtenidos;

        // Crear tarjetas de libros
        crearListaLibros(libros, listaLibrosDisponiblesHtml);

        // Hacer tarjetas draggable y droppable
        activarDraggable();
        activarDroppable();
    });
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

async function cargarLibros() {
    // Mostrar spinner mientras carga
    const $spinner = $(`
        <div class="d-flex justify-content-center my-3" id="spinner-carga">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>
    `);

    listaLibrosDisponiblesHtml.empty().append($spinner);

    // Esperar los libros
    const libros = await getLibros();

    // Quitar spinner
    $("#spinner-carga").remove();

    return libros;
}

async function getLibros() {
    
    const librosGuardados = obtenerLibrosGuardados(); // Array de libros ya agregados

    try {
        // Llamada a la API
        const response = await fetch("http://localhost:3000/api/books/search");
        if (!response.ok) throw new Error("Error al obtener libros desde la API");

        const todosLibros = await response.json();

        // Filtrar los libros que ya están guardados
        const libros = todosLibros.filter(libro =>
            !librosGuardados.some(lg => lg.title === libro.title)
        );

        return libros;

    } catch (error) {
        console.error(error);
        // En caso de error, devolver array vacío
        return [];
    }
}

function crearListaLibros(libros, listalibrosHtml) {
    // Crear tarjetas dinámicamente
    libros.forEach(libro => {
        // Si authors no existe, usar un array vacío
        const autores = Array.isArray(libro.authors) ? libro.authors : ['Sin autor'];

        const $tarjeta = $(`
            <li class="libro-card" style="list-style: none; margin-bottom: 10px;">
                <div class="card d-flex flex-row align-items-start">
                    <img src="${libro.thumbnail || '/img/placeholder.png'}" 
                         class="card-img-left" 
                         alt="${libro.title}" 
                         style="width: 80px; height: auto; margin-right: 10px;">
                    <div class="card-body p-2">
                        <h5 class="card-title mb-1">${libro.title}</h5>
                        <p class="card-text mb-0">${autores.join(", ")}</p>
                        <p class="card-text mb-0">Paginas: ${libro.pages}</p>
                    </div>
                </div>
            </li>
        `);

        listalibrosHtml.append($tarjeta);
    });
}

function buscarUnLibroPorTitulo() {
    const tituloLibro = $("#inputSearch").val().trim();

    if (tituloLibro === '') {
        mensajeAlert("No ha ingresado informacion", "danger");
        return;
    }

    let librosEncontrados = libros.filter(libro => libro.title.toLowerCase().includes(tituloLibro.toLowerCase()));

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
    cargarLibros().then(librosObtenidos => {
        listaLibrosDisponiblesHtml.empty();

        libros = librosObtenidos;

        crearListaLibros(librosObtenidos, listaLibrosDisponiblesHtml);
        
        activarDraggable();
    });  
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

        // Obtenemos el título de la tarjeta
        const titulo = $(this).find(".card-title").text().trim();

        // Buscamos el libro original por título
        const libro = libros.find(l => l.title === titulo);

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