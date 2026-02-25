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
    localStorage.clear();
    window.location.href = '/login';
}

export async function obtenerUsuario(username) {
    try {
        const response = await fetch(`/api/users/${username}`);
        const user = await response.json();

        if (!response.ok) {
            mensajeAlert("Usuario no encontrado", "danger");
            return;
        }

        return user;

    } catch (error) {
        mensajeAlert("Error al obtener usuario", "danger");
    }
}

window.mensajeAlert = mensajeAlert;
window.cerrarSesion = cerrarSesion;
window.obtenerUsuario = obtenerUsuario;