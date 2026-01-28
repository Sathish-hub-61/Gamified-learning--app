// Adaptive Learning Logic
let consecutiveCorrect = 0;
let consecutiveWrong = 0;
let difficultyLevel = 1;

function adaptDifficulty(correct) {
    if (correct) {
        consecutiveCorrect++;
        consecutiveWrong = 0;
        if (consecutiveCorrect >= 2) {
            increaseDifficulty();
            consecutiveCorrect = 0;
        }
    } else {
        consecutiveWrong++;
        consecutiveCorrect = 0;
        if (consecutiveWrong >= 2) {
            decreaseDifficulty();
            consecutiveWrong = 0;
        }
    }
}

function increaseDifficulty() {
    difficultyLevel++;
    // Adjust game parameters based on age and type
    if (selectedAge === '3-5') {
        // Add more options or faster pace
    } else if (selectedAge === '6-9') {
        // Harder math or longer words
    } else if (selectedAge === '10-12') {
        // More complex choices
    }
    console.log('Difficulty increased to', difficultyLevel);
}

function decreaseDifficulty() {
    difficultyLevel = Math.max(1, difficultyLevel - 1);
    // Simplify game
    console.log('Difficulty decreased to', difficultyLevel);
}
