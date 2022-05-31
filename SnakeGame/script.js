const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreText = document.getElementById('score');
// tileMap settings
const tileCount = 20;
const tileSize = canvas.width / tileCount;

// Snake position, length, velocity and direction settings
class SnakePart{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}


let headX = Math.floor(Math.random() * tileCount);
let headY = Math.floor(Math.random() * tileCount);

let velX = 0;
let velY = 0;

let speed = 7;

let snakeParts = [];
let length = 1;

// setting apple position
let appleX = Math.floor(Math.random() * tileCount);
let appleY = Math.floor(Math.random() * tileCount);

//////////////////////////////////////////////////////////

// updating game state
function drawGame(){
    setTimeout(drawGame, 1000/speed);
    clearCanvas();
    drawSnake();
    moveSnake();
    drawApple();
    checkCollision();
}

// updating canvas
function clearCanvas(){
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

//////////////////////////////////////////////////////////

// drawing snake
function drawSnake(){
    ctx.fillStyle = 'green';
    ctx.fillRect(headX * tileSize, headY * tileSize, tileSize, tileSize);

    for(let i = 0; i < snakeParts.length; i++){
        let part = snakeParts[i];
        ctx.fillStyle = 'yellow';
        ctx.fillRect(part.x * tileSize, part.y * tileSize, tileSize, tileSize);
    }
    snakeParts.push(new SnakePart(headX, headY));
    if(snakeParts.length > length){
        snakeParts.shift();
    }

}

// moving snake
function moveSnake(){
    headX += velX;
    headY += velY;
}

//////////////////////////////////////////////////////////

// drawing apple
function drawApple(){
    ctx.fillStyle = 'red';
    ctx.fillRect(appleX * tileSize, appleY * tileSize, tileSize, tileSize);
}

function checkCollision(){
    // Apple Collision
    if(headX == appleX && headY == appleY){
        length++;
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        scoreText.innerHTML = "Score: " + length;
        if(length % 4 == 0){
            speed++;
        }
    }
    // GAME OVER COLLISIONS 
    for(let i = 0; i < snakeParts.length; i++){
        if(headX == snakeParts[i].x && headY == snakeParts[i].y){
            gameOver();
        }
    }
    if(headX < 0 || headX > tileCount - 1 || headY < 0 || headY > tileCount - 1){
        gameOver();
    }
}

function gameOver(){
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    headX = Math.floor(Math.random() * tileCount);
    headY = Math.floor(Math.random() * tileCount);
    velX = 0;
    velY = 0;
    length = 0;
    snakeParts = [];
    speed = 7;
    scoreText.innerHTML = "Score: " + length;
}

//////////////////////////////////////////////////////////

// pressing buttons
document.body.addEventListener('keydown', keyDown);
function keyDown(event){
    switch(event.keyCode){
        case 87: if(velY != 1) velY = -1; velX = 0; break;
        case 83: if(velY != -1) velY = 1; velX = 0; break;
        case 65: velY = 0; if(velX != 1) velX = -1; break;
        case 68: velY = 0; if(velX != -1) velX = 1; break;

        default: break;
    }
}

drawGame();