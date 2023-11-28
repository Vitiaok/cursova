const showPlayerButton = document.getElementById('find_player');
const player_name_input = document.getElementById('player_name');
const showAllPlayerButton = document.getElementById('find_all_players');
const hiddenButton = document.getElementById('hiddenButton');
const hiddenButton2 = document.getElementById('hiddenButton2');
const hiddenButton3 = document.getElementById('hiddenButton3');
const hiddenButton4 = document.getElementById('hiddenButton4');
const p = document.getElementById('par');

function handleButtonClick(endpoint) {
    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            dataTable.innerHTML = '';

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
                dataTable.innerHTML = '<p>Цей гравець ще не забив жодного голу</p>';
            }
        })
        .catch(error => {
            console.error('Error searching data:', error);
        });
}


showPlayerButton.addEventListener('click', () => {
    hiddenButton.style.display = 'none';
    hiddenButton2.style.display = 'none';
    hiddenButton3.style.display = 'none';
    hiddenButton4.style.display = 'none';
    p.style.display = 'none';
    const player_name_term = player_name_input.value;
    handleButtonClick(`/getPlayerData?term=${player_name_term}`);
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

