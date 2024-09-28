let isRunning = false;
let isWorkPhase = true;
let workTime = 10;  // 25 minutes
let breakTime = 5 * 60;  // 5 minutes
let time = workTime;
let timerInterval;

const timerDisplay = document.getElementById('timer');
const phaseDisplay = document.getElementById('phase');
const startResetButton = document.getElementById('start-reset');

function updateTimerDisplay() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    timerInterval = setInterval(() => {
      if (time > 0) {
        time--;
        updateTimerDisplay();
      } else {
        if (isWorkPhase) {
          time = breakTime;
          phaseDisplay.textContent = "Break";
          document.body.style.backgroundColor = "#99c5c4"; // Rouge pendant le travai
        } else {
          time = workTime;
          phaseDisplay.textContent = "Work Phase";
          document.body.style.backgroundColor = "#b84343"; // Rouge pendant le travai
        }
        isWorkPhase = !isWorkPhase;
      }
    }, 1000);
  }
}


function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  isWorkPhase = true;
  time = workTime;
  updateTimerDisplay();
  phaseDisplay.textContent = "Work Phase";
  document.body.style.backgroundColor = "#b84343";
}

startResetButton.addEventListener('click', () => {
  if (isRunning) {
    resetTimer();
    startResetButton.innerHTML = '<span class="fa-solid fa-play fa-bounce"></span>';
  } else {
    startTimer();
    phaseDisplay.innerHTML = "Work Phase";
    startResetButton.innerHTML = '<span class="fa-solid fa-arrow-rotate-left fa-bounce"></span>';
    document.body.style.backgroundColor = "#b84343";
  }
});



updateTimerDisplay();

// Récupération des éléments
const settingsIcon = document.getElementById('settings-icon');
const settingsForm = document.getElementById('settings-form');
const workDurationInput = document.getElementById('work-duration');
const breakDurationInput = document.getElementById('break-duration');

// Initialiser les durées en vérifiant LocalStorage
function initializeDurations() {
  const savedWorkTime = localStorage.getItem('workTime');
  const savedBreakTime = localStorage.getItem('breakTime');

  workTime = savedWorkTime ? parseInt(savedWorkTime) * 60 : 25 * 60;
  breakTime = savedBreakTime ? parseInt(savedBreakTime) * 60 : 5 * 60;

  workDurationInput.value = savedWorkTime ? parseInt(savedWorkTime) : 25;
  breakDurationInput.value = savedBreakTime ? parseInt(savedBreakTime) : 5;
  time = workTime;  // Initialiser avec le temps de travail par défaut ou personnalisé
  updateTimerDisplay();
}

// Function to save the new durations and validate them
function saveDurationsToLocalStorage() {
  const workDuration = parseInt(workDurationInput.value);
  const breakDuration = parseInt(breakDurationInput.value);

  // Check if the durations exceed the maximum limit of 200 minutes
  if (workDuration > 200 || breakDuration > 200) {
    alert("Duration cannot exceed 200 minutes."); // Display an alert if the limit is exceeded
    return; // Prevent saving if the limit is exceeded
  }

  // Save valid durations to localStorage
  localStorage.setItem('workTime', workDuration);
  localStorage.setItem('breakTime', breakDuration);

  // Update work and break times in seconds
  workTime = workDuration * 60;
  breakTime = breakDuration * 60;

  resetTimer(); // Reset the timer with the new values
  closeModal(); // Close the settings modal
}

// Event listener to handle form submission for settings
settingsForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent form reload
  saveDurationsToLocalStorage(); // Save settings
});


// Initialiser les valeurs au chargement
initializeDurations();



// Récupérer les éléments

const modal = document.getElementById('settings-modal');
const closeModalButton = document.querySelector('.close');

// Fonction pour afficher la modale
function openModal() {
  modal.style.display = 'flex';  // Affiche la modale
}

// Fonction pour fermer la modale
function closeModal() {
  modal.style.display = 'none';  // Masque la modale
}

// Lorsque l'utilisateur clique sur l'icône des paramètres, ouvrir la modale
settingsIcon.addEventListener('click', openModal);

// Lorsque l'utilisateur clique sur le bouton de fermeture (X), fermer la modale
closeModalButton.addEventListener('click', closeModal);

// Fermer la modale si l'utilisateur clique en dehors du contenu de la modale
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

// Sauvegarder les nouvelles valeurs dans LocalStorage
function saveDurationsToLocalStorage() {
  const workDuration = workDurationInput.value;
  const breakDuration = breakDurationInput.value;

  localStorage.setItem('workTime', workDuration);
  localStorage.setItem('breakTime', breakDuration);

  workTime = parseInt(workDuration) * 60;
  breakTime = parseInt(breakDuration) * 60;
  // Check if the durations exceed the maximum limit of 200 minutes
  if (workDuration > 200 || breakDuration > 200) {
    alert("Duration cannot exceed 200 minutes."); // Display an alert if the limit is exceeded
    return; // Prevent saving if the limit is exceeded
  }

  resetTimer();
  closeModal();  // Ferme la modale après avoir appliqué les réglages
}

// Gérer la soumission du formulaire
settingsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  saveDurationsToLocalStorage();
});

// Initialiser les durées en vérifiant LocalStorage
function initializeDurations() {
  const savedWorkTime = localStorage.getItem('workTime');
  const savedBreakTime = localStorage.getItem('breakTime');

  workTime = savedWorkTime ? parseInt(savedWorkTime) * 60 : 25 * 60;
  breakTime = savedBreakTime ? parseInt(savedBreakTime) * 60 : 5 * 60;

  workDurationInput.value = savedWorkTime ? parseInt(savedWorkTime) : 25;
  breakDurationInput.value = savedBreakTime ? parseInt(savedBreakTime) : 5;
  time = workTime;  // Initialiser avec le temps de travail par défaut ou personnalisé
  updateTimerDisplay();
}


// Initialiser les valeurs au chargement
initializeDurations();
