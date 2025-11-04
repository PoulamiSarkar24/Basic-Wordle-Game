const wordList = ['apple', 'grape', 'mango', 'peach', 'lemon'];
const wordToGuess = wordList[Math.floor(Math.random() * wordList.length)];
const maxAttempts = 6;

let currentAttempt = 0;
let currentGuess = '';
let gameOver = false;

const board = document.getElementById('board');
const keyboard = document.getElementById('keyboard');
const message = document.getElementById('message');
const resetBtn = document.getElementById('resetBtn');

// Hide reset button at start
resetBtn.style.display = 'none';

// Create the board (30 tiles for 6 attempts x 5 letters)
for (let i = 0; i < maxAttempts * 5; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    board.appendChild(tile);
}

// Create keyboard layout
const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Bksp']
];

rows.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('keyboard-row');

    row.forEach(key => {
        const button = document.createElement('button');
        button.textContent = key;
        button.classList.add('key');

        if (key === 'Enter' || key === 'Bksp') {
            button.classList.add('wide');
        }

        button.addEventListener('click', () => handleKey(key));
        rowDiv.appendChild(button);
    });

    keyboard.appendChild(rowDiv);
});

// Handle key press from virtual or physical keyboard
function handleKey(key) {
    if (gameOver) return;

    if (key === 'Enter') {
        if (currentGuess.length === 5) checkGuess();
    } else if (key === 'Bksp') {
        currentGuess = currentGuess.slice(0, -1);
        updateBoard();
    } else if (/^[A-Z]$/.test(key)) {
        if (currentGuess.length < 5) {
            handleKeyPress(key);
        }
    }
}

// Physical keyboard input
document.addEventListener('keydown', (event) => {
    const key = event.key.toUpperCase();
    handleKey(key === 'BACKSPACE' ? 'Bksp' : key === 'ENTER' ? 'Enter' : key);
});

// Add a letter to guess
function handleKeyPress(key) {
    currentGuess += key.toLowerCase();
    updateBoard();
}

// Update the board display
function updateBoard() {
    const tiles = board.children;
    const startIdx = currentAttempt * 5;
    for (let i = 0; i < 5; i++) {
        tiles[startIdx + i].textContent = currentGuess[i] || '';
    }
}

// Check the guess
function checkGuess() {
    const tiles = board.children;
    const startIdx = currentAttempt * 5;

    for (let i = 0; i < 5; i++) {
        const letter = currentGuess[i];
        const tile = tiles[startIdx + i];
        tile.classList.add('reveal');

        const keyButtons = document.querySelectorAll('.key');
        const keyButton = Array.from(keyButtons).find(btn => btn.textContent.toLowerCase() === letter);

        if (letter === wordToGuess[i]) {
            tile.style.backgroundColor = '#6aaa64'; // green
            tile.style.color = 'white';
            if (keyButton) {
                keyButton.style.backgroundColor = '#6aaa64';
                keyButton.style.color = 'white';
            }
        } else if (wordToGuess.includes(letter)) {
            tile.style.backgroundColor = '#c9b458'; // yellow
            tile.style.color = 'white';
            if (keyButton && keyButton.style.backgroundColor !== '#6aaa64') {
                keyButton.style.backgroundColor = '#c9b458';
                keyButton.style.color = 'white';
            }
        } else {
            tile.style.backgroundColor = '#787c7e'; // gray
            tile.style.color = 'white';
            if (keyButton &&
                keyButton.style.backgroundColor !== '#6aaa64' &&
                keyButton.style.backgroundColor !== '#c9b458') {
                keyButton.style.backgroundColor = '#787c7e';
                keyButton.style.color = 'white';
            }
        }
    }

    if (currentGuess === wordToGuess) {
        message.textContent = '🎉 Congratulations! You guessed the word!';
        message.style.color = 'green';
        gameOver = true;
        resetBtn.style.display = 'inline-block';
        return;
    }

    currentAttempt++;
    currentGuess = '';

    if (currentAttempt === maxAttempts) {
        message.textContent = `❌ Game Over! The word was: ${wordToGuess.toUpperCase()}`;
        message.style.color = 'red';
        gameOver = true;
        resetBtn.style.display = 'inline-block';
    }
}

// Restart button logic
resetBtn.addEventListener('click', () => {
    location.reload();
});
