// Audio Management
let audioContext;
let backgroundMusic;

function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        loadBackgroundMusic();
    } catch (e) {
        console.warn('Web Audio API not supported');
    }
}

function loadBackgroundMusic() {
    backgroundMusic = document.getElementById('background-music');
    if (backgroundMusic) {
        backgroundMusic.volume = 0.3;
        // Note: Actual audio file needs to be provided
    }
}

function playAmbientMusic() {
    if (backgroundMusic && backgroundMusic.paused) {
        backgroundMusic.play().catch(e => console.log('Audio play failed:', e));
    }
}

function pauseAmbientMusic() {
    if (backgroundMusic && !backgroundMusic.paused) {
        backgroundMusic.pause();
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initAudio);
