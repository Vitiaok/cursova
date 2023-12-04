const showMatchButton = document.getElementById('find_match');
const home_team_input = document.getElementById('home_team');
const guest_team_input = document.getElementById('guest_team');


function createDataRow(headerText, data) {
    
    const headerRow = document.createElement('tr');
    const th = document.createElement('th');
    th.textContent = headerText;
    th.setAttribute('colspan', '2');
    headerRow.appendChild(th);
    dataTable.appendChild(headerRow);
  
    
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
       
       fetch(`/getMatchData?term1=${home_team_term}&term2=${guest_team_term}`)
           .then(response => response.json())
           .then(data => {
               
               
              if(home_team_input.value != '' && guest_team_input.value != '')
              {
                                
                if (data.length > 0) {
                    //row1
                    
                    const headerRow1 = document.createElement('tr');
                    const th1 = document.createElement('th');
                    th1.textContent = 'Раунд чемпіонату';
                    th1.setAttribute('colspan', '2'); 
                    headerRow1.appendChild(th1);
                    dataTable.appendChild(headerRow1);
              
                    
                    const dataRow1 = document.createElement('tr');
                    const td1 = document.createElement('td');
                    td1.textContent = data[0].championat_round;
                    td1.setAttribute('colspan', '2'); 
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
                    
                    dataTable.innerHTML = '<p>Цей матч ще не відбувся</p>';
                }
              }
              else
              {
                errorMessage.textContent = 'Помилка. Ви не ввели команду';
              }
               
               
           })
           .catch(error => {
               console.error('Помилка пошуку:', error);
           });

});