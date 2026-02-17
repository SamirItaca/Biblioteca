export function mensajeAlert(mensaje, tipo, tiempo = 3000) {

    const alertPlaceholder = document.getElementById('mensaje');

    const wrapper = document.createElement('div');

    wrapper.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            <div>${mensaje}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    alertPlaceholder.append(wrapper);

    // Cerrar automáticamente después de 'tiempo' milisegundos
    setTimeout(() => {
        const alert = bootstrap.Alert.getOrCreateInstance(wrapper.querySelector('.alert'));
        alert.close();
    }, tiempo);
}

export function cerrarSesion() {
    window.location.href = '/login';
}

window.mensajeAlert = mensajeAlert;
window.cerrarSesion = cerrarSesion;