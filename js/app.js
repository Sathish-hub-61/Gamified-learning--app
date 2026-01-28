// App State
let currentScreen = 'welcome';
let selectedAge = null;
let progress = 0;
let stars = 3;
let topicsCompleted = 0;
let timeSpent = 0;
let sessionStart = Date.now();

// DOM Elements
const screens = document.querySelectorAll('.screen');
const consentCheckbox = document.getElementById('consent-checkbox');
const startBtn = document.getElementById('start-btn');
const ageBtns = document.querySelectorAll('.age-btn');
const gameContent = document.getElementById('game-content');
const nextBtn = document.getElementById('next-btn');
const progressFill = document.getElementById('progress-fill');
const starsEl = document.getElementById('stars');
const muteBtn = document.getElementById('mute-btn');
const topicsCompletedEl = document.getElementById('topics-completed');
const timeSpentEl = document.getElementById('time-spent');
const backToAppBtn = document.getElementById('back-to-app');

// Initialize
document.addEventListener('DOMContentLoaded', init);

function init() {
    setupEventListeners();
    updateUI();
}

function setupEventListeners() {
    consentCheckbox.addEventListener('change', toggleStartBtn);
    startBtn.addEventListener('click', goToAgeSelection);
    ageBtns.forEach(btn => btn.addEventListener('click', selectAge));
    nextBtn.addEventListener('click', nextGameStep);
    muteBtn.addEventListener('click', toggleMute);
    backToAppBtn.addEventListener('click', goToAgeSelection);
}

function toggleStartBtn() {
    startBtn.disabled = !consentCheckbox.checked;
}

function goToAgeSelection() {
    switchScreen('age-selection');
}

function selectAge(e) {
    selectedAge = e.target.dataset.age;
    switchScreen('game-screen');
    startGame();
}

function switchScreen(screenId) {
    screens.forEach(screen => screen.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    currentScreen = screenId;
    updateUI();
}

function updateUI() {
    document.body.className = selectedAge ? `age-${selectedAge.replace('-', '-')}` : '';
    progressFill.style.width = `${progress}%`;
    starsEl.textContent = '⭐'.repeat(stars);
    topicsCompletedEl.textContent = topicsCompleted;
    timeSpentEl.textContent = `${Math.floor(timeSpent / 60)} min`;
}

function startGame() {
    progress = 0;
    stars = 3;
    loadGameContent();
    updateUI();
}

function loadGameContent() {
    // This will be handled by games.js
    renderCurrentGame();
}

function nextGameStep() {
    // Handle game progression
    progress += 33;
    if (progress >= 100) {
        topicsCompleted++;
        progress = 0;
        // Show completion
        gameContent.innerHTML = '<h2>Great job! Module completed!</h2><p>You earned a badge! 🏆</p>';
        nextBtn.textContent = 'Next Module';
    } else {
        loadGameContent();
    }
    updateUI();
}

function toggleMute() {
    const audio = document.getElementById('background-music');
    if (audio.paused) {
        audio.play();
        muteBtn.textContent = '🔊';
    } else {
        audio.pause();
        muteBtn.textContent = '🔇';
    }
}

// Update time spent every minute
setInterval(() => {
    timeSpent++;
    updateUI();
}, 60000);
