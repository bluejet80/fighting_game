/// helper functions

const movePlayer = function () {
  player.velocity.x = 0;
  if (keys.a.pressed && player.lastkey === "a" && player.position.x > 0) {
    player.velocity.x = -5;
  }
  if (
    keys.d.pressed &&
    player.lastkey === "d" &&
    player.position.x < canvas.width - player.width
  ) {
    player.velocity.x = 5;
  }
};

const moveEnemyAuto = function () {
  const { x, y } = player.position;
  const { x: eX, y: eY } = enemy.position;
  if (x < eX) {
    enemy.velocity.x = -5;
  }
  if (x > eX) {
    enemy.velocity.x = 5;
  }
};

const moveEnemy = function () {
  enemy.velocity.x = 0;
  if (
    keys.ArrowRight.pressed &&
    enemy.lastkey === "ArrowRight" &&
    enemy.position.x < canvas.width - enemy.width
  ) {
    enemy.velocity.x = 5;
  }
  if (
    keys.ArrowLeft.pressed &&
    enemy.lastkey === "ArrowLeft" &&
    enemy.position.x > 0
  ) {
    enemy.velocity.x = -5;
  }
};

const jump = function (char) {
  if (char.position.y > canvas.height / 2) {
    char.velocity.y = -20;
  }
};
// Determine winner
const determineWinner = function ({ player, enemy, timerId, animateId }) {
  window.cancelAnimationFrame(animateId);
  clearTimeout(timerId);
  resultDisplay.style.display = "flex";
  if (player.health === enemy.health) {
    resultDisplay.textContent = "Tie";
  }
  if (player.health < enemy.health) {
    resultDisplay.textContent = "Enemy Wins!";
  }
  if (player.health > enemy.health) {
    resultDisplay.textContent = "Player Wins!";
  }
};

/// timer functionality
let timer = 10;
let timerId;
const timerEle = document.getElementById("timer");
const resultDisplay = document.getElementById("result");
const decreaseTimer = function () {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    timerEle.textContent = timer;
  }
  if (timer === 0) {
    determineWinner({ player, enemy, animateId });
  }
};
decreaseTimer();

/// collision detection

const rectangularCollision = function ({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
};

const enemyHealth = document.getElementById("enemy-health");
const playerHealth = document.getElementById("player-health");

const colDetectPlayer = function () {
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.health -= 5;
    enemyHealth.style.width = enemy.health + "%";
    //console.log("hit!!");
  }
};

const colDetectEnemy = function () {
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.health -= 5;
    playerHealth.style.width = player.health + "%";
    //console.log("Player-hit!!");
  }
};
