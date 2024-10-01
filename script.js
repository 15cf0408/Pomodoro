let isRunning = false; // Tracks whether the timer is running
let isWorkPhase = true; // Tracks if it's currently the work phase or break phase
let workTime = 10;  // Default work time in seconds (10 minutes here, but typically 25 minutes)
let breakTime = 5 * 60;  // Default break time in seconds (5 minutes)
let time = workTime; // Sets the initial time to the work time
let timerInterval; // Will hold the interval for the countdown

// Access the DOM elements for displaying the timer and phase (work/break)
const timerDisplay = document.getElementById('timer');
const phaseDisplay = document.getElementById('phase');
const startResetButton = document.getElementById('start-reset'); // Button to start/reset the timer

// Function to interpolate between two colors (from red to green)
function interpolateColor(color1, color2, factor) {
  if (factor === undefined) factor = 0.5;
  
  const result = color1.slice(); // Make a copy of the first color
  for (let i = 0; i < 3; i++) {
    // Interpolate between the red (color1) and green (color2)
    result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
  }
  return result;
}

// Convert the RGB array to CSS-friendly 'rgb()' string
function rgbToCssString(rgb) {
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

// RGB values for red and green
const redColor = [184, 67, 67]; // Initial color (red: #b84343)
const greenColor = [120, 255, 120]; // Final color (green: #b0f2b6)

// Function to update background color based on remaining time
function updateBackgroundColor() {
  let totalTime = isWorkPhase ? workTime : breakTime;
  let remainingTime = time;

  // Calculate the interpolation factor (from 0 to 1 as time decreases)
  const factor = remainingTime / totalTime;

  // Get the interpolated color between red and green
  const interpolatedColor = interpolateColor(redColor, greenColor, 1 - factor);

  // Set the background color based on the interpolated color
  document.body.style.backgroundColor = rgbToCssString(interpolatedColor);
}

function updateTimerDisplay() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  
  // Update the background color as the time decreases
  updateBackgroundColor();
}

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    timerInterval = setInterval(() => {
      if (time > 0) {
        time--;
        updateTimerDisplay(); // Update the timer and background color
      } else {
        // Switch between work and break phases
        if (isWorkPhase) {
          time = breakTime;
          phaseDisplay.textContent = "Break";
          isWorkPhase = false;
        } else {
          time = workTime;
          phaseDisplay.textContent = "Work Phase";
          isWorkPhase = true;
        }
        updateTimerDisplay(); // Update immediately after switching phases
      }
    }, 1000);
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  isWorkPhase = true;
  time = workTime;
  updateTimerDisplay(); // Reset the timer and color to initial state
  document.body.style.backgroundColor = rgbToCssString(redColor); // Reset to red
}

// Initialize the timer display on page load
updateTimerDisplay();


// Event listener for the start/reset button
startResetButton.addEventListener('click', () => {
  if (isRunning) {
    resetTimer(); // If the timer is running, reset it
    startResetButton.innerHTML = '<span class="fa-solid fa-play fa-bounce"></span>'; // Change button icon to play
  } else {
    startTimer(); // If the timer is not running, start it
    phaseDisplay.innerHTML = "Work Phase"; // Set phase text to work
    startResetButton.innerHTML = '<span class="fa-solid fa-arrow-rotate-left fa-bounce"></span>'; // Change button icon to reset
    document.body.style.backgroundColor = "#b84343"; // Set background to work color (red)
  }
});

// Initialize the timer display on page load
updateTimerDisplay();

// Get the elements for the settings modal and form
const settingsIcon = document.getElementById('settings-icon');
const settingsForm = document.getElementById('settings-form');
const workDurationInput = document.getElementById('work-duration');
const breakDurationInput = document.getElementById('break-duration');

// Function to initialize durations based on saved data in localStorage or default values
function initializeDurations() {
  const savedWorkTime = localStorage.getItem('workTime'); // Get saved work time from localStorage
  const savedBreakTime = localStorage.getItem('breakTime'); // Get saved break time from localStorage

  workTime = savedWorkTime ? parseInt(savedWorkTime) * 60 : 25 * 60; // Set work time from localStorage or default to 25 minutes
  breakTime = savedBreakTime ? parseInt(savedBreakTime) * 60 : 5 * 60; // Set break time from localStorage or default to 5 minutes

  workDurationInput.value = savedWorkTime ? parseInt(savedWorkTime) : 25; // Display saved work time in input or default to 25 minutes
  breakDurationInput.value = savedBreakTime ? parseInt(savedBreakTime) : 5; // Display saved break time in input or default to 5 minutes
  time = workTime;  // Set initial time to work time
  updateTimerDisplay(); // Update the timer display
}

// Function to save the new durations and validate them
function saveDurationsToLocalStorage() {
  const workDuration = parseInt(workDurationInput.value); // Get work duration input
  const breakDuration = parseInt(breakDurationInput.value); // Get break duration input

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

// Get the modal and close button elements
const modal = document.getElementById('settings-modal');
const closeModalButton = document.querySelector('.close');

// Function to open the modal
function openModal() {
  modal.style.display = 'flex';  // Show the modal
}

// Function to close the modal
function closeModal() {
  modal.style.display = 'none';  // Hide the modal
}

// When the user clicks the settings icon, open the modal
settingsIcon.addEventListener('click', openModal);

// When the user clicks the close button (X), close the modal
closeModalButton.addEventListener('click', closeModal);

// Close the modal if the user clicks outside the modal content
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal(); // Close modal if clicked outside
  }
});

// Initialize durations on page load
initializeDurations();
