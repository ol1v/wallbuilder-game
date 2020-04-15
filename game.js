let canvas;
let ctx;
// game board array height
let gBArrayHeight = 20;
let gBArrayWidth = 12;
// start drawing on gameboard
let startX = 4;
let startY = 0;
// Score and level
let score = 0;
let level = 1;
let winOrLose = "Playing";
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

let stoppedShapeArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth)
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
    let xR = 0, yR = 19;
    let i = 0, j = 0;
    // 9 pixels from the top
    // 446 total pixels from top to bottom
    for (let y = 9; y <= 446; y += 23) {
        // from left to right 264 pixels
        for (let x = 11; x <= 264; x += 23) {
            coordinateArray[i][j] = new Coordinates(x, y);
            i++
        }
        j++;
        i = 0;
    }
}

function SetupCanvas() {
    /* get canvas from tetris.html with ID, set size of canvas
     and allow drawing on canvas*/
    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 936;
    canvas.height = 956;

    ctx.scale(2, 2);

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'black';
    ctx.strokeRect(8, 8, 280, 462);

    // logo = newImage(161,54);
    // logo.onload = DrawLogo;

    // Create Score and Game instructions
    ctx.fillStyle = 'black';
    ctx.font = '21px Arial';
    ctx.fillText("SCORE", 300, 98);

    ctx.strokeRect(300, 107, 161, 24);
    ctx.fillText(score.toString(), 310, 127);
    ctx.fillText("LEVEL", 300, 157);
    ctx.strokeRect(300, 171, 161, 24);
    ctx.fillText(level.toString(), 310, 190);

    ctx.fillText("WIN / LOSE", 300, 221);
    ctx.fillText(winOrLose, 310, 261);
    ctx.strokeRect(300, 232, 161, 95);
    ctx.fillText("CONTROLS", 300, 354);
    ctx.strokeRect(300, 366, 161, 104);
    ctx.font = '19px Arial';
    ctx.fillText("A: Move left", 310, 388);
    ctx.fillText("D: Move right", 310, 413);
    ctx.fillText("S: Move down", 310, 438);
    ctx.fillText("E: Rotate", 310, 463);

    // ------------------------------ ADD EVENTLISTENER (KEYPRESS)

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
    if (winOrLose != "Game Over") {
        if (key.keyCode === 65) {
            // A key pressed - move left
            direction = DIRECTION.LEFT;
            /* check to see if tetromino hits wall,
             else: delete and draw at new position*/
            if (!hittingTheWall() && !checkForHorizontalCollision()) {
                DeleteTetromino();
                startX--;
                // Draw new tetromino
                DrawTetromino();
            }

        } else if (key.keyCode === 68) {
            // D key pressed - move right
            direction = DIRECTION.RIGHT;
            if (!hittingTheWall() && !checkForHorizontalCollision()) {
                DeleteTetromino();
                startX++;
                DrawTetromino();
            }

        } else if (key.keyCode === 83) {
            // S key pressed - move down
            MoveTetrominoDown();
        } else if (key.keyCode === 69) {
            // E key pressed - rotate
            rotateTetromino();
        }
    }

}

function MoveTetrominoDown() {
    direction = DIRECTION.DOWN;
    if (!CheckForVerticalCollision()) {
        DeleteTetromino();
        startY++;
        DrawTetromino();
    }

}

window.setInterval(function () {
    if (winOrLose != "Game Over") {
        MoveTetrominoDown();
    }

}, 1000);

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

// Creates random tetromino (shape and color)
function CreateTetromino() {
    let randomTetromino = Math.floor(Math.random() * tetrominos.length);

    activeTetro = tetrominos[randomTetromino];
    activeTetroColor = tetrominosColors[randomTetromino];
}

// Check for wallhits
function hittingTheWall() {
    for (let i = 0; i < activeTetro.length; i++) {
        let newX = activeTetro[i][0] + startX;
        if (newX <= 0 && direction === DIRECTION.LEFT) {
            // hits left wall
            return true;
        } else if (newX >= 11 && direction === DIRECTION.RIGHT) {
            // hits right wall
            return true;
        }
    }
    return false;
}

function CheckForVerticalCollision() {
    // Create copy of active tetromino
    let tetrominoCopy = activeTetro;
    let collision = false;
    for (let i = 0; i < tetrominoCopy.length; i++) {
        let square = tetrominoCopy[i];
        let x = square[0] + startX;
        let y = square[1] + startY;
        if (direction === DIRECTION.DOWN) {
            y++;
            console.log(y);
        }
        // Check for collision
        //if (gameBoardArray[x][y + 1] === 1) {
        if (typeof stoppedShapeArray[x][y + 1] === 'string') {
            DeleteTetromino();
            startY++;
            DrawTetromino();
            collision = true;
            break;
        }
        if (y >= 20) {
            collision = true;
            break;
        }
    }
    // Check if collision happens at spawntime - Game over
    if (collision) {
        if (startY <= 2) {
            winOrLose = "Game Over";
            ctx.fillStyle = 'white';
            ctx.fillRect(310, 242, 140, 30);
            ctx.fillStyle = 'black';
            ctx.fillText(winOrLose, 310, 261);

        } else {
            // Put tetromino ontop of collision
            for (let i = 0; i < tetrominoCopy.length; i++) {
                let square = tetrominoCopy[i];
                let x = square[0] + startX;
                let y = square[1] + startY;
                stoppedShapeArray[x][y] = activeTetroColor;
            }
            // Spawn new tetromino - game continues
            CheckForCompletedRows();
            CreateTetromino();
            direction = DIRECTION.IDLE;
            startX = 4;
            startY = 0;
            DrawTetromino();
        }
    }
}


function checkForHorizontalCollision() {
    // Create copy of tetromino 
    let tetrominoCopy = activeTetro;
    let collision = false;
    for (let i = 0; i < tetrominoCopy.length; i++) {
        let square = tetrominoCopy[i];
        let x = square[0] + startX;
        let y = square[1] + startY;

        if (direction === DIRECTION.LEFT) {
            x--;
        } else if (direction === DIRECTION.RIGHT) {
            x++;
        }
        var stoppedShapeVal = stoppedShapeArray[x][y];
        if (typeof stoppedShapeVal === 'string') {
            collision = true;
            break;
        }
    }
    return collision;
}
// Check for completed rows
function CheckForCompletedRows() {
    let rowsToDelete = 0;
    let startOfDeletion = 0;
    // Check Y values
    for (let y = 0; y < gBArrayHeight; y++) {
        let completed = true;
        //Check X values
        for (let x = 0; x < gBArrayWidth; x++) {
            let square = stoppedShapeArray[x][y];
            if (square === 0 || (typeof square === 'undefined')) {
                completed = false;
                break;
            }
        }
        if (completed) {
            if (startOfDeletion === 0) startOfDeletion = y;
            rowsToDelete++;
            for (let i = 0; i < gBArrayWidth; i++) {
                stoppedShapeArray[i][y] = 0;
                gameBoardArray[i][y] = 0;
                let coorX = coordinateArray[i][y].x;
                let coorY = coordinateArray[i][y].y;
                ctx.fillStyle = 'white';
                ctx.fillRect(coorX, coorY, 21, 21);
            }


        }
    }
    if (rowsToDelete > 0) {
        score += 10;
        ctx.fillStyle = 'white';
        ctx.fillRect(310, 109, 140, 19);
        ctx.fillStyle = 'black';
        ctx.fillText(score.toString(), 310, 127);
        MoveAllRowsDown(rowsToDelete, startOfDeletion);
    }
}

function MoveAllRowsDown(rowsToDelete) {
    for (var i = startOfDeletion - 1; i >= 0; i--) {
        for (var x = 0; x < gBArrayWidth; x++) {
            var y2 = i + rowsToDelete;
            var square = stoppedShapeArray[x][i];
            var nextSquare = stoppedShapeArray[x][y2];
            if (typeof square === 'string') {
                nextSquare = square;
                gameBoardArray[x][y2] = 1;
                stoppedShapeArray[x][y2] = square;
                let coorX = coordinateArray[x][y2].x;
                let coorY = coordinateArray[x][y2].y;
                ctx.fillStyle = nextSquare;
                ctx.fillRect(coorX, coorY, 21, 21);

                square = 0;
                gameBoardArray[x][i] = 0;
                stoppedShapeArray[x][i] = 0;
                coorX = coordinateArray[x][i].x;
                coorY = coordinateArray[x][i].y;
                ctx.fillStyle = 'white';
                ctx.fillRect(coorX, coorY, 21, 21);


            }
        }
    }
}

function rotateTetromino() {
    let newRotation = new Array();
    let tetrominoCopy = activeTetro;
    let actTetrominoBU;
    for (let i = 0; i < tetrominoCopy.length; i++) {
        actTetrominoBU = [...activeTetromino];
        let x = tetrominoCopy[i][0];
        let y = tetrominoCopy[i][1];
        let newX = (GetLastSquareX() - y);
        let newY = X;
        newRotation.push([newX, newY]);

    }
    DeleteTetromino();
    try {
        activeTetro = newRotation;
        DrawTetromino();
    }
    catch (e) {
        if (e instanceof TypeError) {
            activeTetro = actTetrominoBU;
            DeleteTetromino();
            DrawTetromino();
        }
    }
}

function GetLastSquareX() {
    let lastX = 0;
    for (let i = 0; i < activeTetro.length; i++) {
        let square = activeTetro[i];
        if (square[0] > lastX)
            lastX = square[0];
    }
    return lastX;
}

