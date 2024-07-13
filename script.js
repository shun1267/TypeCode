const textToTypeElement = document.getElementById('text-to-type');
const hiddenInput = document.getElementById('hidden-input');
const cursor = document.getElementById('cursor');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const newTextBtn = document.getElementById('new-text-btn');
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
    updateCursorPosition();
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
    updateCursorPosition();
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

function updateCursorPosition() {

    const textElementWidth = textToTypeElement.clientWidth;
    
    //const singleLineHeight = getTextHeight('A', window.getComputedStyle(textToTypeElement).font);
    const singleLineHeight = 60;

    // Get the current word the user is typing
    const words = typedText.split(' ');
    const currentWord = words[words.length - 1];
    
    // Get the part of the text up to the current word
    /*
    console.log("");
    console.log(typedText);
    console.log(currentWord);
    console.log(typedText.slice(0, typedText.length-currentWord.length-1));
    console.log(textArray);
    console.log(textArray.slice(0, words.length - 1).join(''));
    */
    textUpToCurrentWord = typedText;

    if(typedText == "undefined") {
        textUpToCurrentWord = "";
    }

    for(let i = typedText.length; i<textArray.length; ++i) {
        if(textArray[i] == " ")
            break;
        else
            textUpToCurrentWord += textArray[i];
    }

    // Calculate lines based on the full text up to the current word
    const lines = calculateLines(textUpToCurrentWord, window.getComputedStyle(textToTypeElement).font, textElementWidth);

    if (lines.length > 1) {
        // The text has wrapped to new lines
        const currentLineIndex = lines.length - 1;
        //const currentLineText = lines[currentLineIndex].slice(-(count - currentWord.length-1));
        count = 0;

        console.log(lines);

        for(i = 0; i<lines.length-1; ++i) {
            count+=lines[i].length;
            count+=1;
        }

        const currentLineText = typedText.slice(count);
        console.log(currentLineText);

        const currentLineWidth = getTextWidth(currentLineText, window.getComputedStyle(textToTypeElement).font);
        cursor.style.top = `${currentLineIndex * singleLineHeight+50}px`;
        hiddenInput.style.top = `${currentLineIndex * singleLineHeight+50}px`;
        cursor.style.left = `${currentLineWidth}px`;
        hiddenInput.style.left = `${currentLineWidth - 25}px`;
    } else {
        // The text is in a single line
        const typedTextWidth = getTextWidth(typedText, window.getComputedStyle(textToTypeElement).font);
        cursor.style.top = `50px`;
        hiddenInput.style.top = `50px`;
        cursor.style.left = `${typedTextWidth}px`;
        hiddenInput.style.left = `${typedTextWidth - 25}px`;
    }
}

/*
function updateCursorPosition() {
    const textElementWidth = textToTypeElement.clientWidth;
    //const singleLineHeight = getTextHeight('A', window.getComputedStyle(textToTypeElement).font);
    const singleLineHeight = 55;
    const lines = calculateLines(typedText, window.getComputedStyle(textToTypeElement).font, textElementWidth);
    
    if (lines.length > 1) {
        // The text has wrapped to new lines
        const currentLineIndex = lines.length - 1;
        const currentLineText = lines[currentLineIndex];
        const currentLineWidth = getTextWidth(currentLineText, window.getComputedStyle(textToTypeElement).font);
        console.log(currentLineText);
        cursor.style.top = `${currentLineIndex * singleLineHeight+50}px`;
        hiddenInput.style.top = `${currentLineIndex * singleLineHeight+50}px`;
        cursor.style.left = `${currentLineWidth}px`;
        hiddenInput.style.left = `${currentLineWidth - 25}px`;
    } else {
        // The text is in a single line
        const typedTextWidth = getTextWidth(typedText, window.getComputedStyle(textToTypeElement).font);
        cursor.style.top = `50px`;
        hiddenInput.style.top = `50px`;
        cursor.style.left = `${typedTextWidth}px`;
        hiddenInput.style.left = `${typedTextWidth - 25}px`;
    }
}*/

// Helper function to calculate the width of the text
function getTextWidth(text, font) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
}

// Helper function to calculate the height of the text
function getTextHeight(text, font) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
}

// Helper function to calculate the lines of text based on width
function calculateLines(text, font, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
        const testLine = currentLine + word + ' ';
        const testWidth = getTextWidth(testLine, font);
        if (testWidth > maxWidth && currentLine.length > 0) {
            lines.push(currentLine.trim());
            currentLine = word + ' ';
        } else {
            currentLine = testLine;
        }
    });
    lines.push(currentLine.trim());
    return lines;
}

// Ensure the input is focused when the user clicks anywhere in the container
document.querySelector('.container').addEventListener('click', () => {
    hiddenInput.focus();
});

// Ensure cursor is updated on window resize
window.addEventListener('resize', updateCursorPosition);

newTextBtn.addEventListener('click', displayNewSentence);
hiddenInput.addEventListener('keydown', startTypingTest);

// Display the initial sentence
displayNewSentence();
