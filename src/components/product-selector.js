class ProductSelector extends HTMLElement {
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
            { id: 9, name: 'Chocolate en barra', price: 6900 }
        ];
        this.selectedProducts = [];
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; margin-bottom: 20px; }
                .product-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
                .product-item { background: white; padding: 10px; border-radius: 5px; text-align: center; }
                .selected-products { margin-top: 20px; }
            </style>
            <div class="container">
                <div class="product-grid">
                    ${this.products.map(product => `
                        <div class="product-item" data-id="${product.id}">
                            ${product.name} - $${product.price}
                        </div>
                    `).join('')}
                </div>
                <div class="selected-products mt-3">
                    <h3>Productos Seleccionados</h3>
                    <ul id="selectedList" class="list-group"></ul>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const grid = this.shadowRoot.querySelector('.product-grid');
        grid.addEventListener('click', (e) => {
            const productItem = e.target.closest('.product-item');
            if (productItem) {
                const productId = parseInt(productItem.dataset.id);
                this.addProduct(productId);
            }
        });
    }

    addProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        const existingProduct = this.selectedProducts.find(p => p.id === productId);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            this.selectedProducts.push({ ...product, quantity: 1 });
        }

        this.updateSelectedList();
        this.dispatchEvent(new CustomEvent('products-updated', { 
            detail: this.selectedProducts,
            bubbles: true 
        }));
    }

    updateSelectedList() {
        const list = this.shadowRoot.getElementById('selectedList');
        list.innerHTML = this.selectedProducts.map(product => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${product.name} - $${product.price} x ${product.quantity}
                <button class="button" data-id="${product.id}">
                    <svg viewBox="0 0 448 512" class="svgIcon">
                        <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                    </svg>
                </button>
            </li>
        `).join('');
    
        // Add styles for the delete button
        const style = document.createElement('style');
        style.textContent = `
            .button {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background-color: rgb(20, 20, 20);
                border: none;
                font-weight: 600;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.164);
                cursor: pointer;
                transition-duration: .3s;
                overflow: hidden;
                position: relative;
            }
            .svgIcon {
                width: 12px;
                transition-duration: .3s;
            }
            .svgIcon path {
                fill: white;
            }
            .button:hover {
                width: 140px;
                border-radius: 50px;
                transition-duration: .3s;
                background-color: rgb(255, 69, 69);
                align-items: center;
            }
            .button:hover .svgIcon {
                width: 50px;
                transition-duration: .3s;
                transform: translateY(60%);
            }
            .button::before {
                position: absolute;
                top: -20px;
                content: "Delete";
                color: white;
                transition-duration: .3s;
                font-size: 2px;
            }
            .button:hover::before {
                font-size: 13px;
                opacity: 1;
                transform: translateY(30px);
                transition-duration: .3s;
            }
        `;
        list.appendChild(style);
    
        list.addEventListener('click', (e) => {
            const button = e.target.closest('.button');
            if (button) {
                const productId = parseInt(button.dataset.id);
                this.removeProduct(productId);
            }
        });
    }

    removeProduct(productId) {
        const index = this.selectedProducts.findIndex(p => p.id === productId);
        if (index !== -1) {
            this.selectedProducts.splice(index, 1);
            this.updateSelectedList();
            this.dispatchEvent(new CustomEvent('products-updated', { 
                detail: this.selectedProducts,
                bubbles: true 
            }));
        }
    }

    getSelectedProducts() {
        return this.selectedProducts;
    }
}
customElements.define('product-selector', ProductSelector);
