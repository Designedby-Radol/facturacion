// Add to components/invoices-list.js
class InvoicesList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; margin-top: 20px; }
                .invoice-list { background: white; padding: 20px; border-radius: 8px; }
                .invoice-item { 
                    border-bottom: 1px solid #eee; 
                    padding: 10px 0; 
                    display: flex; 
                    justify-content: space-between;
                    align-items: center;
                }
            </style>
            <div class="invoice-list">
                <h3>Facturas Generadas</h3>
                ${this.invoices.length ? this.renderInvoices() : '<p>No hay facturas generadas</p>'}
            </div>
        `;
        this.setupEventListeners();
    }

    renderInvoices() {
        return `
            <div>
                ${this.invoices.map((invoice, index) => `
                    <div class="invoice-item">
                        <div>
                            <strong>Factura #${index + 1}</strong>
                            <p>${invoice.infouser.name} - Total: $${invoice.summary.total.toFixed(2)}</p>
                        </div>
                        <button class="view-details-btn view-invoice" data-index="${index}">Ver Detalles</button>
                    </div>
                `).join('')}
            </div>
            <style>
                .view-details-btn {
                    width: fit-content;
                    min-width: 100px;
                    height: 45px;
                    padding: 8px;
                    border-radius: 5px;
                    border: 2.5px solid #E0E1E4;
                    box-shadow: 0px 0px 20px -20px;
                    cursor: pointer;
                    background-color: white;
                    transition: all 0.2s ease-in-out 0ms;
                    user-select: none;
                    font-family: 'Poppins', sans-serif;
                }
                .view-details-btn:hover {
                    background-color: #F2F2F2;
                    box-shadow: 0px 0px 20px -18px;
                }
                .view-details-btn:active {
                    transform: scale(0.95);
                }
            </style>
        `;
    }

    setupEventListeners() {
        const viewButtons = this.shadowRoot.querySelectorAll('.view-invoice');
        viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                this.showInvoiceDetails(this.invoices[index]);
            });
        });
    }

    showInvoiceDetails(invoice) {
        const modal = document.createElement('div');
        modal.innerHTML = `
            <div class="modal" tabindex="-1" style="display:block; background: rgba(0,0,0,0.5); position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1000;">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Detalles de Factura</h5>
                            <button type="button" class="btn-close close-modal"></button>
                        </div>
                        <div class="modal-body">
                            <h6>Información del Cliente</h6>
                            <p>Nombre: ${invoice.infouser.name}</p>
                            <p>ID: ${invoice.infouser['no-id']}</p>
                            <p>Email: ${invoice.infouser.email}</p>
                            
                            <h6>Productos</h6>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Precio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${Object.values(invoice.products).map(product => `
                                        <tr>
                                            <td>${product.name}</td>
                                            <td>${product.quantity}</td>
                                            <td>$${product.price}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                            
                            <h6>Resumen</h6>
                            <p>Subtotal: $${invoice.summary.subtotal.toFixed(2)}</p>
                            <p>IVA: $${invoice.summary.iva.toFixed(2)}</p>
                            <p><strong>Total: $${invoice.summary.total.toFixed(2)}</strong></p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal events
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    addInvoice(invoice) {
        this.invoices.push(invoice);
        localStorage.setItem('invoices', JSON.stringify(this.invoices));
        this.render();
    }
}

customElements.define('invoices-list', InvoicesList);

export default InvoicesList;