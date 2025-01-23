class ProductForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.products = [
            { id: 1, name: 'Pan tajado', price: 4500 },
            { id: 2, name: 'Leche larga vida', price: 3800 },
            { id: 3, name: 'Cereal en caja', price: 12500 },
            { id: 4, name: 'Atún en lata', price: 8000 },
            { id: 5, name: 'Mermelada', price: 7200 },
            { id: 6, name: 'Mayonesa', price: 6200 },
            { id: 7, name: 'Galletas dulces', price: 4800 },
            { id: 8, name: 'Jugo en caja', price: 3500 },
            { id: 9, name: 'Chocolate en barra', price: 6900 },
        ];
        this.selectedProducts = [];
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <h2>Seleccionar Productos</h2>
            <ul id="productList">
                ${this.products.map(product => `
                    <li>
                        ${product.name} - $${product.price}
                        <button data-id="${product.id}">Agregar</button>
                    </li>
                `).join('')}
            </ul>
            <h3>Productos Seleccionados</h3>
            <ul id="selectedProductsList"></ul>
        `;

        this.shadowRoot.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                const product = this.products.find(p => p.id === productId);
                this.addProduct(product);
            });
        });
    }

    addProduct(product) {
        this.selectedProducts.push(product);
        this.updateSelectedProductsList();
        this.dispatchEvent(new CustomEvent('product-added', { detail: product }));
    }

    updateSelectedProductsList() {
        const selectedProductsList = this.shadowRoot.getElementById('selectedProductsList');
        selectedProductsList.innerHTML = '';
        this.selectedProducts.forEach(product => {
            const li = document.createElement('li');
            li.textContent = `${product.name} - $${product.price}`;
            selectedProductsList.appendChild(li);
        });
    }
}

customElements.define('product-form', ProductForm);