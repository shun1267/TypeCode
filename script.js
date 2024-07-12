const textToTypeElement = document.getElementById('text-to-type');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const newTextBtn = document.getElementById('new-text-btn');
const hiddenInput = document.getElementById('hidden-input');
let textArray = []; // Initialize textArray


let startTime;
let stopTime;
let timer;
let typedText = '';
let errorEncountered = false;
let errorIndex = -1;

const sentences = [
    "This is a typing test.",
    "Type this text as fast as you can.",
    "Practice makes perfect.",
    "Improve your typing speed.",
    "The quick brown fox jumps over the lazy dog.",
    "JavaScript is a versatile programming language.",
    "Coding can be fun and challenging.",
    "Consistency is key to improvement.",
    "Stay focused and keep practicing.",
    "Errors help you learn and grow."
];

function getRandomSentence() {
    const randomIndex = Math.floor(Math.random() * sentences.length);
    return sentences[randomIndex];
}

function displayNewSentence() {
    const newSentence = getRandomSentence();
    textToTypeElement.textContent = newSentence;
    textArray = newSentence.split(''); // Set textArray at the beginning
    typedText = '';
    errorEncountered = false;
    errorIndex = -1;
    startTime = null;
    stopTime = null;
    clearInterval(timer);
    wpmDisplay.textContent = 'WPM: 0';
    accuracyDisplay.textContent = 'Accuracy: 0%';
    updateTextDisplay();
    hiddenInput.focus();
}

function startTypingTest(event) {
    const char = event.key;

    // Only process single character keys and backspace
    if (char.length > 1 && char !== 'Backspace') {
        return;
    }

    if (!startTime) {
        startTime = new Date().getTime();
        timer = setInterval(calculateResults, 1000);
    }

    if (errorEncountered) {
        if (char === 'Backspace') {
            // Ensure the backspace operation stops at the error point
            if (typedText.length > errorIndex) {
                typedText = typedText.slice(0, errorIndex);
            }
            errorEncountered = false;
            errorIndex = -1;
        }
    } else {
        if (char === 'Backspace') {
            if (typedText.length > 0) {
                typedText = typedText.slice(0, -1);
            }
        } else {
            if (char === textArray[typedText.length]) {
                typedText += char;
                if (typedText.length === textArray.length) {
                    stopTime = new Date().getTime();
                    clearInterval(timer);
                    calculateResults();
                }
            } else {
                errorEncountered = true;
                errorIndex = typedText.length;
            }
        }
    }
    updateTextDisplay();
}

function calculateResults() {
    if (!stopTime) {
        stopTime = new Date().getTime();
    }
    const elapsedTime = (stopTime - startTime) / 1000 / 60; // minutes
    const wordsTyped = typedText.split(' ').length;
    const wpm = Math.round(wordsTyped / elapsedTime);
    const accuracy = calculateAccuracy(typedText);

    wpmDisplay.textContent = `WPM: ${wpm}`;
    accuracyDisplay.textContent = `Accuracy: ${accuracy}%`;
}

function calculateAccuracy(typedText) {
    let correctCharacters = 0;

    textArray.forEach((char, index) => {
        if (char === typedText[index]) {
            correctCharacters++;
        }
    });

    return Math.round((correctCharacters / textArray.length) * 100);
}

function updateTextDisplay() {
    let displayText = '';

    typedText.split('').forEach((char, index) => {
        displayText += `<span class="correct">${char}</span>`;
    });

    if (errorEncountered && typedText.length < textArray.length) {
        const nextChar = textArray[typedText.length];
        if (nextChar === ' ') {
            displayText += `<span class="incorrect-space"></span>`;
        } else {
            displayText += `<span class="incorrect">${nextChar}</span>`;
        }
        displayText += textArray.slice(typedText.length + 1).join('');
    } else {
        displayText += textArray.slice(typedText.length).join('');
    }

    textToTypeElement.innerHTML = displayText;
}

newTextBtn.addEventListener('click', displayNewSentence);
document.addEventListener('keydown', startTypingTest);

// Display the initial sentence
displayNewSentence();
hiddenInput.focus();