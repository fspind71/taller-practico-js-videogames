const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#Lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
  x: undefined,
  y: undefined,
};

const giftPosition = {
  x: undefined,
  y: undefined,
};
let enemyPositions = [];

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function setCanvasSize() {
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.6;
  } else {
    canvasSize = window.innerHeight * 0.6;
  }
  
  canvasSize = Number(canvasSize.toFixed(0));

  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);
  
  elementsSize = canvasSize / 10;

  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function startGame() {
  console.log({ canvasSize, elementsSize });

  game.font = elementsSize + 'px Verdana';
  game.textAlign = 'end';

  const map = maps [level];

  if(!map) {
    gameWin();
    return;
  }

  if(!timeStart){
    timeStart = Date.now();
    timeInterval = setInterval(showTime,100);
    showRecord()
  }

  const mapRows = map.trim().split('\n');
  const mapRowCols = mapRows.map(row => row.trim().split(''));
  console.log({map, mapRows, mapRowCols});

  showLives();

  enemyPositions = [];
  game.clearRect(0,0,canvasSize,canvasSize);

  mapRowCols.forEach( (row, rowI) =>{
    row.forEach( (col, colI) =>{
      const emoji = emojis[col];
      const posX = elementsSize * (colI + 1);
      const posY = elementsSize * (rowI + 1);

      if (col == 'O'){
        if (!playerPosition.x && !playerPosition.y){
          playerPosition.x = posX;
          playerPosition.y = posY;
          console.log({playerPosition});
        }
      } else if (col =='I'){
        giftPosition.x = posX;
        giftPosition.y = posY;
      } else if (col=='X'){
        enemyPositions.push({
          x: posX,
          y: posY,
        });
      }

      game.fillText(emoji, posX, posY );
      
    });
  });
  movePlayer();  
}

function movePlayer(){
  const giftCollisionX = playerPosition.x.toFixed(1) == giftPosition.x.toFixed(1);
  const giftcollisionY = playerPosition.y.toFixed(1) == giftPosition.y.toFixed(1);
  const giftcollision = giftCollisionX && giftcollisionY;

  if (giftcollision){
    levelWin();
  }

  const enemyCollision = enemyPositions.find(enemy =>{
    const enemyCollisionX = enemy.x.toFixed(1) == playerPosition.x.toFixed(1);
    const enemyCollisionY = enemy.y.toFixed(1) == playerPosition.y.toFixed(1);
    return enemyCollisionX && enemyCollisionY;
  });

  if (enemyCollision){
    levelFail();
  }

  game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function levelWin() {
  console.log('subiste de nivel');
  level++;
  startGame();
}

function levelFail(){
  console.log('Boludo!!! Pisaste una mina');
  lives--;
    
  if (lives <= 0){    
    level=0;
    lives = 3;
    timeStart = undefined;
  } 

  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}
  

function gameWin(){
  console.log('WON! Terminaste el Juego!');
  clearInterval(timeInterval);

  const recordTime = localStorage.getItem('record_time');
  const playerTime = Date.now() - timeStart;
  
  if(recordTime){
       if (recordTime >= playerTime) {
      localStorage.setItem('record_time', playerTime);
      pResult.innerHTML = 'Machine! Superaste el record!';
    } else {
      pResult.innerHTML = ' Sorry, no superaste el record. Ponete pilas alcalinas!';
    }
  } else{
    localStorage.setItem('record_time', playerTime);
    pResult.innerHTML = 'Perfecto! Ahora, debes superer este tiempo!!!';
  }
  console.log({recordTime, playerTime});
}

function showLives(){
  const hearstArray = Array(lives).fill(emojis['HEART']);
 spanLives.innerHTML = ""; 
 hearstArray.forEach(heart => spanLives.append(heart));
 }

 function showTime(){
  spanTime.innerHTML = Date.now() - timeStart;
 }

 function showRecord(){
  spanRecord.innerHTML = localStorage.getItem('record_time');
 }

window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKeys(event){
  if (event.key == 'ArrowUp') moveUp();
  else if  (event.key == 'ArrowLeft') moveLeft();
  else if  (event.key == 'ArrowRight')moveRight();
  else if  (event.key == 'ArrowDown')moveDown();
}

function moveUp() {
  console.log('Quiero moverme hacia arriba');

  if((playerPosition.y - elementsSize) < elementsSize ){
    console.log('OUT');
  } else {
    playerPosition.y -= elementsSize;
    startGame();
  }
}
function moveLeft() {
  console.log('Quiero moverme hacia la izquierda');
  if((playerPosition.x - elementsSize) < elementsSize ){
    console.log('OUT');
  } else {
    playerPosition.x -= elementsSize;
    startGame();
  }
}
function moveRight () {
  console.log('Quiero moverme hacia la derecha');
  if((playerPosition.x + elementsSize) > canvasSize ){
    console.log('OUT');
  } else {
    playerPosition.x += elementsSize;
    startGame();
  }
}
function moveDown () {
  console.log('Quiero moverme hacia abajo');

  if((playerPosition.y + elementsSize) > canvasSize ){
    console.log('OUT');
  } else {
    playerPosition.y += elementsSize;
    startGame();
  }
  
}
