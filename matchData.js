const showMatchButton = document.getElementById('find_match');
const home_team_input = document.getElementById('home_team');
const guest_team_input = document.getElementById('guest_team');


function createDataRow(headerText, data) {
    // Create the header row
    const headerRow = document.createElement('tr');
    const th = document.createElement('th');
    th.textContent = headerText;
    th.setAttribute('colspan', '2');
    headerRow.appendChild(th);
    dataTable.appendChild(headerRow);
  
    // Create the data row
    const dataRow = document.createElement('tr');
    const td1 = document.createElement('td');
    td1.textContent = data[0];
    dataRow.appendChild(td1);
  
    const td2 = document.createElement('td');
    td2.textContent = data[1];
    dataRow.appendChild(td2);
  
    dataTable.appendChild(dataRow);
}


showMatchButton.addEventListener('click', () => {
    const home_team_term = home_team_input.value;
    const guest_team_term = guest_team_input.value;
    dataTable.innerHTML = '';
    errorMessage.textContent = '';
       // Assuming you have an endpoint on the server to handle the search
       fetch(`/getMatchData?term1=${home_team_term}&term2=${guest_team_term}`)
           .then(response => response.json())
           .then(data => {
               // Clear previous table content
               
              if(home_team_input.value != '' && guest_team_input.value != '')
              {
                                
                if (data.length > 0) {
                    //row1
                    
                    const headerRow1 = document.createElement('tr');
                    const th1 = document.createElement('th');
                    th1.textContent = 'Раунд чемпіонату';
                    th1.setAttribute('colspan', '2'); // Span across 2 columns
                    headerRow1.appendChild(th1);
                    dataTable.appendChild(headerRow1);
              
                    // Create the data row for championat_round
                    const dataRow1 = document.createElement('tr');
                    const td1 = document.createElement('td');
                    td1.textContent = data[0].championat_round;
                    td1.setAttribute('colspan', '2'); // Span across 2 columns
                    dataRow1.appendChild(td1);
                    dataTable.appendChild(dataRow1);
                
                    //row2
                    const headerRow2 = document.createElement('tr');
                    const th2_1 = document.createElement('th');
                    th2_1.textContent = 'Домашня команда';
                    headerRow2.appendChild(th2_1);
              
                    const th2_2 = document.createElement('th');
                    th2_2.textContent = 'Гостьова команда';
                    headerRow2.appendChild(th2_2);
              
                    dataTable.appendChild(headerRow2);
              
                    // Create the data row for home_team and guest_team
                    const dataRow2 = document.createElement('tr');
                    const td2_1 = document.createElement('td');
                    td2_1.textContent = data[0].home_team;
                    dataRow2.appendChild(td2_1);
              
                    const td2_2 = document.createElement('td');
                    td2_2.textContent = data[0].guest_team;
                    dataRow2.appendChild(td2_2);
              
                    dataTable.appendChild(dataRow2);

                    //row3
                    createDataRow('Забиті м\'ячі', [data[0].h_scored_goals,data[0].g_scored_goals]);
                    //row4
                    createDataRow('Володіння м\'ячем у %', [data[0].h_possesion_in_percents,data[0].g_possesion_in_percents]);
                    //row5
                    createDataRow('Удари', [data[0].h_total_attempts,data[0].g_total_attempts]);
                    //row6
                    createDataRow('Удари по воротах', [data[0].h_shots_on_target,data[0].g_shots_on_target]);
                    //row7
                    createDataRow('Атаки', [data[0].h_total_attacks,data[0].g_total_attacks]);
                    //row8
                    createDataRow('Небезпечні атаки', [data[0].h_dangerous_attacks,data[0].g_dangerous_attacks]);
                } else {
                    // If no results, display a message
                    dataTable.innerHTML = '<p>Цей матч ще не відбувся</p>';
                }
              }
              else
              {
                errorMessage.textContent = 'Помилка. Ви не ввели команду';
              }
               // Display the search result in a table
               
           })
           .catch(error => {
               console.error('Error searching data:', error);
           });

});