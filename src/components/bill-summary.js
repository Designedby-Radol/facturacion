class BillSummary extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.billData = { products: [], subtotal: 0, iva: 0, total: 0 };
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; }
                .summary-card { background: white; padding: 20px; border-radius: 8px; }
                .pay-btn {
                    background-color: #28a745;
                    color: white;
                    transition: all 0.3s ease;
                }
                .pay-btn:hover {
                    background-color: #218838;
                    transform: scale(1.05);
                }
            </style>
            <div class="summary-card">
                <h3>Resumen de Factura</h3>
                <table class="table">
                    <tr>
                        <td>Subtotal</td>
                        <td id="subtotal">$0</td>
                    </tr>
                    <tr>
                        <td>IVA (19%)</td>
                        <td id="iva">$0</td>
                    </tr>
                    <tr>
                        <td><strong>Total</strong></td>
                        <td id="total">$0</td>
                    </tr>
                </table>
                <button id="payButton" class="btn pay-btn w-100">Pagar</button>
            </div>
        `;
    }

    setupEventListeners() {
        document.addEventListener('products-updated', (e) => {
            this.updateSummary(e.detail);
        });

        const payButton = this.shadowRoot.getElementById('payButton');
        payButton.addEventListener('click', () => this.processBill());
    }

    updateSummary(products) {
        const subtotal = products.reduce((sum, product) => 
            sum + (product.price * product.quantity), 0);
        const iva = subtotal * 0.19;
        const total = subtotal + iva;

        this.shadowRoot.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        this.shadowRoot.getElementById('iva').textContent = `$${iva.toFixed(2)}`;
        this.shadowRoot.getElementById('total').textContent = `$${total.toFixed(2)}`;

        this.billData = { products, subtotal, iva, total };
    }

    processBill() {
        const userForm = document.querySelector('user-form');
        const productSelector = document.querySelector('product-selector');
        const invoicesList = document.querySelector('invoices-list');
    
        const billData = {
            infouser: userForm.getUserData(),
            products: productSelector.getSelectedProducts().reduce((acc, product) => {
                acc[product.name] = product;
                return acc;
            }, {}),
            summary: this.billData
        };
    
        invoicesList.addInvoice(billData);
        
        // Reset form
        userForm.shadowRoot.getElementById('userForm').reset();
        
        // Reset product selector
        productSelector.selectedProducts = [];
        productSelector.updateSelectedList();
    
        // Reset summary
        this.shadowRoot.getElementById('subtotal').textContent = '$0';
        this.shadowRoot.getElementById('iva').textContent = '$0';
        this.shadowRoot.getElementById('total').textContent = '$0';
        
        // Reset billData
        this.billData = { products: [], subtotal: 0, iva: 0, total: 0 };
    }
}
customElements.define('bill-summary', BillSummary);

