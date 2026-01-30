// ========================================
// AUDIO MANAGER
// Handles background music and sound effects with persistence
// ========================================

class AudioManager {
    constructor() {
        this.isMuted = false;
        this.bgMusicElement = null;
        this.playlist = [
            'assets/audio/audio1.mpeg',
            'assets/audio/audio2.mpeg',
            'assets/audio/audio3.mpeg',
            'assets/audio/audio4.mpeg',
            'assets/audio/audio5.mpeg'
        ];
        this.shuffledPlaylist = [];
        this.currentIndex = -1;
        this.loadSettings();
        this.initAudioElement();
    }

    initAudioElement() {
        // Create actual audio element
        this.bgMusicElement = new Audio();
        this.bgMusicElement.loop = false; // We want to handle "onended" for shuffling
        this.bgMusicElement.volume = 0.3; // Default background volume

        // Listener for song end
        this.bgMusicElement.onended = () => {
            this.playNextTrack();
        };

        // Handle browser's autoplay policies - start when user interacts
        const startAudio = () => {
            if (!this.isMuted && this.bgMusicElement.paused && this.bgMusicElement.src) {
                this.playBackgroundMusic();
            }
            document.removeEventListener('click', startAudio);
            document.removeEventListener('touchstart', startAudio);
        };
        document.addEventListener('click', startAudio);
        document.addEventListener('touchstart', startAudio);
    }

    // Initialize background music
    initBackgroundMusic() {
        // Load persistent state if exists
        const savedTrack = localStorage.getItem('currentTrackLocal');
        const savedTime = localStorage.getItem('currentTrackTime');

        if (savedTrack && this.playlist.some(p => savedTrack.includes(p))) {
            this.currentIndex = this.playlist.findIndex(p => savedTrack.includes(p));
            this.bgMusicElement.src = savedTrack;
            this.bgMusicElement.currentTime = parseFloat(savedTime) || 0;
        } else {
            this.shufflePlaylist();
            this.playNextTrack(false); // Don't autoplay immediately, initialization only
        }

        if (!this.isMuted) {
            // Attempt autoplay (might be blocked)
            this.playBackgroundMusic().catch(() => console.log("Waiting for user interaction for audio..."));
        }

        // Save progress periodically
        setInterval(() => {
            if (this.bgMusicElement && !this.bgMusicElement.paused) {
                localStorage.setItem('currentTrackLocal', this.bgMusicElement.src);
                localStorage.setItem('currentTrackTime', this.bgMusicElement.currentTime);
            }
        }, 1000);
    }

    shufflePlaylist() {
        this.shuffledPlaylist = [...this.playlist].sort(() => Math.random() - 0.5);
        this.currentIndex = 0;
    }

    playNextTrack(shouldPlay = true) {
        if (this.shuffledPlaylist.length === 0 || this.currentIndex >= this.shuffledPlaylist.length - 1) {
            this.shufflePlaylist();
        } else {
            this.currentIndex++;
        }

        const track = this.shuffledPlaylist[this.currentIndex];
        this.bgMusicElement.src = track;
        if (shouldPlay) {
            this.playBackgroundMusic();
        }
    }

    async playBackgroundMusic() {
        if (this.isMuted) return;
        try {
            await this.bgMusicElement.play();
        } catch (error) {
            // This is expected if user hasn't interacted yet
        }
    }

    pauseBackgroundMusic() {
        if (this.bgMusicElement) {
            this.bgMusicElement.pause();
        }
    }

    // Sound effects generating simple tones
    playSound(soundType) {
        if (this.isMuted) return;

        this.createSoundFeedback(soundType);

        try {
            const context = new (window.AudioContext || window.webkitAudioContext)();
            const osc = context.createOscillator();
            const gain = context.createGain();

            osc.connect(gain);
            gain.connect(context.destination);

            if (soundType === 'correct') {
                osc.frequency.setValueAtTime(800, context.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1200, context.currentTime + 0.1);
                gain.gain.setValueAtTime(0.1, context.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2);
                osc.start();
                osc.stop(context.currentTime + 0.2);
            } else if (soundType === 'wrong') {
                osc.frequency.setValueAtTime(300, context.currentTime);
                osc.frequency.linearRampToValueAtTime(100, context.currentTime + 0.2);
                gain.gain.setValueAtTime(0.1, context.currentTime);
                gain.gain.linearRampToValueAtTime(0.01, context.currentTime + 0.3);
                osc.start();
                osc.stop(context.currentTime + 0.3);
            } else if (soundType === 'click') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1000, context.currentTime);
                gain.gain.setValueAtTime(0.05, context.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.05);
                osc.start();
                osc.stop(context.currentTime + 0.05);
            }
        } catch (e) { }
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
        const muteBtns = document.querySelectorAll('#mute-toggle');
        muteBtns.forEach(btn => {
            btn.textContent = this.isMuted ? '🔇' : '🔊';
        });
    }

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
}

// Add CSS animation for sound feedback
const style = document.createElement('style');
style.textContent = `
    @keyframes soundPop {
        0% { transform: scale(0); opacity: 0; }
        50% { transform: scale(1.2); opacity: 1; }
        100% { transform: scale(1); opacity: 0; }
    }
`;
document.head.appendChild(style);

window.AudioManager = AudioManager;
