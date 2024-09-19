let timer;
let isPaused = false;
let minutes = 25;
let seconds = 0;
let workDuration = 25; // Valeur par défaut
let breakDuration = 5; // Valeur par défaut

const startButton = document.getElementById('start-btn');
const pauseButton = document.getElementById('pause-btn');
const resetButton = document.getElementById('reset-btn');
const workDurationInput = document.getElementById('work-duration');
const breakDurationInput = document.getElementById('break-duration');
const settingsForm = document.getElementById('settings-form');

// Charger les durées depuis localStorage si elles existent
if (localStorage.getItem('workDuration')) {
    workDuration = parseInt(localStorage.getItem('workDuration'));
    workDurationInput.value = workDuration;
}
if (localStorage.getItem('breakDuration')) {
    breakDuration = parseInt(localStorage.getItem('breakDuration'));
    breakDurationInput.value = breakDuration;
}
updateDisplay();

settingsForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // Met à jour les durées personnalisées
    workDuration = parseInt(workDurationInput.value);
    breakDuration = parseInt(breakDurationInput.value);
    
    // Enregistre les nouvelles valeurs dans localStorage
    localStorage.setItem('workDuration', workDuration);
    localStorage.setItem('breakDuration', breakDuration);
    
    // Réinitialise le timer avec les nouvelles valeurs
    resetTimer();
});

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);

function startTimer() {
    if (!isPaused) {
        minutes = workDuration; // Utilise la durée de travail définie
        seconds = 0;
    }
    timer = setInterval(updateTimer, 1000);
    isPaused = false;
}

function pauseTimer() {
    clearInterval(timer);
    isPaused = true;
}

function resetTimer() {
    clearInterval(timer);
    minutes = workDuration; // Réinitialise avec la durée de travail définie
    seconds = 0;
    updateDisplay();
}

function updateTimer() {
    if (seconds === 0) {
        if (minutes === 0) {
            clearInterval(timer);
            alert("Le temps de travail est terminé, passez à la pause !");
            minutes = breakDuration; // Passe au temps de pause
            seconds = 0;
            return;
        } else {
            minutes--;
            seconds = 59;
        }
    } else {
        seconds--;
    }
    updateDisplay();
}

function updateDisplay() {
    document.getElementById('minutes').textContent = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('seconds').textContent = seconds < 10 ? '0' + seconds : seconds;
}
