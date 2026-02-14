// BOARD VARS
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

// DINOMAX VARS
let dinomaxWidth = 80;
let dinomaxHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinomaxHeight;
let dinomaxIMG;

let dinomax = {
  x: dinoX,
  y: dinoY,
  width: dinomaxWidth,
  height: dinomaxHeight,
};

// HITBOX ADJUSTMENT
let dinoHitbox = {
  xOffset: 20,
  yOffset: 10,
  width: dinomaxWidth - 40,
  height: dinomaxHeight - 10,
};

// CACTUS VARS
let cactusArray = [];
let cactus1width = 34;
let cactus2width = 69;
let cactus3width = 102;
let cactusheight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusheight;
let cactus1IMG, cactus2IMG, cactus3IMG;

// PHYSICS
let velocityX = -8;
let velocityY = 0;
let gravity = 0.4;

// GAME STATE
let gameover = false;
let score = 0;

// AUDIO VARS
let bgMusic;
let jumpSound;
let musicStarted = false;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  // LOAD IMAGES
  dinomaxIMG = new Image();
  dinomaxIMG.src = "./img/dino.png";

  cactus1IMG = new Image();
  cactus1IMG.src = "./img/cactus1.png";
  cactus2IMG = new Image();
  cactus2IMG.src = "./img/cactus2.png";
  cactus3IMG = new Image();
  cactus3IMG.src = "./img/cactus3.png";

  // INITIALIZE AUDIO
  bgMusic = new Audio("./audio/bg-music.mp3");
  bgMusic.loop = true;
  bgMusic.volume = 0.2;

  jumpSound = new Audio("./audio/jump.mp3");
  jumpSound.volume = 0.4;

  requestAnimationFrame(update);
  setInterval(thecactus, 1000);
  document.addEventListener("keydown", handleInput);
};

function update() {
  requestAnimationFrame(update);
  if (gameover) return;

  context.clearRect(0, 0, board.width, board.height);

  // SCORE
  score += 0.1;
  context.fillStyle = "#535353";
  context.font = "20px Courier";
  context.fillText("Score: " + Math.floor(score), 10, 25);

  // DINOMAX PHYSICS
  velocityY += gravity;
  dinomax.y = Math.min(dinomax.y + velocityY, dinoY);
  context.drawImage(
    dinomaxIMG,
    dinomax.x,
    dinomax.y,
    dinomax.width,
    dinomax.height,
  );

  // CACTUS MOVEMENT & COLLISION
  for (let i = 0; i < cactusArray.length; i++) {
    let cactus = cactusArray[i];
    cactus.x += velocityX;
    context.drawImage(
      cactus.img,
      cactus.x,
      cactus.y,
      cactus.width,
      cactus.height,
    );

    if (collisionshape2d(dinomax, cactus)) {
      triggerGameOver();
    }
  }

  // REMOVE OLD CACTI
  while (cactusArray.length > 0 && cactusArray[0].x < -cactus3width) {
    cactusArray.shift();
  }
}

function handleInput(e) {
  // Start music on first interaction
  if (!musicStarted) {
    bgMusic.play().catch(() => {});
    musicStarted = true;
  }

  if (gameover) {
    if (e.code == "Space") {
      restartGame();
    }
    return;
  }

  // Jump logic
  if ((e.code == "Space" || e.code == "ArrowUp") && dinomax.y == dinoY) {
    velocityY = -10;

    // Play jump sound (resetting time allows rapid-fire jumping sounds)
    jumpSound.currentTime = 0;
    jumpSound.play();
  }
}

function triggerGameOver() {
  gameover = true;
  dinomaxIMG.src = "./img/dino-dead.png";
  bgMusic.pause();

  // Visual Overlay
  context.fillStyle = "rgba(0,0,0,0.6)";
  context.fillRect(0, 0, boardWidth, boardHeight);

  context.fillStyle = "white";
  context.textAlign = "center";
  context.font = "bold 40px Arial";
  context.fillText("GAME OVER", boardWidth / 2, boardHeight / 2 - 20);

  context.font = "20px Arial";
  context.fillText(
    "Final Score: " + Math.floor(score),
    boardWidth / 2,
    boardHeight / 2 + 20,
  );

  context.fillStyle = "#FFD700";
  context.fillText(
    "PRESS SPACE TO REPLAY",
    boardWidth / 2,
    boardHeight / 2 + 60,
  );
  context.textAlign = "left";
}

function restartGame() {
  score = 0;
  cactusArray = [];
  gameover = false;
  velocityY = 0;
  dinomax.y = dinoY;
  dinomaxIMG.src = "./img/dino.png";

  bgMusic.currentTime = 0;
  bgMusic.play();
}

function thecactus() {
  if (gameover) return;

  let cactus = {
    img: null,
    x: cactusX,
    y: cactusY,
    width: 0,
    height: cactusheight,
  };

  let chance = Math.random();
  if (chance > 0.7) {
    cactus.img = cactus3IMG;
    cactus.width = cactus3width;
  } else if (chance > 0.4) {
    cactus.img = cactus2IMG;
    cactus.width = cactus2width;
  } else {
    cactus.img = cactus1IMG;
    cactus.width = cactus1width;
  }

  cactusArray.push(cactus);
}

function collisionshape2d(a, b) {
  let ax = a.x + dinoHitbox.xOffset;
  let ay = a.y + dinoHitbox.yOffset;
  let aw = dinoHitbox.width;
  let ah = dinoHitbox.height;

  return (
    ax < b.x + b.width && ax + aw > b.x && ay < b.y + b.height && ay + ah > b.y
  );
}
