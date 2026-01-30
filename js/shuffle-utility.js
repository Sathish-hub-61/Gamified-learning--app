// Shuffle Utility for Games
// Randomizes arrays to make games more engaging

/**
 * Fisher-Yates shuffle algorithm
 * Randomly shuffles an array in place
 * @param {Array} array - The array to shuffle
 * @returns {Array} - The shuffled array
 */
function shuffleArray(array) {
    const shuffled = [...array]; // Create a copy to avoid mutating original
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Get random items from an array
 * @param {Array} array - Source array
 * @param {number} count - Number of items to get
 * @returns {Array} - Random items
 */
function getRandomItems(array, count) {
    const shuffled = shuffleArray(array);
    return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * Shuffle and return a subset of array
 * @param {Array} array - Source array
 * @param {number} count - Number of items (optional, defaults to all)
 * @returns {Array} - Shuffled subset
 */
function getShuffledSubset(array, count = null) {
    if (count === null || count >= array.length) {
        return shuffleArray(array);
    }
    return getRandomItems(array, count);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { shuffleArray, getRandomItems, getShuffledSubset };
}
