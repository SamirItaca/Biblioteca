import { mensajeAlert, obtenerUsuario } from "./app.js";

let user;
let misLibros = [];
let listaLibrosHtml;

$(async function() {

    // Obtener usuario logueado
    user = await getUser();

    if (!user) return;

    // Seleccionamos la lista de libros disponibles
    listaLibrosHtml = $("#mis-libros");

    cargarLibros().then(librosObtenidos => {

        misLibros = librosObtenidos;

        $("#txtTitulo").text("Hola " + user.username + ", estos son tus libros");

        // Crear tarjetas de libros
        crearListaLibros(misLibros);

        activarAccordion();
    });
});

async function getUser() {
    const username = localStorage.getItem("username");
    return await obtenerUsuario(username);
}

function activarAccordion() {
    listaLibrosHtml.accordion();
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

    listaLibrosHtml.empty().append($spinner);

    // Esperar los libros
    const libros = await obtenerMisLibros(user);

    // Quitar spinner
    $("#spinner-carga").remove();

    return libros;
}

async function obtenerMisLibros(user) {
    
    try {

        if (user.libros_guardados.length > 0) {
            const libros = user.libros_guardados;

            return libros;
        }

        mensajeAlert('El usuario ' + user.username + " no tiene libros", "primary")
        return;

    } catch (error) {
        console.error(error);
        // En caso de error, devolver array vacío
        return [];
    }
}

function crearListaLibros(libros) {
    let tiempoTotalHoras = 0; // acumulador de tiempo

    // Crear tarjetas dinámicamente
    libros.forEach(libro => {
        // Si authors no existe, usar un array vacío
        const autores = Array.isArray(libro.authors) ? libro.authors : ['Sin autor'];

        // Estimar tiempo de lectura por libro
        const paginas = libro.pages || 100; // si no tiene páginas, asumir 100
        const tiempoLibro = paginas / 50;   // 50 páginas por hora
        tiempoTotalHoras += tiempoLibro;

        const $tarjeta = $(`
            <h3>${libro.title}</h3>
            <div class="card flex-row align-items-start">
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
        `);

        listaLibrosHtml.append($tarjeta);
    });
    
    // Redondear el tiempo total a 1 decimal
    const tiempoRedondeado = Math.ceil(tiempoTotalHoras * 10) / 10;

    $("#txtTiempoLectura").text(
        `Tienes un total de ${libros.length} libros agregados. Tiempo de lectura estimado: ${tiempoRedondeado} horas`
    );
}