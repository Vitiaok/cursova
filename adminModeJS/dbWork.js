const dataTable = document.getElementById('dataTable');
const logoutButton = document.getElementById('logout');
const executeQueryButton = document.getElementById('execute_query');
const isAuthenticated = sessionStorage.getItem('authenticated');
const sqlQueryInput = document.getElementById('query');
const tableCaption = document.getElementById('tableCaption');
const tableBody = dataTable.querySelector('tbody');


if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      try {
        const response = await fetch('/logout', {
          method: 'POST',
        });

        if (response.ok) {
          alert('Logout successful');
          // Clear sessionStorage and redirect to the login page
          sessionStorage.clear();
          window.location.href = '/adminModeHTML/index5.html'; // Redirect to the login page
        } else {
          alert('Logout failed');
        }
      } catch (error) {
        console.error('Error during logout:', error);
      }
    });
}


// Function to determine the type of SQL statement
function getSqlStatementType(sqlQuery) {
    const trimmedQuery = sqlQuery.toLowerCase();

    if (trimmedQuery.startsWith('select')) {
        return 'Select';
    } else if (trimmedQuery.startsWith('update')) {
        return 'Update';
    } else if (trimmedQuery.startsWith('insert')) {
        return 'Insert';
    } else {
        // Default to 'Select' if the type cannot be determined
        return 'Select';
    }
}

executeQueryButton.addEventListener('click', () => {
    tableCaption.textContent = '';
    const sqlQuery = sqlQueryInput.value.trim();

    if (sqlQuery === '') {
        errorMessage.textContent = 'Помилка. Ви не ввели запит';
        return;
    }

    // Determine the type of SQL statement (SELECT, UPDATE, INSERT)
    const statementType = getSqlStatementType(sqlQuery);
    console.log(statementType);
    if(statementType ==='Select'){
        // SELECT
        fetch(`/executeSelect?sql=${encodeURIComponent(sqlQuery)}`)
        .then(response => response.json())
        .then(data => {
            errorMessage.textContent = '';
            tableBody.innerHTML = '';

            data.forEach(rowData => {
                const row = tableBody.insertRow();
                Object.values(rowData).forEach(value => {
                    const cell = row.insertCell();
                    cell.textContent = value;
                });
            });
        })
        .catch(error => {
            console.error(`Помилка виконання ${statementType} SQL-запиту:`, error);
            errorMessage.textContent = `Помилка виконання ${statementType} SQL-запиту`;
        });

    }else if(statementType ==='Update'){
        // UPDATE
        fetch(`/executeUpdate?sql=${encodeURIComponent(sqlQuery)}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',},
        })
        .then(response => {
        if (!response.ok) {
            throw new Error(`Error executing UPDATE: ${response.statusText}`);
        }
        return response.json();
        })
        .then(data => {
        // Handle the response for UPDATE
        console.log('UPDATE result:', data);
        })
        .catch(error => {
        // Handle errors for UPDATE
        console.error('Error executing UPDATE:', error.message);
        });

    }else{
        // INSERT INTO
        fetch('/executeInsert', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql: sqlQuery }), // Send the SQL query in the request body
        })
        .then(response => {
        if (!response.ok) {
            throw new Error(`Error executing INSERT INTO: ${response.statusText}`);
        }
        return response.json();
        })
        .then(data => {
        // Handle the response for INSERT INTO
        console.log('INSERT INTO result:', data);
        })
        .catch(error => {
        // Handle errors for INSERT INTO
        console.error('Error executing INSERT INTO:', error.message);
        });

    }
});








