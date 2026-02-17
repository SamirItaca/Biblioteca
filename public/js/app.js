export function mensajeAlert(mensaje, tipo) {

    const alertPlaceholder = document.getElementById('mensaje');

    const wrapper = document.createElement('div');

    wrapper.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            <div>${mensaje}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    alertPlaceholder.append(wrapper);
}

window.mensajeAlert = mensajeAlert; // si también quieres llamar desde HTML