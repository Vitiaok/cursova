const showPlayerButton = document.getElementById('find_player');
const player_name_input = document.getElementById('player_name');
const showAllPlayerButton = document.getElementById('find_all_players');
const hiddenButtons = document.querySelectorAll('.hidden-button');
const errorMessage = document.getElementById('errorMessage');
const dataTable = document.getElementById('dataTable');
const par = document.getElementById('par');

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
        const headers = [
          'Футболіст',
          'Кількість забитих голів',
          'Кількість забитих пенальті',
          'Кількість забитих автоголів'
        ];

        headers.forEach(headerText => {
          const th = document.createElement('th');
          th.textContent = headerText;
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
      console.error('Помилка пошуку:', error);
    });
}

showPlayerButton.addEventListener('click', () => {
  hiddenButtons.forEach(button => button.style.display = 'none');
  par.style.display = 'none';
  const player_name_term = player_name_input.value;
  if (player_name_input.value !== '') {
    handleButtonClick(`/getPlayerData?term=${player_name_term}`);
  } else {
    dataTable.innerHTML = '';
    errorMessage.textContent = 'Помилка. Ви не ввели гравця';
  }
});

showAllPlayerButton.addEventListener('click', () => {
  hiddenButtons.forEach(button => button.style.display = 'block');
  par.style.display = 'block';
  handleButtonClick(`/getAllPlayerData`);
});

hiddenButtons.forEach(button => {
  button.addEventListener('click', () => {
    const endpoint = `/get${button.id}Data`;
    handleButtonClick(endpoint);
  });
});

