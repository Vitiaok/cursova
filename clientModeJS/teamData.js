const showTeamButton = document.getElementById('find_team');
const team_name_input = document.getElementById('team_name');
const showAllTeamButton = document.getElementById('find_all_teams');
const sortButtons = document.querySelectorAll('.sort-button');
const errorMessage = document.getElementById('errorMessage');
const dataTable = document.getElementById('dataTable');
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
        const headers = [
          'Команда',
          'Середня кількість забитих голів',
          'Середня кількість володіння м\'ячем',
          'Середня кількість ударів',
          'Середня кількість ударів по воротах',
          'Середня кількість атак',
          'Середня кількість небезпечних атак'
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
      }
    })
    .catch(error => {
      console.error('Помилка пошуку:', error);
    });
}

showTeamButton.addEventListener('click', () => {
  sortButtons.forEach(button => button.style.display = 'none');
  p2.style.display = 'none';
  const team_name_term = team_name_input.value;
  if (team_name_input.value !== '') {
    handleButtonClick(`/getTeamData?term=${team_name_term}`);
  } else {
    dataTable.innerHTML = '';
    errorMessage.textContent = 'Помилка. Ви не ввели команду';
  }
});

showAllTeamButton.addEventListener('click', () => {
  sortButtons.forEach(button => button.style.display = 'block');
  p2.style.display = 'block';
  handleButtonClick(`/getAllTeamData`);
});

sortButtons.forEach(button => {
  button.addEventListener('click', () => {
    const endpoint = `/getSortButton${button.id.replace('sortButton', '')}`;
    handleButtonClick(endpoint);
  });
});






