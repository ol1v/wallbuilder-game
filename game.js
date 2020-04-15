let canvas;
let ctx;
// game board array height
let gBArrayHeight = 20;
let gBArrayWidth = 12;
// start drawing on gameboard
let startX = 4;
let startY = 0;
// multidimensional array
let coordinateArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth)
    .fill(0));
// Active Tetromino
let activeTetro = [[1, 0], [0, 1], [1, 1], [2, 1]]

let tetrominos = [];
let tetrominosColors = ['purple', 'cyan', 'blue', 'yellow', 'orange', 'green', 'red'];

let activeTetroColor;
//gameboard
let gameBoardArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth)
    .fill(0));

let DIRECTION = {
    IDLE: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
};
let direction;



class Coordinates {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

document.addEventListener('DOMContentLoaded', SetupCanvas);

function CreateCoordArray() {
    let i = 0, j = 0;
    // 9 pixels from the top
    // 446 total pixels from top to bottom
    for (let y = 9; y <= 446; y += 23) {
        for (let x = 11; x <= 264; x += 23) {
            coordinateArray[i][j] = new Coordinates(x, y);
            i++
        }
        j++;
        i = 0;
    }
}

function SetupCanvas() {
    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 936;
    canvas.height = 956;

    ctx.scale(2, 2);

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'black';
    ctx.strokeRect(8, 8, 280, 462);

    document.addEventListener('keydown', HandleKeyPress);
    CreateTetrominos();
    CreateTetromino();

    CreateCoordArray();
    DrawTetromino();
}

// Look for places where square will be drawn
// Creates call to where to draw block in pixels
function DrawTetromino() {
    for (let i = 0; i < activeTetro.length; i++) {
        // spawn tetro
        let x = activeTetro[i][0] + startX;
        let y = activeTetro[i][1] + startY;
        gameBoardArray[x][y] = 1;
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
        // draw tetromino
        ctx.fillStyle = activeTetroColor;
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}

function HandleKeyPress(key) {
    if (key.keyCode === 65) {
        // A key pressed - move left
        direction = DIRECTION.LEFT;
        DeleteTetromino();
        startX--;
        // Draw new tetromino
        DrawTetromino();

    } else if (key.keyCode === 68) {
        // D key pressed - move right
        direction = DIRECTION.RIGHT;
        DeleteTetromino();
        startX++;
        DrawTetromino();
    } else if (key.keyCode === 83) {
        // S key pressed - move down
        direction = DIRECTION.DOWN;
        DeleteTetromino();
        startY++;
        DrawTetromino();
    }
}

function DeleteTetromino() {
    for (let i = 0; i < activeTetro.length; i++) {
        // get current tetro and delete
        let x = activeTetro[i][0] + startX;
        let y = activeTetro[i][1] + startY;
        gameBoardArray[x][y] = 0;
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
        ctx.fillStyle = 'white';
        ctx.fillRect(coorX, coorY, 21, 21);

    }
}

function CreateTetrominos() {
    // T shape
    tetrominos.push([[1, 0], [0, 1], [1, 1], [2, 1]]);
    // I Shape
    tetrominos.push([[0, 0], [1, 0], [2, 0], [3, 0]]);
    // J Shape
    tetrominos.push([[0, 0], [0, 1], [1, 1], [2, 1]]);
    // Square shape
    tetrominos.push([[0, 0], [1, 0], [0, 1], [1, 1]]);
    // L shape
    tetrominos.push([[2, 0], [0, 1], [1, 1], [2, 1]]);
    // S shape
    tetrominos.push([[1, 0], [2, 0], [0, 1], [1, 1]]);
    // Z shape
    tetrominos.push([[0, 0], [1, 0], [1, 1], [2, 1]]);
}

function CreateTetromino() {
    let randomTetromino = Math.floor(Math.random() * tetrominos.length);

    activeTetro = tetrominos[randomTetromino];
    activeTetroColor = tetrominosColors[randomTetromino];
}




