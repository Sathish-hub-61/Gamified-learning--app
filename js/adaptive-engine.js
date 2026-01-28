// ========================================
// ADAPTIVE LEARNING ENGINE
// Adjusts difficulty based on performance
// ========================================

class AdaptiveEngine {
    constructor() {
        this.consecutiveCorrect = 0;
        this.consecutiveWrong = 0;
        this.currentLevel = 1;
        this.maxLevel = 5;
        this.performanceHistory = [];
    }

    // Record answer and adjust difficulty
    recordAnswer(isCorrect) {
        this.performanceHistory.push({
            correct: isCorrect,
            timestamp: Date.now(),
            level: this.currentLevel
        });

        if (isCorrect) {
            this.consecutiveCorrect++;
            this.consecutiveWrong = 0;

            // Two correct in a row: increase difficulty
            if (this.consecutiveCorrect >= 2 && this.currentLevel < this.maxLevel) {
                this.levelUp();
            }
        } else {
            this.consecutiveWrong++;
            this.consecutiveCorrect = 0;

            // Two wrong in a row: decrease difficulty
            if (this.consecutiveWrong >= 2 && this.currentLevel > 1) {
                this.levelDown();
            }
        }

        this.saveProgress();
    }

    levelUp() {
        this.currentLevel++;
        this.consecutiveCorrect = 0;
        console.log(`Level increased to ${this.currentLevel}`);

        // Show level up notification
        this.showLevelNotification('Level Up! 🎉', 'You\'re doing great!');
    }

    levelDown() {
        this.currentLevel--;
        this.consecutiveWrong = 0;
        console.log(`Level decreased to ${this.currentLevel}`);

        // Show encouraging message
        this.showLevelNotification('Let\'s try something easier', 'You\'ve got this! 💪');
    }

    showLevelNotification(title, message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'level-notification';
        notification.innerHTML = `
            <h3>${title}</h3>
            <p>${message}</p>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    getCurrentLevel() {
        return this.currentLevel;
    }

    getAccuracy() {
        if (this.performanceHistory.length === 0) return 0;

        const correct = this.performanceHistory.filter(h => h.correct).length;
        return Math.round((correct / this.performanceHistory.length) * 100);
    }

    saveProgress() {
        const data = {
            level: this.currentLevel,
            consecutiveCorrect: this.consecutiveCorrect,
            consecutiveWrong: this.consecutiveWrong,
            history: this.performanceHistory
        };

        localStorage.setItem('adaptiveProgress', JSON.stringify(data));
    }

    loadProgress() {
        const saved = localStorage.getItem('adaptiveProgress');
        if (saved) {
            const data = JSON.parse(saved);
            this.currentLevel = data.level || 1;
            this.consecutiveCorrect = data.consecutiveCorrect || 0;
            this.consecutiveWrong = data.consecutiveWrong || 0;
            this.performanceHistory = data.history || [];
        }
    }

    reset() {
        this.consecutiveCorrect = 0;
        this.consecutiveWrong = 0;
        this.currentLevel = 1;
        this.performanceHistory = [];
        localStorage.removeItem('adaptiveProgress');
    }
}

// Export for use in other files
window.AdaptiveEngine = AdaptiveEngine;
