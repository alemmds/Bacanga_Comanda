document.addEventListener('DOMContentLoaded', () => {
    const ordersTableBody = document.querySelector('#orders-table tbody');
    const confirmBtn = document.getElementById('confirm-btn');
    const tableSelect = document.getElementById('table-select');
    const snackNameInput = document.getElementById('snack-name');
    const snackPriceInput = document.getElementById('snack-price');
    const tableSummary = document.getElementById('table-summary');
    
    let orders = [];
    
    confirmBtn.addEventListener('click', () => {
        const table = tableSelect.value;
        const snackName = snackNameInput.value;
        const snackPrice = parseFloat(snackPriceInput.value);
        
        if (snackName && !isNaN(snackPrice)) {
            addOrder(table, snackName, snackPrice);
            updateOrdersTable();
            updateTableSummary();
        }
    });

    function addOrder(table, snackName, snackPrice) {
        let existingOrder = orders.find(order => order.table === table && order.snackName === snackName);
        if (existingOrder) {
            existingOrder.quantity += 1;
            existingOrder.totalPrice += snackPrice;
        } else {
            orders.push({
                table: table,
                snackName: snackName,
                unitPrice: snackPrice,
                quantity: 1,
                totalPrice: snackPrice
            });
        }
    }

    function updateOrdersTable() {
        ordersTableBody.innerHTML = '';
        orders
            .sort((a, b) => a.table - b.table)  // Ordenar por mesa
            .forEach(order => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${order.table}</td>
                    <td>${order.snackName}</td>
                    <td>${order.quantity}</td>
                    <td>${order.unitPrice.toFixed(2)}</td>
                    <td>${order.totalPrice.toFixed(2)}</td>
                    <td><button class="edit-btn">Alterar</button> <button class="delete-btn">Excluir</button></td>
                `;
                ordersTableBody.appendChild(row);
                
                row.querySelector('.edit-btn').addEventListener('click', () => {
                    editOrder(order);
                });
                row.querySelector('.delete-btn').addEventListener('click', () => {
                    deleteOrder(order);
                });
            });
    }

    function updateTableSummary() {
        const tableTotals = orders.reduce((acc, order) => {
            if (!acc[order.table]) {
                acc[order.table] = 0;
            }
            acc[order.table] += order.totalPrice;
            return acc;
        }, {});
        
        tableSummary.innerHTML = '';
        for (let table in tableTotals) {
            const li = document.createElement('li');
            li.textContent = `Mesa ${table}: R$ ${tableTotals[table].toFixed(2)}`;
            tableSummary.appendChild(li);
        }
    }

    function editOrder(order) {
        snackNameInput.value = order.snackName;
        snackPriceInput.value = order.unitPrice;
        tableSelect.value = order.table;
        
        deleteOrder(order);
    }

    function deleteOrder(order) {
        orders = orders.filter(o => o !== order);
        updateOrdersTable();
        updateTableSummary();
    }
});
