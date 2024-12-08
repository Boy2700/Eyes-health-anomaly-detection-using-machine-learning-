// DOM Elements
const app = document.getElementById('app');
const welcomeScreen = document.getElementById('welcome-screen');
const testScreen = document.getElementById('test-screen');
const resultScreen = document.getElementById('result-screen');
const settingsScreen = document.getElementById('settings-screen');
const startTestBtn = document.getElementById('start-test');
const openSettingsBtn = document.getElementById('open-settings');
const saveSettingsBtn = document.getElementById('save-settings');
const shareResultsBtn = document.getElementById('share-results');
const retakeTestBtn = document.getElementById('retake-test');
const testInstruction = document.getElementById('test-instruction');
const timerDisplay = document.getElementById('timer');
const lettersContainer = document.getElementById('letters-container');
const scoreDisplay = document.getElementById('score-display');
const timeDisplay = document.getElementById('time-display');
const diagnosisDisplay = document.getElementById('diagnosis');

// Settings
const darkModeToggle = document.getElementById('dark-mode');
const difficultySelect = document.getElementById('difficulty');
const numLettersSelect = document.getElementById('num-letters');
const timeLimitSelect = document.getElementById('time-limit');

// Game state
let settings = {
    darkMode: false,
    difficulty: 'medium',
    numLetters: 5,
    timeLimit: 10
};
let currentRound = 0;
let score = 0;
let totalTime = 0;
let timer;
let letters = [];
let isLargest = true;

// Event listeners
startTestBtn.addEventListener('click', startTest);
openSettingsBtn.addEventListener('click', openSettings);
saveSettingsBtn.addEventListener('click', saveSettings);
shareResultsBtn.addEventListener('click', shareResults);
retakeTestBtn.addEventListener('click', resetTest);
darkModeToggle.addEventListener('change', toggleDarkMode);

// Functions
function startTest() {
    currentRound = 0;
    score = 0;
    totalTime = 0;
    showScreen(testScreen);
    nextRound();
}

function nextRound() {
    if (currentRound < 20) {
        currentRound++;
        isLargest = currentRound % 2 === 1;
        generateLetters();
        updateTestInstruction();
        startTimer();
    } else {
        showResults();
    }
}

function generateLetters() {
    letters = [];
    lettersContainer.innerHTML = '';
    const fontSizes = [46,44,42, 40, 38, 36, 34, 32, 30, 28, 26, 24, 22, 20, 18, 16, 12, 10, 8, 6,];
    const usedFontSizes = [];

    for (let i = 0; i < settings.numLetters; i++) {
        const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        let fontSize;
        do {
            fontSize = fontSizes[Math.floor(Math.random() * fontSizes.length)];
        } while (usedFontSizes.includes(fontSize));
        usedFontSizes.push(fontSize);

        const color = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
        
        const letterElement = document.createElement('div');
        letterElement.classList.add('letter');
        letterElement.style.fontSize = `${fontSize}px`;
        letterElement.style.color = color;
        letterElement.textContent = letter;
        letterElement.addEventListener('click', () => checkAnswer(fontSize));
        
        letters.push({ letter, fontSize });
        lettersContainer.appendChild(letterElement);
    }
}

function updateTestInstruction() {
    testInstruction.textContent = isLargest ? 'You are to click the largest Aphabet letter!' : 'You are to click the smallest Alphabet letter!';
}

function startTimer() {
    let timeLeft = settings.timeLimit;
    updateTimerDisplay(timeLeft);
    
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay(timeLeft);
        if (timeLeft === 0) {
            clearInterval(timer);
            nextRound();
        }
    }, 1000);
}

function updateTimerDisplay(time) {
    timerDisplay.textContent = `Time left: ${time} seconds`;
}

function checkAnswer(selectedFontSize) {
    clearInterval(timer);
    const correctSize = isLargest ? Math.max(...letters.map(l => l.fontSize)) : Math.min(...letters.map(l => l.fontSize));
    if (selectedFontSize === correctSize) {
        score++;
        playSound('correct');
    } else {
        playSound('incorrect');
    }
    totalTime += settings.timeLimit - parseInt(timerDisplay.textContent.split(' ')[2]);
    nextRound();
}

function showResults() {
    showScreen(resultScreen);
    const percentage = (score / 20) * 100;
    scoreDisplay.textContent = `Your score: ${percentage.toFixed(1)}%`;
    timeDisplay.textContent = `Total time: ${totalTime} seconds`;
    diagnosisDisplay.textContent = getDiagnosis(percentage);
}

function getDiagnosis(percentage) {
    if (percentage < 40) {
        return "Poor Eyes Sight. We recommend you see an eye doctor." +
        "It seems you're experiencing poor eyesight, it's important to seek professional help from an eye doctor. Vision problems can stem from a variety of underlying causes, and an eye doctor can conduct a thorough examination to diagnose any issues accurately. Early detection and treatment can help preserve your vision and prevent further complications. Don't hesitate to schedule an appointment with an optometrist or ophthalmologist for a comprehensive eye exam.";
    } else if (percentage < 60) {
        return "AveragevEyes Sight. Include foods rich in Vitamin A (carrots, spinach) in your diet." +
        "maintaining a healthy diet can help preserve your vision. Including foods rich in Vitamin A, such as carrots and spinach, can be beneficial for eye health. Vitamin A plays a crucial role in maintaining good vision, particularly in low-light conditions, and supports the overall health of the eyes. A balanced diet with these nutrient-dense foods can contribute to long-term eye wellness.";
    } else if (percentage < 70) {
        return "Good Eyes Sight. Avoid habits that can harm your eyesight (e.g., staring at screens too long)." +
        "it's important to maintain healthy habits to preserve your vision. Avoid behaviors that can harm your eyes, such as staring at screens for extended periods without breaks. Prolonged screen time can lead to eye strain and discomfort, so make sure to follow the 20-20-20 rule—every 20 minutes, look at something 20 feet away for at least 20 seconds. By taking regular breaks and practicing good eye care, you can help protect your eyesight for the future";
    } else {
        return "Excellent Eyes Sight! Your eyesight is in great condition."+
        "your vision is in great condition, allowing you to enjoy clear and sharp sight. To maintain this level of eye health, continue practicing habits that protect your eyes, such as eating a balanced diet rich in nutrients, staying active, and protecting your eyes from harmful UV rays by wearing sunglasses. Regular eye exams can also help monitor your vision and catch any potential issues early, ensuring that your eyesight stays in top shape for years to come";
    }
}

function shareResults() {
    const text = `I scored ${(score / 20 * 100).toFixed(1)}% on the Eye Test Diagnostic App!`;
    if (navigator.share) {
        navigator.share({
            title: 'Eye Test Results',
            text: text,
        }).catch(console.error);
    } else {
        alert(text);
    }
}

function resetTest() {
    showScreen(welcomeScreen);
}

function openSettings() {
    showScreen(settingsScreen);
    darkModeToggle.checked = settings.darkMode;
    difficultySelect.value = settings.difficulty;
    numLettersSelect.value = settings.numLetters;
    timeLimitSelect.value = settings.timeLimit;
}

function saveSettings() {
    settings.darkMode = darkModeToggle.checked;
    settings.difficulty = difficultySelect.value;
    settings.numLetters = parseInt(numLettersSelect.value);
    settings.timeLimit = parseInt(timeLimitSelect.value);
    showScreen(welcomeScreen);
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode', darkModeToggle.checked);
}

function showScreen(screen) {
    welcomeScreen.classList.add('hidden');
    testScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    settingsScreen.classList.add('hidden');
    screen.classList.remove('hidden');
}

function playSound(type) {
    const audio = new Audio(`sounds/${type}.mp3`);
    audio.play();
}

// Initialize dark mode
toggleDarkMode();

