const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const flagsText = document.getElementById('flags');
const timeText = document.getElementById('time');
const switchButton = document.getElementById('switch');

// tiles configurations
const tileCount = 16;
const tileSize = canvas.width / tileCount;

// mines configurations
const minesCount = 40;
let minesNotPlaced = minesCount;

// maps (visual and actual)
let actualMap = new Array(tileCount);
let visualMap = new Array(tileCount);

// flags remain
let flags = minesCount;
flagsText.innerHTML = "Flags: " + flags;

// gameover and is game started status
let gameover = false;
let isGameStarted = false;

// time
let time = 0;
let result = 0;

// click mode
let clickMode = true;
switchButton.addEventListener("click", function(){
    clickMode = !clickMode;
    if(clickMode){
        switchButton.src = "cursor.png";
    }
    else{
        switchButton.src = "flag.png";
    }
});

// creating map
function createMap(){
    // creating actual map
    for (var i = 0; i < actualMap.length; i++) { // creating 2d array
        actualMap[i] = new Array(tileCount);
    }
    for(let x = 0; x < tileCount; x++){ // working with it
        for(let y = 0; y < tileCount; y++){
            actualMap[x][y] = 0;
        }
    }


    // creating visual map
    for (var i = 0; i < visualMap.length; i++) { // creating 2d array
        visualMap[i] = new Array(tileCount);
    }
    for(let x = 0; x < tileCount; x++){ // working with it
        for(let y = 0; y < tileCount; y++){
            visualMap[x][y] = "?";
        }
    }
    placeBombs();
    placeNumbers();
}


// placing bombs
function placeBombs(){
    // placing bombs
    while(minesNotPlaced > 0){
        for(let x = 0; x < tileCount; x++){
            for(let y = 0; y < tileCount; y++){
                if(Math.floor(Math.random() * tileCount) == 1 && actualMap[x][y] != "B" && minesNotPlaced > 0){
                    actualMap[x][y] = "B";
                    minesNotPlaced--;
                }
            }
        }
    }
}


// placing numbers
function placeNumbers(){
    // checking all tiles
    for(let x = 0; x < tileCount; x++){
        for(let y = 0; y < tileCount; y++){

            // checking all tiles around that tile
            if(actualMap[x][y] == "B"){
                let count = 0;

                // getting coordinates around tile
                for(let i = -1; i < 2; i++){ // i is X
                    for(let j = -1; j < 2; j++){ // j is Y

                        // if tile is on map
                        if(x+i >= 0 && x+i < tileCount && y+j >= 0 && y+j < tileCount){
                            // if tile isn't bomb
                            if(actualMap[x+i][y+j] != "B"){ 
                                actualMap[x+i][y+j] += 1;
                            }
                        }

                    }
                }
            }
        }
    }
}


// reveal tiles around (if 0 tile was pressed)
function revealAround(x, y){
    for(let i = x-1; i < x+2; i++){ // i is X
        for(let j = y-1; j < y+2; j++){ // j is Y
            if(i >= 0 && i < tileCount && j >= 0 && j < tileCount){
                if(actualMap[i][j] == 0 && !(x == i && y == j)) {
                    if(visualMap[i][j] != actualMap[i][j]){
                        if(visualMap[i][j] == "F"){
                            flags++;
                        }
                        visualMap[i][j] = actualMap[i][j];
                        revealAround(i, j);
                    }    
                } else if(actualMap[i][j] >= 1) {
                    if(visualMap[i][j] != actualMap[i][j]){
                        if(visualMap[i][j] == "F"){
                            flags++;
                        }
                        visualMap[i][j] = actualMap[i][j];
                    }
                }
                flagsText.innerHTML = "Flags: " + flags
            }
        }
    }
}


// playing game (clicking)
canvas.onmousedown = function fieldClick(event){ // onmousedown to detect right click
    if ("which" in event){
        // get canvas positions
        let startX = canvas.offsetLeft;
        let startY = canvas.offsetTop;
        // get click position and tile
        let clickX = event.clientX - startX;
        let clickY = event.clientY - startY;
        let clickTileX = Math.floor(clickX/tileSize);
        let clickTileY = Math.floor(clickY/tileSize);
        let which = event.which;
        if(!clickMode){
            if(event.which == 3){
                which = 1;
            } else if (event.which == 1){
                which = 3;
            }
        } 

        if(!gameover){
            switch(which){
                case 1: // left click (open)
                    // count time
                    if(!isGameStarted){
                        count();
                        isGameStarted = true;
                    }

                    // revealing cell if not flag
                    if(visualMap[clickTileX][clickTileY] != "F"){
                        visualMap[clickTileX][clickTileY] = actualMap[clickTileX][clickTileY];
                        // game over
                        if(actualMap[clickTileX][clickTileY] == "B"){
                            gameover = true;
                            updateMap();
                            for(let x = 0; x < tileCount; x++){
                                for(let y = 0; y < tileCount; y++){
                                    // draw bomb on gameover. Draws only right answer
                                    if(actualMap[x][y] == "B"){
                                        let bombStyle;
                                        if(visualMap[x][y] == "F"){
                                            bombStyle = "green";
                                        } else {
                                            bombStyle = '#c1c1c1';
                                        }
                                        ctx.fillStyle = bombStyle;
                                        ctx.fillRect(x * tileSize+1.5, y * tileSize+1.5, tileSize-3, tileSize-3);
                                        ctx.font = tileSize-10 + "px serif";
                                        ctx.fillText("💣", x * tileSize+1.5, y * tileSize+30);
                                    // draw flags on gameover. Draws only wrong answer
                                    } else if(visualMap[x][y] == "F"){
                                        let flagStyle;
                                        if(actualMap[x][y] != "B"){
                                            flagStyle = "red";
                                        } else {
                                            flagStyle = '#c1c1c1';
                                        }
                                        ctx.fillStyle = flagStyle;
                                        ctx.fillRect(x * tileSize+1.5, y * tileSize+1.5, tileSize-3, tileSize-3);
                                        ctx.font = tileSize-10 + "px serif";
                                        ctx.fillText("🚩", x * tileSize+1.5, y * tileSize+30);
                                    }
                                }
                            }
                            // game over text
                            result = time;
                            flagsText.innerHTML = "Game over! Refresh the page to play again.";
                            timeText.innerHTML = "Your result is " + result + " seconds.";
                        } else if (actualMap[clickTileX][clickTileY] == 0){
                            revealAround(clickTileX, clickTileY);
                        } 
                    }  
                    break;
                case 3: // right click (spawn flag)
                    // process
                    switch(visualMap[clickTileX][clickTileY]){
                        case "F": visualMap[clickTileX][clickTileY] = "?"; flags++; break;
                        case "?": if(flags>0) visualMap[clickTileX][clickTileY] = "F"; if(flags>0) flags--; break;
                        default: break;
                    }
                    flagsText.innerHTML = "Flags: " + flags;             
            }
        }
    }
    if(!gameover){
        updateMap();
    }
}


// drawing visual map
function updateMap(){
    clearCanvas();
    for(let x = 0; x < tileCount; x++){
        for(let y = 0; y < tileCount; y++){
            switch(visualMap[x][y]){
                // draw unchecked 
                case "?":
                    ctx.fillStyle = '#8c8c8c';
                    ctx.fillRect(x * tileSize+1.5, y * tileSize+1.5, tileSize-3, tileSize-3);
                    break;
                // draw bomb
                case "B":
                    break;
                // draw flag
                case "F":
                    if(!gameover){
                        ctx.fillStyle = '#c1c1c1';
                        ctx.fillRect(x * tileSize+1.5, y * tileSize+1.5, tileSize-3, tileSize-3);
                        ctx.font = tileSize-10 + "px serif";
                        ctx.fillText("🚩", x * tileSize+1.5, y * tileSize+30);
                    }  
                    break;
                // draw 0 cell
                case 0:
                    ctx.fillStyle = '#c1c1c1';
                    ctx.fillRect(x * tileSize+1.5, y * tileSize+1.5, tileSize-3, tileSize-3);
                    break;
                // draw number cell
                default:
                    ctx.fillStyle = '#c1c1c1';
                    ctx.fillRect(x * tileSize+1.5, y * tileSize+1.5, tileSize-3, tileSize-3);
                    ctx.font = tileSize-10 + "px serif";
                    ctx.fillStyle = '#000';
                    ctx.fillText(visualMap[x][y].toString(), x * tileSize+10, y * tileSize+30);
                    break;
            }
        }
    }
}


function count(){
    if(!gameover){
        time++
        timeText.innerHTML = "Time: " + time
        setTimeout(count, 1000);
        // check for win
        breakme: {
            if(flags == 0){
                // if there is unsigned cell - not win
                for(let x = 0; x < tileCount; x++){
                    for(let y = 0; y < tileCount; y++){
                        if(visualMap[x][y] == "?"){
                            break breakme;
                        }
                    }
                }
                // win text
                updateMap();
                gameover = true;
                result = time;
                flagsText.innerHTML = "You have cleared the field! Refresh this page to play again.";
                timeText.innerHTML = "Your result is " + result + " seconds.";
            }
        }  
    }
}

// clearing canvas
function clearCanvas(){
    ctx.fillStyle = '#b0b0b0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}



// game start
function startGame(){
    createMap();
    updateMap();
}

startGame();