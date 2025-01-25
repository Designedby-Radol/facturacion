class UserForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; margin-bottom: 20px; }
                .input {
                    border: 2px solid transparent;
                    width: 100%;
                    height: 2.5em;
                    padding-left: 0.8em;
                    outline: none;
                    overflow: hidden;
                    background-color: #F3F3F3;
                    border-radius: 10px;
                    transition: all 0.5s;
                }
                .input:hover,
                .input:focus {
                    border: 2px solid #4A9DEC;
                    box-shadow: 0px 0px 0px 7px rgb(74, 157, 236, 20%);
                    background-color: white;
                }
                form { background: white; padding: 20px; border-radius: 8px; }
            </style>
            <form id="userForm" class="needs-validation" novalidate>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="userId" class="form-label">Número de Identificación</label>
                        <input type="text" class="form-control input" id="userId" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="userName" class="form-label">Nombre Completo</label>
                        <input type="text" class="form-control input" id="userName" required>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="userAddress" class="form-label">Dirección</label>
                    <input type="text" class="form-control input" id="userAddress" required>
                </div>
                <div class="mb-3">
                    <label for="userEmail" class="form-label">Correo Electrónico</label>
                    <input type="email" class="form-control input" id="userEmail" required>
                </div>
            </form>
        `;
    }

    setupEventListeners() {
        const form = this.shadowRoot.getElementById('userForm');
        form.addEventListener('submit', (e) => e.preventDefault());
    }

    getUserData() {
        const form = this.shadowRoot.getElementById('userForm');
        return {
            'no-id': this.shadowRoot.getElementById('userId').value,
            'name': this.shadowRoot.getElementById('userName').value,
            'direccion': this.shadowRoot.getElementById('userAddress').value,
            'email': this.shadowRoot.getElementById('userEmail').value
        };
    }
}
customElements.define('user-form', UserForm);