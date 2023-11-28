const showTeamButton = document.getElementById('find_team');
const team_name_input = document.getElementById('team_name');


showTeamButton.addEventListener('click', () => {
    const team_name_term = team_name_input.value;
    

       // Assuming you have an endpoint on the server to handle the search
       fetch(`/getTeamData?term=${team_name_term}`)
           .then(response => response.json())
           .then(data => {
               // Clear previous table content
               dataTable.innerHTML = '';

               // Display the search result in a table
               if (data.length > 0) {
                   const headerRow = document.createElement('tr');
                   Object.keys(data[0]).forEach(key => {
                       const th = document.createElement('th');
                       th.textContent = key;
                       headerRow.appendChild(th);
                   });
                   dataTable.appendChild(headerRow);

                   data.forEach(item => {
                       const row = document.createElement('tr');
                       Object.values(item).forEach(value => {
                           const td = document.createElement('td');
                           td.textContent = value;
                           row.appendChild(td);
                       });
                       dataTable.appendChild(row);
                   });
               } else {
                   // If no results, display a message
                   dataTable.innerHTML = '<p>No results found.</p>';
               }
           })
           .catch(error => {
               console.error('Error searching data:', error);
           });
   
   
});