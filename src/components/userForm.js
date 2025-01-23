class UserForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = /*html*/ `
            <form id="userForm">
                <h2>Información del Comprador</h2>
                <input type="text" placeholder="Nombre" required id="name">
                <input type="text" placeholder="Dirección" required id="direccion">
                <input type="email" placeholder="Email" required id="email">
                <button type="submit">Guardar Comprador</button>
            </form>
        `;

        this.shadowRoot.getElementById('userForm').addEventListener('submit', (e) => {
            e.preventDefault();
                const userInfo = {
                noId: Date.now(),
                name: this.shadowRoot.getElementById('name').value,
                direccion: this.shadowRoot.getElementById('direccion').value,
                email: this.shadowRoot.getElementById('email').value
            };
            this.dispatchEvent(new CustomEvent('user-info-submitted', { detail: userInfo }));
        });
    }
}

customElements.define('user-form', UserForm);