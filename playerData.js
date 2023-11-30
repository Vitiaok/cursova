const showPlayerButton = document.getElementById('find_player');
const player_name_input = document.getElementById('player_name');
const showAllPlayerButton = document.getElementById('find_all_players');
const hiddenButton = document.getElementById('hiddenButton');
const hiddenButton2 = document.getElementById('hiddenButton2');
const hiddenButton3 = document.getElementById('hiddenButton3');
const hiddenButton4 = document.getElementById('hiddenButton4');
const p = document.getElementById('par');

function handleButtonClick(endpoint) {
    
    errorMessage.textContent = '';
    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            dataTable.innerHTML = '';
            
           
                if (data.error) {
                    dataTable.innerHTML = `<p>Цього гравця не існує або він не грає в УПЛ</p>`;
                } else if (data.length > 0) {
                    const headerRow = document.createElement('tr');
                    const th1 = document.createElement('th');
                    const th2 = document.createElement('th');
                    const th3 = document.createElement('th');
                    const th4 = document.createElement('th');
                    th1.textContent = 'Футболіст';
                    th2.textContent = 'Кількість забитих голів';
                    th3.textContent = 'Кількість забитих пенальті';
                    th4.textContent = 'Кількість забитих автоголів';
        
                    headerRow.appendChild(th1);
                    headerRow.appendChild(th2);
                    headerRow.appendChild(th3);
                    headerRow.appendChild(th4);
                    
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
                    dataTable.innerHTML = '<p>Цей гравець ще не забив жодного голу</p>';
                }         
                 
    
        
        
        })
        .catch(error => {
            console.error('Помилка пошуку:', error);
        });
}


showPlayerButton.addEventListener('click', () => {
    hiddenButton.style.display = 'none';
    hiddenButton2.style.display = 'none';
    hiddenButton3.style.display = 'none';
    hiddenButton4.style.display = 'none';
    p.style.display = 'none';
    const player_name_term = player_name_input.value;
    if(player_name_input.value !== '')
    {
     handleButtonClick(`/getPlayerData?term=${player_name_term}`);
    }
    else
    {
    dataTable.innerHTML = '';
    errorMessage.textContent = 'Помилка. Ви не ввели гравця';
    }
    
});

showAllPlayerButton.addEventListener('click', () => {
    hiddenButton.style.display = 'block';
    hiddenButton2.style.display = 'block';
    hiddenButton3.style.display = 'block';
    hiddenButton4.style.display = 'block';
    p.style.display = 'block';
    
    handleButtonClick(`/getAllPlayerData`);
    
});

hiddenButton.addEventListener('click', () => {
    handleButtonClick(`/getHiddenButtonData`);
});

hiddenButton2.addEventListener('click', () => {
    handleButtonClick(`/getHiddenButton2Data`);
});

hiddenButton3.addEventListener('click', () => {
    handleButtonClick(`/getHiddenButton3Data`);
});

hiddenButton4.addEventListener('click', () => {
    handleButtonClick(`/getHiddenButton4Data`);
});

