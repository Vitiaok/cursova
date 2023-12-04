const showMatchDataButton = document.getElementById('button3');
const showTeamDataButton = document.getElementById('button1');
const showPlayerDataButton = document.getElementById('button2');
const adminModeButton = document.getElementById('button4');

showMatchDataButton.addEventListener('click', () => {
    window.location.href = '/clientmodeHTML/index2.html';
});

showTeamDataButton.addEventListener('click', () => {
    window.location.href = '/clientmodeHTML/index3.html';
});

showPlayerDataButton.addEventListener('click', () => {
    window.location.href = '/clientmodeHTML/index4.html';
});

adminModeButton.addEventListener('click', () => {
    window.location.href = '/adminModeHTML/index5.html';
});





