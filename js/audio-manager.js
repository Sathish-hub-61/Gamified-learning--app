// ========================================
// AUDIO MANAGER
// Handles background music and sound effects
// ========================================

class AudioManager {
    constructor() {
        this.isMuted = false;
        this.backgroundMusic = null;
        this.soundEffects = {};
        this.loadSettings();
    }

    // Initialize background music
    initBackgroundMusic(type = 'forest') {
        // Note: In production, replace with actual audio files
        // For now, we'll use the Web Audio API to create ambient sounds

        this.backgroundMusic = {
            type: type,
            playing: false
        };

        // Load mute state
        if (!this.isMuted) {
            this.playBackgroundMusic();
        }
    }

    playBackgroundMusic() {
        if (this.isMuted) return;

        // In production, this would play actual audio files
        // For demo purposes, we'll just track the state
        if (this.backgroundMusic) {
            this.backgroundMusic.playing = true;
            console.log(`Playing ${this.backgroundMusic.type} ambient music`);
        }
    }

    pauseBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.playing = false;
            console.log('Background music paused');
        }
    }

    // Sound effects
    playSound(soundType) {
        if (this.isMuted) return;

        // Sound types: 'correct', 'wrong', 'click', 'success', 'levelup', 'badge'
        console.log(`Playing sound: ${soundType}`);

        // In production, play actual sound files
        // For now, we'll create visual feedback
        this.createSoundFeedback(soundType);
    }

    createSoundFeedback(soundType) {
        const feedback = document.createElement('div');
        feedback.className = 'sound-feedback';

        const icons = {
            'correct': '✓',
            'wrong': '✗',
            'click': '👆',
            'success': '🎉',
            'levelup': '⬆️',
            'badge': '🏆'
        };

        feedback.textContent = icons[soundType] || '🔊';
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            font-size: 2rem;
            animation: soundPop 0.5s ease;
            pointer-events: none;
            z-index: 9999;
        `;

        document.body.appendChild(feedback);
        setTimeout(() => feedback.remove(), 500);
    }

    // Toggle mute
    toggleMute() {
        this.isMuted = !this.isMuted;
        this.saveSettings();

        if (this.isMuted) {
            this.pauseBackgroundMusic();
        } else {
            this.playBackgroundMusic();
        }

        this.updateMuteButton();
        return this.isMuted;
    }

    updateMuteButton() {
        const muteBtn = document.getElementById('mute-toggle');
        if (muteBtn) {
            muteBtn.textContent = this.isMuted ? '🔇' : '🔊';
            muteBtn.setAttribute('aria-label', this.isMuted ? 'Unmute' : 'Mute');
        }
    }

    // Persistence
    saveSettings() {
        localStorage.setItem('audioSettings', JSON.stringify({
            isMuted: this.isMuted
        }));
    }

    loadSettings() {
        const saved = localStorage.getItem('audioSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            this.isMuted = settings.isMuted || false;
        }
    }

    // Preload sounds (for production)
    preloadSounds() {
        const soundFiles = [
            'correct.mp3',
            'wrong.mp3',
            'click.mp3',
            'success.mp3',
            'levelup.mp3',
            'badge.mp3'
        ];

        // In production, load actual audio files
        soundFiles.forEach(file => {
            console.log(`Preloading sound: ${file}`);
            // this.soundEffects[file] = new Audio(`assets/audio/${file}`);
        });
    }
}

// Add CSS animation for sound feedback
const style = document.createElement('style');
style.textContent = `
    @keyframes soundPop {
        0% {
            transform: scale(0);
            opacity: 0;
        }
        50% {
            transform: scale(1.2);
            opacity: 1;
        }
        100% {
            transform: scale(1);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export for use in other files
window.AudioManager = AudioManager;
