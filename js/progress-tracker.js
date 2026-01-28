// ========================================
// PROGRESS TRACKER & GAMIFICATION
// Manages stars, badges, levels, and rewards
// ========================================

class ProgressTracker {
    constructor() {
        this.totalStars = 0;
        this.badges = [];
        this.completedGames = [];
        this.sessionStartTime = Date.now();
        this.loadProgress();
    }

    // Add stars
    addStars(amount) {
        this.totalStars += amount;
        this.saveProgress();
        this.animateStars(amount);
        this.checkBadgeUnlocks();
    }

    // Animate star gain
    animateStars(amount) {
        const starDisplay = document.getElementById('star-count');
        if (starDisplay) {
            starDisplay.textContent = this.totalStars;
            starDisplay.classList.add('pulse');
            setTimeout(() => starDisplay.classList.remove('pulse'), 600);
        }

        // Show floating stars
        this.showFloatingStars(amount);
    }

    showFloatingStars(amount) {
        const container = document.createElement('div');
        container.className = 'floating-stars';
        container.textContent = `+${amount} ⭐`;
        document.body.appendChild(container);

        setTimeout(() => container.remove(), 2000);
    }

    // Badge system
    checkBadgeUnlocks() {
        const badgeDefinitions = [
            { id: 'first-star', name: 'First Star', requirement: 1, icon: '⭐' },
            { id: 'star-collector', name: 'Star Collector', requirement: 50, icon: '🌟' },
            { id: 'star-master', name: 'Star Master', requirement: 100, icon: '✨' },
            { id: 'eco-warrior', name: 'Eco Warrior', requirement: 'eco-complete', icon: '🌍' },
            { id: 'safety-champion', name: 'Safety Champion', requirement: 'safety-complete', icon: '🛡️' },
            { id: 'perfect-score', name: 'Perfect Score', requirement: 'perfect', icon: '💯' }
        ];

        badgeDefinitions.forEach(badge => {
            if (!this.hasBadge(badge.id)) {
                if (this.checkBadgeRequirement(badge)) {
                    this.unlockBadge(badge);
                }
            }
        });
    }

    checkBadgeRequirement(badge) {
        if (typeof badge.requirement === 'number') {
            return this.totalStars >= badge.requirement;
        }

        if (badge.requirement === 'eco-complete') {
            return this.completedGames.includes('eco-hero-quest');
        }

        if (badge.requirement === 'safety-complete') {
            return this.completedGames.includes('safety-shield');
        }

        if (badge.requirement === 'perfect') {
            // Check if any game was completed with 100% accuracy
            const gameData = this.getGameData();
            return gameData.some(game => game.accuracy === 100);
        }

        return false;
    }

    unlockBadge(badge) {
        this.badges.push({
            id: badge.id,
            name: badge.name,
            icon: badge.icon,
            unlockedAt: Date.now()
        });

        this.saveProgress();
        this.showBadgeUnlock(badge);
    }

    showBadgeUnlock(badge) {
        const modal = document.createElement('div');
        modal.className = 'badge-unlock-modal';
        modal.innerHTML = `
            <div class="badge-unlock-content">
                <div class="badge-icon-large">${badge.icon}</div>
                <h2>Badge Unlocked!</h2>
                <h3>${badge.name}</h3>
                <button class="btn btn-primary" onclick="this.closest('.badge-unlock-modal').remove()">
                    Awesome!
                </button>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 100);
    }

    hasBadge(badgeId) {
        return this.badges.some(b => b.id === badgeId);
    }

    // Complete a game
    completeGame(gameId, score, accuracy) {
        if (!this.completedGames.includes(gameId)) {
            this.completedGames.push(gameId);
        }

        // Store game data
        const gameData = {
            id: gameId,
            score: score,
            accuracy: accuracy,
            completedAt: Date.now()
        };

        const allGames = this.getGameData();
        const existingIndex = allGames.findIndex(g => g.id === gameId);

        if (existingIndex >= 0) {
            // Update if better score
            if (score > allGames[existingIndex].score) {
                allGames[existingIndex] = gameData;
            }
        } else {
            allGames.push(gameData);
        }

        localStorage.setItem('gameData', JSON.stringify(allGames));
        this.saveProgress();
        this.checkBadgeUnlocks();
    }

    getGameData() {
        const saved = localStorage.getItem('gameData');
        return saved ? JSON.parse(saved) : [];
    }

    // Session time tracking
    getSessionDuration() {
        return Math.floor((Date.now() - this.sessionStartTime) / 1000); // in seconds
    }

    getFormattedSessionTime() {
        const seconds = this.getSessionDuration();
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    }

    // Progress percentage
    getOverallProgress() {
        const totalGames = 2; // eco-hero-quest and safety-shield
        return Math.round((this.completedGames.length / totalGames) * 100);
    }

    // Save and load
    saveProgress() {
        const data = {
            totalStars: this.totalStars,
            badges: this.badges,
            completedGames: this.completedGames,
            lastPlayed: Date.now()
        };

        localStorage.setItem('progressData', JSON.stringify(data));
    }

    loadProgress() {
        const saved = localStorage.getItem('progressData');
        if (saved) {
            const data = JSON.parse(saved);
            this.totalStars = data.totalStars || 0;
            this.badges = data.badges || [];
            this.completedGames = data.completedGames || [];
        }
    }

    reset() {
        this.totalStars = 0;
        this.badges = [];
        this.completedGames = [];
        localStorage.removeItem('progressData');
        localStorage.removeItem('gameData');
    }

    // Get summary for parent dashboard
    getSummary() {
        return {
            totalStars: this.totalStars,
            badgesEarned: this.badges.length,
            gamesCompleted: this.completedGames.length,
            sessionTime: this.getFormattedSessionTime(),
            overallProgress: this.getOverallProgress(),
            badges: this.badges,
            gameData: this.getGameData()
        };
    }
}

// Export for use in other files
window.ProgressTracker = ProgressTracker;
