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
    .fill())
// tetrominos
let activeTetro = [[1, 0], [0, 1], [1, 1], [2, 1]]

class Coordinates {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}




