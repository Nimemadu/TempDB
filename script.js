 document.addEventListener('DOMContentLoaded', function() {
    const tables = {};

    const createTableForm = document.getElementById('create-table-form');
    const tablesContainer = document.getElementById('tables-container');

    createTableForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const tableName = document.getElementById('table-name').value.trim();
        const fields = document.getElementById('fields').value.trim().split(',').map(field => field.trim());

        if (tableName && fields.length > 0) {
            tables[tableName] = {
                fields: fields,
                data: []
            };

            renderTables();
        }
    });

    function renderTables() {
        tablesContainer.innerHTML = '';

        for (const tableName in tables) {
            const table = tables[tableName];
            const accordion = document.createElement('button');
            accordion.classList.add('accordion');
            accordion.textContent = tableName;

            const panel = document.createElement('div');
            panel.classList.add('panel');

            const addDataForm = document.createElement('form');
            addDataForm.classList.add('add-data-form');

            table.fields.forEach(field => {
                const label = document.createElement('label');
                label.textContent = field;

                const input = document.createElement('input');
                input.type = 'text';
                input.name = field;
                input.required = true;

                addDataForm.appendChild(label);
                addDataForm.appendChild(input);
            });

            const addButton = document.createElement('button');
            addButton.type = 'submit';
            addButton.textContent = 'Add Row';

            addDataForm.appendChild(addButton);

            panel.appendChild(addDataForm);

            const tableElement = document.createElement('table');
            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');

            const headerRow = document.createElement('tr');
            table.fields.forEach(field => {
                const th = document.createElement('th');
                th.textContent = field;
                headerRow.appendChild(th);
            });
            const actionTh = document.createElement('th');
            actionTh.textContent = 'Actions';
            headerRow.appendChild(actionTh);
            thead.appendChild(headerRow);
            tableElement.appendChild(thead);
            tableElement.appendChild(tbody);

            panel.appendChild(tableElement);

            tablesContainer.appendChild(accordion);
            tablesContainer.appendChild(panel);

            accordion.addEventListener('click', function() {
                this.classList.toggle('active');
                const panel = this.nextElementSibling;
                if (panel.style.display === 'block') {
                    panel.style.display = 'none';
                } else {
                    panel.style.display = 'block';
                }
            });

            addDataForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const newData = {};
                table.fields.forEach(field => {
                    newData[field] = this[field].value;
                });
                table.data.push(newData);
                renderTableData(tableName, table, tbody);
                this.reset();
            });

            renderTableData(tableName, table, tbody);
        }
    }

    function renderTableData(tableName, table, tbody) {
        tbody.innerHTML = '';

        table.data.forEach((row, rowIndex) => {
            const tr = document.createElement('tr');
            table.fields.forEach(field => {
                const td = document.createElement('td');
                td.textContent = row[field];
                tr.appendChild(td);
            });
            const actionTd = document.createElement('td');

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', function() {
                editRow(tableName, rowIndex);
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function() {
                deleteRow(tableName, rowIndex);
            });

            actionTd.appendChild(editButton);
            actionTd.appendChild(deleteButton);
            tr.appendChild(actionTd);
            tbody.appendChild(tr);
        });
    }

    function editRow(tableName, rowIndex) {
        const table = tables[tableName];
        const row = table.data[rowIndex];
        const newData = {};

        table.fields.forEach(field => {
            const newValue = prompt(`Enter new value for ${field}:`, row[field]);
            if (newValue !== null) {
                newData[field] = newValue;
            }
        });

        table.data[rowIndex] = newData;
        renderTables();
    }

    function deleteRow(tableName, rowIndex) {
        const table = tables[tableName];
        table.data.splice(rowIndex, 1);
        renderTables();
    }
});
