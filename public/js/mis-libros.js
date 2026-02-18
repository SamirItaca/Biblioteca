let misLibros = [];
let listaLibrosHtml;

$(function() {

    // Seleccionamos la lista de libros disponibles
    listaLibrosHtml = $("#mis-libros");

    cargarLibros().then(librosObtenidos => {

        misLibros = librosObtenidos;

        // Crear tarjetas de libros
        crearListaLibros(misLibros);

        activarAccordion();
    });
});

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
    const libros = await obtenerMisLibros();

    // Quitar spinner
    $("#spinner-carga").remove();

    return libros;
}

async function obtenerMisLibros() {
    
    try {
        // Llamada a la API
        const response = await fetch("https://custom-biblioteca.up.railway.app/api/books/search");
        if (!response.ok) throw new Error("Error al obtener libros desde la API");

        const libros = await response.json();

        return libros;

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
            <div>
                <img src="${libro.thumbnail}" alt="${libro.title}" style="width:10%">
                <p>${autores.join(", ")}</p>
                <p>Páginas: ${paginas}</p>
            </div>
        `);

        listaLibrosHtml.append($tarjeta);
    });

    $("#txtTitulo").text("Hola User, estos son tus libros");
    
    // Redondear el tiempo total a 1 decimal
    const tiempoRedondeado = Math.ceil(tiempoTotalHoras * 10) / 10;

    $("#txtTiempoLectura").text(
        `Tienes un total de ${libros.length} libros agregados. Tiempo de lectura estimado: ${tiempoRedondeado} horas`
    );
}