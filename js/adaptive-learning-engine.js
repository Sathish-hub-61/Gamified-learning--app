/**
 * Advanced Adaptive Learning Engine for PlayLearn
 * 
 * Implements PRD Section 6: Adaptive Learning Logic
 * 
 * Core Principles:
 * - Silent adaptation (no user notifications)
 * - Behavioral pattern recognition
 * - State-based difficulty adjustment
 * - Emotional safety first
 * 
 * Rules:
 * - 2 incorrect → Simplify
 * - 2 correct → Increase complexity
 * - No punishment, only gentle guidance
 */

class AdaptiveLearningEngine {
    constructor() {
        this.sessionData = {
            startTime: Date.now(),
            interactions: [],
            currentDifficulty: 'medium',
            ageGroup: null,
            consecutiveCorrect: 0,
            consecutiveIncorrect: 0,
            totalAttempts: 0,
            successRate: 0,
            frustrationLevel: 0,
            engagementScore: 100
        };

        this.difficultyLevels = {
            veryEasy: 1,
            easy: 2,
            medium: 3,
            hard: 4,
            veryHard: 5
        };

        this.adaptationRules = {
            '3-5': {
                incorrectThreshold: 2,
                correctThreshold: 3, // More success needed before advancing
                simplificationSteps: ['reduceChoices', 'addVisualHints', 'slowDownPace'],
                complexitySteps: ['addChoices', 'removeHints', 'increaseVariety']
            },
            '6-9': {
                incorrectThreshold: 2,
                correctThreshold: 2,
                simplificationSteps: ['provideHints', 'breakDownSteps', 'reduceComplexity'],
                complexitySteps: ['removeHints', 'addSteps', 'increaseComplexity']
            },
            '10-12': {
                incorrectThreshold: 2,
                correctThreshold: 2,
                simplificationSteps: ['addContext', 'provideExamples', 'simplifyScenarios'],
                complexitySteps: ['removeContext', 'addNuance', 'increaseConsequences']
            }
        };

        this.behavioralPatterns = {
            rushing: { detected: false, threshold: 3, actions: [] },
            hesitating: { detected: false, threshold: 5, actions: [] },
            fatigued: { detected: false, threshold: 10, actions: [] },
            mastered: { detected: false, threshold: 5, actions: [] }
        };
    }

    /**
     * Initialize for specific age group
     */
    initialize(ageGroup) {
        this.sessionData.ageGroup = ageGroup;
        this.sessionData.currentDifficulty = 'medium'; // Always start medium
        console.log(`🧠 Adaptive engine initialized for age group: ${ageGroup}`);
    }

    /**
     * Record an interaction
     * @param {Object} interaction - {type, correct, timeSpent, context}
     */
    recordInteraction(interaction) {
        const enrichedInteraction = {
            ...interaction,
            timestamp: Date.now(),
            difficulty: this.sessionData.currentDifficulty,
            sessionTime: Date.now() - this.sessionData.startTime
        };

        this.sessionData.interactions.push(enrichedInteraction);
        this.sessionData.totalAttempts++;

        // Update consecutive counters
        if (interaction.correct) {
            this.sessionData.consecutiveCorrect++;
            this.sessionData.consecutiveIncorrect = 0;
        } else {
            this.sessionData.consecutiveIncorrect++;
            this.sessionData.consecutiveCorrect = 0;
        }

        // Update success rate
        const correctCount = this.sessionData.interactions.filter(i => i.correct).length;
        this.sessionData.successRate = correctCount / this.sessionData.totalAttempts;

        // Analyze behavioral patterns
        this.analyzeBehavioralPatterns(enrichedInteraction);

        // Check if adaptation is needed
        this.evaluateAdaptation();

        // Update engagement score
        this.updateEngagementScore();

        console.log(`📊 Interaction recorded:`, {
            correct: interaction.correct,
            consecutiveCorrect: this.sessionData.consecutiveCorrect,
            consecutiveIncorrect: this.sessionData.consecutiveIncorrect,
            successRate: (this.sessionData.successRate * 100).toFixed(1) + '%',
            difficulty: this.sessionData.currentDifficulty
        });
    }

    /**
     * Analyze behavioral patterns from interaction data
     */
    analyzeBehavioralPatterns(interaction) {
        const recentInteractions = this.sessionData.interactions.slice(-10);

        // Detect rushing (very fast responses)
        const avgTimeSpent = recentInteractions.reduce((sum, i) => sum + (i.timeSpent || 0), 0) / recentInteractions.length;
        if (avgTimeSpent < 2000 && recentInteractions.length >= 3) {
            this.behavioralPatterns.rushing.detected = true;
            this.behavioralPatterns.rushing.actions = ['slowDownPace', 'addThinkingPrompts'];
        }

        // Detect hesitation (very slow responses)
        if (avgTimeSpent > 15000 && recentInteractions.length >= 3) {
            this.behavioralPatterns.hesitating.detected = true;
            this.behavioralPatterns.hesitating.actions = ['provideHints', 'simplifyChoices'];
        }

        // Detect fatigue (declining performance over time)
        if (recentInteractions.length >= 10) {
            const firstHalf = recentInteractions.slice(0, 5);
            const secondHalf = recentInteractions.slice(5);
            const firstHalfSuccess = firstHalf.filter(i => i.correct).length / 5;
            const secondHalfSuccess = secondHalf.filter(i => i.correct).length / 5;

            if (secondHalfSuccess < firstHalfSuccess - 0.3) {
                this.behavioralPatterns.fatigued.detected = true;
                this.sessionData.frustrationLevel++;
            }
        }

        // Detect mastery (consistent high performance)
        if (this.sessionData.consecutiveCorrect >= 5 && this.sessionData.successRate > 0.8) {
            this.behavioralPatterns.mastered.detected = true;
            this.behavioralPatterns.mastered.actions = ['increaseComplexity', 'unlockNewContent'];
        }
    }

    /**
     * Evaluate if adaptation is needed based on PRD rules
     */
    evaluateAdaptation() {
        const rules = this.adaptationRules[this.sessionData.ageGroup];
        if (!rules) return;

        // Rule 1: 2 incorrect in a row → Simplify
        if (this.sessionData.consecutiveIncorrect >= rules.incorrectThreshold) {
            this.simplifyExperience();
            this.sessionData.consecutiveIncorrect = 0; // Reset counter
        }

        // Rule 2: 2 correct in a row → Increase complexity
        if (this.sessionData.consecutiveCorrect >= rules.correctThreshold) {
            this.increaseComplexity();
            this.sessionData.consecutiveCorrect = 0; // Reset counter
        }

        // Additional: High frustration → Emergency simplification
        if (this.sessionData.frustrationLevel >= 3) {
            this.emergencySimplification();
        }
    }

    /**
     * Simplify the learning experience
     */
    simplifyExperience() {
        const rules = this.adaptationRules[this.sessionData.ageGroup];

        console.log('🔽 Simplifying experience (silent adaptation)');

        // Lower difficulty level
        const currentLevel = this.difficultyLevels[this.sessionData.currentDifficulty];
        if (currentLevel > 1) {
            const newDifficulty = Object.keys(this.difficultyLevels).find(
                key => this.difficultyLevels[key] === currentLevel - 1
            );
            this.sessionData.currentDifficulty = newDifficulty;
        }

        // Apply simplification steps
        const adaptations = {
            reduceChoices: true,
            addVisualHints: true,
            slowDownPace: true,
            provideHints: true,
            breakDownSteps: true,
            addContext: true,
            simplifyScenarios: true
        };

        // Store adaptations for game to apply
        this.sessionData.currentAdaptations = rules.simplificationSteps.reduce((acc, step) => {
            if (adaptations[step]) acc[step] = true;
            return acc;
        }, {});

        this.sessionData.frustrationLevel = Math.max(0, this.sessionData.frustrationLevel - 1);
    }

    /**
     * Increase complexity
     */
    increaseComplexity() {
        const rules = this.adaptationRules[this.sessionData.ageGroup];

        console.log('🔼 Increasing complexity (silent adaptation)');

        // Raise difficulty level
        const currentLevel = this.difficultyLevels[this.sessionData.currentDifficulty];
        if (currentLevel < 5) {
            const newDifficulty = Object.keys(this.difficultyLevels).find(
                key => this.difficultyLevels[key] === currentLevel + 1
            );
            this.sessionData.currentDifficulty = newDifficulty;
        }

        // Apply complexity steps
        const adaptations = {
            addChoices: true,
            removeHints: true,
            increaseVariety: true,
            addSteps: true,
            increaseComplexity: true,
            removeContext: true,
            addNuance: true,
            increaseConsequences: true
        };

        this.sessionData.currentAdaptations = rules.complexitySteps.reduce((acc, step) => {
            if (adaptations[step]) acc[step] = true;
            return acc;
        }, {});
    }

    /**
     * Emergency simplification when frustration is high
     */
    emergencySimplification() {
        console.log('🚨 Emergency simplification - child may be frustrated');

        this.sessionData.currentDifficulty = 'veryEasy';
        this.sessionData.currentAdaptations = {
            reduceChoices: true,
            addVisualHints: true,
            slowDownPace: true,
            provideHints: true,
            addEncouragement: true,
            simplifyToMinimum: true
        };

        this.sessionData.frustrationLevel = 0;
        this.sessionData.consecutiveIncorrect = 0;
    }

    /**
     * Update engagement score based on behavior
     */
    updateEngagementScore() {
        let score = 100;

        // Reduce for frustration
        score -= this.sessionData.frustrationLevel * 10;

        // Reduce for low success rate
        if (this.sessionData.successRate < 0.5) {
            score -= 20;
        }

        // Reduce for fatigue
        if (this.behavioralPatterns.fatigued.detected) {
            score -= 15;
        }

        // Increase for mastery
        if (this.behavioralPatterns.mastered.detected) {
            score += 10;
        }

        // Increase for consistent engagement
        if (this.sessionData.totalAttempts > 10 && this.sessionData.successRate > 0.6) {
            score += 15;
        }

        this.sessionData.engagementScore = Math.max(0, Math.min(100, score));
    }

    /**
     * Get current adaptations to apply
     */
    getCurrentAdaptations() {
        return this.sessionData.currentAdaptations || {};
    }

    /**
     * Get difficulty level for next content
     */
    getDifficultyLevel() {
        return this.sessionData.currentDifficulty;
    }

    /**
     * Get recommendations for content selection
     */
    getContentRecommendations() {
        const recommendations = {
            difficulty: this.sessionData.currentDifficulty,
            adaptations: this.getCurrentAdaptations(),
            suggestedBreak: false,
            encouragementLevel: 'normal'
        };

        // Suggest break if fatigued
        if (this.behavioralPatterns.fatigued.detected || this.sessionData.frustrationLevel >= 2) {
            recommendations.suggestedBreak = true;
        }

        // Increase encouragement if struggling
        if (this.sessionData.successRate < 0.5 || this.sessionData.consecutiveIncorrect > 0) {
            recommendations.encouragementLevel = 'high';
        }

        // Reduce encouragement if mastered (avoid patronizing)
        if (this.behavioralPatterns.mastered.detected) {
            recommendations.encouragementLevel = 'minimal';
        }

        return recommendations;
    }

    /**
     * Get session analytics (for parent view)
     */
    getSessionAnalytics() {
        return {
            duration: Date.now() - this.sessionData.startTime,
            totalAttempts: this.sessionData.totalAttempts,
            successRate: this.sessionData.successRate,
            currentDifficulty: this.sessionData.currentDifficulty,
            engagementScore: this.sessionData.engagementScore,
            topicsExplored: [...new Set(this.sessionData.interactions.map(i => i.type))],
            behavioralInsights: {
                rushing: this.behavioralPatterns.rushing.detected,
                hesitating: this.behavioralPatterns.hesitating.detected,
                fatigued: this.behavioralPatterns.fatigued.detected,
                mastered: this.behavioralPatterns.mastered.detected
            }
        };
    }

    /**
     * Export session data (privacy-safe, no PII)
     */
    exportSessionData() {
        return {
            ageGroup: this.sessionData.ageGroup,
            duration: Date.now() - this.sessionData.startTime,
            interactions: this.sessionData.interactions.length,
            successRate: this.sessionData.successRate,
            finalDifficulty: this.sessionData.currentDifficulty,
            engagementScore: this.sessionData.engagementScore,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Reset session (for new session or age group change)
     */
    resetSession() {
        this.sessionData = {
            startTime: Date.now(),
            interactions: [],
            currentDifficulty: 'medium',
            ageGroup: this.sessionData.ageGroup,
            consecutiveCorrect: 0,
            consecutiveIncorrect: 0,
            totalAttempts: 0,
            successRate: 0,
            frustrationLevel: 0,
            engagementScore: 100
        };

        this.behavioralPatterns = {
            rushing: { detected: false, threshold: 3, actions: [] },
            hesitating: { detected: false, threshold: 5, actions: [] },
            fatigued: { detected: false, threshold: 10, actions: [] },
            mastered: { detected: false, threshold: 5, actions: [] }
        };

        console.log('🔄 Session reset');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdaptiveLearningEngine;
}
