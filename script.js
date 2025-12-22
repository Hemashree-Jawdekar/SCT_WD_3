const landing = document.getElementById("landing");
const modePage = document.getElementById("mode");
const playerPage = document.getElementById("players");
const gamePage = document.getElementById("game");
const cells = document.querySelectorAll(".cell");
const board = document.querySelector(".board");
const overlay = document.getElementById("overlay");
const overlayText = document.getElementById("overlayText");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const scores = {
O: 1,
X: -1,
tie: 0
}

let gameMode = "";
let playerX = "";
let playerO = "";
let currentPlayer = "";
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function showMode() {
    landing.classList.add("hidden");
    modePage.classList.remove("hidden");
}

function selectMode(mode) {
    gameMode = mode;
    modePage.classList.add("hidden");
    playerPage.classList.remove("hidden");

    if (mode === "computer") {
        document.getElementById("player2").style.display = "none";
    }
    else {
        document.getElementById("player2").style.display = "block";
    }
}

function startGame() {
    playerX = document.getElementById("player1").value || "Player X";
    playerO = gameMode === "human" ? document.getElementById("player2").value || "Player O" : "Computer";
    playerPage.classList.add("hidden");
    gamePage.classList.remove("hidden");
    currentPlayer = "X";
    statusText.textContent = `${playerX}'s Turn`;
}

function handleCellClick() {
    const index = this.getAttribute("data-index");
    if (gameState[index] !== "" || !gameActive) {
        return;
    }
    gameState[index] = currentPlayer;
    this.textContent = currentPlayer === "X" ? "X" : "O";
    checkResult();
}

function minimax(board, depth, isMaximizing) {
    let result = checkWinner();
    if(result !== null){
        return scores[result];
    }
    if(isMaximizing){
        let bestScore = -Infinity;
        for(let i=0; i<board.length; i++){
            if(board[i] === ""){
                board[i] = "O";
                let score = minimax(board, depth+1, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    }
    else{
        let bestScore = Infinity;
        for(let i=0; i<board.length; i++){
            if(board[i] === ""){
                board[i] = "X";
                let score = minimax(board, depth+1, true);
                board[i] = "";
                bestScore = Math.min(score,bestScore);
            }
        }
        return bestScore;
    }
}

function computerMove() {
    let bestScore = -Infinity;
    let move;
    for(let i=0; i<gameState.length; i++){
        if(gameState[i] === ""){
            gameState[i] = "O";
            let score = minimax(gameState, 0, false);
            gameState[i] = "";
            if(score > bestScore){
                bestScore = score;
                move = i;
            }
        }
    }
    gameState[move] = "O";
    cells[move].textContent = "O";
    gameActive = true;
    checkResult();
}

function checkResult() {
    let roundWon = false;
    let winningCombo = null;
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (
            gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]
        ) {
            roundWon = true;
            winningCombo = condition;
            break;
        }
    }
    if (roundWon) {
        if (winningCombo) {
            winningCombo.forEach(index => {
                cells[index].classList.add("winner");
            });
        }
        gameActive = false;
        let message = "";
        if (gameMode == "human") {
            const winnerName = currentPlayer === "X" ? playerX : playerO;
            message = `🎉 ${winnerName} Wins! 🎉`
            statusText.textContent = `🎉 ${winnerName} Wins!!!! 🎉`;
        }
        else {
            if (currentPlayer === "X") {
                message = `🔥 ${playerX} Defeated the Computer! 🔥`;
                statusText.textContent = `🎉 Amazing ${playerX}!! You defeated the computer! 🎉`;
            }
            else {
                message = `😢 Ooops! ${playerX}, you lost to the Computer`;
                statusText.textContent = `😢 Ooops! ${playerX}, you lost. Good Luck Next Time!`;
            }
        }
        showEndMessage(message);
        return;
    }

    if (!gameState.includes("")) {
        statusText.textContent = "Game Draw!";
        gameActive = false;
        showEndMessage("🤝 It's a Draw!");
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `${currentPlayer === "X" ? playerX : playerO}'s Turn`;
    if (gameMode === "computer" && currentPlayer === "O") {
    gameActive = false;
    setTimeout(() => {
        computerMove();
        gameActive = true;
    }, 500);
}

}

function checkWinner() {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (
            gameState[a] &&
            gameState[a] === gameState[b] &&
            gameState[a] === gameState[c]
        ) {
            return gameState[a]; // "X" or "O"
        }
    }

    if (!gameState.includes("")) {
        return "tie";
    }

    return null;
}


function showEndMessage(message){
    overlayText.textContent = message;

    board.classList.add("blur");
    overlay.classList.remove("hidden");
    setTimeout(() => {
        overlay.classList.add("hidden")
        gamePage.classList.remove("blur");
        board.classList.remove("blur");
    }, 3000);
}

function restartGame() {
    currentPlayer = "X";
    gameActive = true;
    overlay.classList.add("hidden");
    board.classList.remove("blur");
    gameState = ["", "", "", "", "", "", "", "", ""];
    cells.forEach(cell => cell.textContent = "");
    cells.forEach(cell => cell.classList.remove("winner"));
    statusText.textContent = `${playerX}'s Turn`;
}

function goHome() {
    landing.classList.remove("hidden");
    modePage.classList.add("hidden");
    playerPage.classList.add("hidden");
    gamePage.classList.add("hidden");
    overlay.classList.add("hidden");
    board.classList.remove("blur");
    restartGame();
}

cells.forEach(cell => cell.addEventListener("click", handleCellClick));
restartBtn.addEventListener("click", restartGame);