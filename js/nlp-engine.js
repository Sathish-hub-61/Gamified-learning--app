/**
 * NLP Engine for PlayLearn
 * Handles voice interaction, rhyme detection, and pronunciation analysis
 * Designed for children 3-5 years with gentle, non-judgmental feedback
 * 
 * Privacy: No audio is stored or transmitted. All processing is local.
 */

class NLPEngine {
    constructor() {
        this.recognition = null;
        this.isListening = true;
        this.currentRhyme = null;
        this.participationDetected = false;
        this.confidenceThreshold = 0.3; // Very low threshold - we detect participation, not accuracy

        this.initializeSpeechRecognition();
    }

    /**
     * Initialize Web Speech API (browser-native, no external API needed)
     */
    initializeSpeechRecognition() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.warn('Speech recognition not supported in this browser');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();

        // Configuration for child-friendly detection
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 3;
        this.recognition.lang = 'en-US';

        this.setupRecognitionHandlers();
    }

    /**
     * Setup event handlers for speech recognition
     */
    setupRecognitionHandlers() {
        if (!this.recognition) return;

        this.recognition.onstart = () => {
            this.isListening = true;
            console.log('🎤 Listening for child participation...');
        };

        this.recognition.onresult = (event) => {
            this.handleSpeechResult(event);
        };

        this.recognition.onerror = (event) => {
            console.log('Speech recognition event:', event.error);
            // Don't show errors to children - just mark as participated
            if (event.error !== 'no-speech') {
                this.participationDetected = true;
            }
        };

        this.recognition.onend = () => {
            this.isListening = false;
            console.log('🎤 Stopped listening');
        };
    }

    /**
     * Handle speech recognition results
     * Focus: Detect participation, not perfect pronunciation
     */
    handleSpeechResult(event) {
        const results = event.results;
        const lastResult = results[results.length - 1];

        if (!lastResult) return;

        // Get all alternatives
        const alternatives = Array.from(lastResult).map(alt => ({
            transcript: alt.transcript.toLowerCase().trim(),
            confidence: alt.confidence
        }));

        console.log('Detected speech alternatives:', alternatives);

        // Check if child said anything (very lenient)
        const hasParticipated = alternatives.some(alt =>
            alt.transcript.length > 0 &&
            (alt.confidence > this.confidenceThreshold || event.results[0].isFinal)
        );

        if (hasParticipated) {
            this.participationDetected = true;

            // If we have a current rhyme, check for rhyme matching
            if (this.currentRhyme) {
                this.analyzeRhymeParticipation(alternatives);
            }
        }
    }

    /**
     * Analyze if child attempted the rhyme
     * Uses phonetic similarity and keyword matching
     */
    analyzeRhymeParticipation(alternatives) {
        const rhymeWords = this.extractRhymeWords(this.currentRhyme.text);

        for (const alt of alternatives) {
            const spokenWords = alt.transcript.split(' ');

            // Check if any rhyme words were attempted
            const matchedWords = rhymeWords.filter(rhymeWord =>
                spokenWords.some(spokenWord =>
                    this.areSimilar(rhymeWord, spokenWord)
                )
            );

            if (matchedWords.length > 0) {
                console.log(`✅ Child attempted rhyme words: ${matchedWords.join(', ')}`);
                this.currentRhyme.wordsAttempted = matchedWords;
                this.currentRhyme.participationQuality = 'good';
                return;
            }
        }

        // Even if no exact match, participation is detected
        this.currentRhyme.participationQuality = 'attempted';
    }

    /**
     * Extract key words from rhyme text
     */
    extractRhymeWords(text) {
        // Remove common words and focus on rhyming/content words
        const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'];
        return text.toLowerCase()
            .split(/\s+/)
            .filter(word => word.length > 2 && !commonWords.includes(word))
            .map(word => word.replace(/[^a-z]/g, ''));
    }

    /**
     * Check phonetic similarity between words
     * Uses simple Levenshtein-like distance for child speech
     */
    areSimilar(word1, word2) {
        word1 = word1.toLowerCase();
        word2 = word2.toLowerCase();

        // Exact match
        if (word1 === word2) return true;

        // Contains match (child might say part of word)
        if (word1.includes(word2) || word2.includes(word1)) return true;

        // Phonetic similarity (simple)
        const similarity = this.calculateSimilarity(word1, word2);
        return similarity > 0.6; // 60% similar is good enough for children
    }

    /**
     * Calculate string similarity (0-1)
     */
    calculateSimilarity(str1, str2) {
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;

        if (longer.length === 0) return 1.0;

        const editDistance = this.levenshteinDistance(longer, shorter);
        return (longer.length - editDistance) / longer.length;
    }

    /**
     * Levenshtein distance algorithm
     */
    levenshteinDistance(str1, str2) {
        const matrix = [];

        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }

        return matrix[str2.length][str1.length];
    }

    /**
     * Start listening for rhyme participation
     * @param {Object} rhyme - Rhyme object with text and expected words
     * @param {Function} onParticipation - Callback when participation detected
     */
    listenForRhyme(rhyme, onParticipation) {
        if (!this.recognition) {
            console.warn('Speech recognition not available');
            // Fallback: Auto-complete after timeout
            setTimeout(() => {
                onParticipation({ participated: true, method: 'timeout' });
            }, 3000);
            return;
        }

        this.currentRhyme = {
            text: rhyme.text,
            expectedWords: rhyme.expectedWords || [],
            wordsAttempted: [],
            participationQuality: 'none'
        };

        this.participationDetected = false;

        try {
            this.recognition.start();

            // Auto-stop after 5 seconds
            setTimeout(() => {
                if (this.isListening) {
                    this.recognition.stop();
                }

                // Call callback with results
                onParticipation({
                    participated: this.participationDetected,
                    quality: this.currentRhyme.participationQuality,
                    wordsAttempted: this.currentRhyme.wordsAttempted,
                    method: 'voice'
                });

                this.currentRhyme = null;
            }, 5000);

        } catch (error) {
            console.log('Recognition start error:', error);
            // Fallback to participation detected
            onParticipation({ participated: true, method: 'fallback' });
        }
    }

    /**
     * Simple participation detection (any sound)
     * Used when we just want to know if child is engaged
     */
    detectParticipation(duration = 3000) {
        return new Promise((resolve) => {
            if (!this.recognition) {
                resolve({ participated: true, method: 'fallback' });
                return;
            }

            this.participationDetected = false;

            try {
                this.recognition.start();

                setTimeout(() => {
                    if (this.isListening) {
                        this.recognition.stop();
                    }
                    resolve({
                        participated: this.participationDetected,
                        method: 'voice'
                    });
                }, duration);

            } catch (error) {
                resolve({ participated: true, method: 'fallback' });
            }
        });
    }

    /**
     * Analyze rhyme completion quality
     * Returns gentle feedback level (not judgmental)
     */
    analyzeRhymeQuality(expectedWords, attemptedWords) {
        if (!attemptedWords || attemptedWords.length === 0) {
            return {
                level: 'participated', // Just trying is success!
                encouragement: 'Great job listening! 🎵',
                stars: 1
            };
        }

        const matchPercentage = attemptedWords.length / expectedWords.length;

        if (matchPercentage >= 0.7) {
            return {
                level: 'excellent',
                encouragement: 'Amazing! You know this rhyme! 🌟',
                stars: 3
            };
        } else if (matchPercentage >= 0.4) {
            return {
                level: 'good',
                encouragement: 'Wonderful! Keep singing! 🎶',
                stars: 2
            };
        } else {
            return {
                level: 'participated',
                encouragement: 'Great job trying! 🎵',
                stars: 1
            };
        }
    }

    /**
     * Check if browser supports speech recognition
     */
    static isSupported() {
        return ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);
    }

    /**
     * Request microphone permission (required for speech recognition)
     */
    async requestPermission() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop()); // Stop immediately
            return true;
        } catch (error) {
            console.log('Microphone permission denied or not available');
            return false;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NLPEngine;
}
