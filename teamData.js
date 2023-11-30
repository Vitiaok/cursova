const showTeamButton = document.getElementById('find_team');
const team_name_input = document.getElementById('team_name');
const showAllTeamButton = document.getElementById('find_all_teams');
const sortButton = document.getElementById('sortButton');
const sortButton2 = document.getElementById('sortButton2');
const sortButton3 = document.getElementById('sortButton3');
const sortButton4 = document.getElementById('sortButton4');
const sortButton5 = document.getElementById('sortButton5');
const sortButton6 = document.getElementById('sortButton6');
const sortButton7 = document.getElementById('sortButton7');
const p2 = document.getElementById('par2');


function handleButtonClick(endpoint) {
    
    errorMessage.textContent = '';
    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            dataTable.innerHTML = '';
            
           
                if (data.length <= 0) {
                    dataTable.innerHTML = `<p>Цієї команди не існує в УПЛ</p>`;
                } else {
                    const headerRow = document.createElement('tr');
                    const th1 = document.createElement('th');
                    const th2 = document.createElement('th');
                    const th3 = document.createElement('th');
                    const th4 = document.createElement('th');
                    const th5 = document.createElement('th');
                    const th6 = document.createElement('th');
                    const th7 = document.createElement('th');
                    th1.textContent = 'Команда';
                    th2.textContent = 'Середня кількість забитих голів';
                    th3.textContent = 'Середня кількість володіння м\'ячем';
                    th4.textContent = 'Середня кількість ударів';
                    th5.textContent = 'Середня кількість ударів по воротах';
                    th6.textContent = 'Середня кількість атак';
                    th7.textContent = 'Середня кількість небезпечних атак';
                    
                    headerRow.appendChild(th1);
                    headerRow.appendChild(th2);
                    headerRow.appendChild(th3);
                    headerRow.appendChild(th4);
                    headerRow.appendChild(th5);
                    headerRow.appendChild(th6);
                    headerRow.appendChild(th7);
                    
                    
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
                }      
                 
        })
        .catch(error => {
            console.error('Помилка пошуку:', error);
        });
}

showTeamButton.addEventListener('click', () => {
    sortButton.style.display = 'none';
    sortButton2.style.display = 'none';
    sortButton3.style.display = 'none';
    sortButton4.style.display = 'none';
    sortButton5.style.display = 'none';
    sortButton6.style.display = 'none';
    sortButton7.style.display = 'none';
    p2.style.display = 'none';
    const team_name_term = team_name_input.value;
    if(team_name_input.value !== '')
    {
    handleButtonClick(`/getTeamData?term=${team_name_term}`);
    }
    else
    {
    dataTable.innerHTML = '';
    errorMessage.textContent = 'Помилка. Ви не ввели команду';
    }
    
});

showAllTeamButton.addEventListener('click', () => {
    sortButton.style.display = 'block';
    sortButton2.style.display = 'block';
    sortButton3.style.display = 'block';
    sortButton4.style.display = 'block';
    sortButton5.style.display = 'block';
    sortButton6.style.display = 'block';
    sortButton7.style.display = 'block';
    p2.style.display = 'block';
    handleButtonClick(`/getAllTeamData`);
});

sortButton.addEventListener('click', () => {
    handleButtonClick(`/getSortButton`);
});

sortButton2.addEventListener('click', () => {
    handleButtonClick(`/getSortButton2`);
});

sortButton3.addEventListener('click', () => {
    handleButtonClick(`/getSortButton3`);
});

sortButton4.addEventListener('click', () => {
    handleButtonClick(`/getSortButton4`);
});

sortButton5.addEventListener('click', () => {
    handleButtonClick(`/getSortButton5`);
});

sortButton6.addEventListener('click', () => {
    handleButtonClick(`/getSortButton6`);
});

sortButton7.addEventListener('click', () => {
    handleButtonClick(`/getSortButton7`);
});





