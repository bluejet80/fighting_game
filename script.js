const canvas = document.getElementById("game");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

//create the charaters

// because we pass the constructor arguments as an object, their order doesnt matter
// and they are not required

const gravity = 0.7;

class Sprite {
  constructor({ position, velocity, color = "red", offset }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.laskKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 100,
      height: 50,
      offset,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
  }

  draw() {
    const attackBoxPos = this.attackBox.position;
    const { x, y } = this.position;
    c.fillStyle = this.color;
    c.fillRect(x, y, this.width, this.height);

    // attackBox
    if (this.isAttacking) {
      c.fillStyle = "green";
      c.fillRect(
        attackBoxPos.x,
        attackBoxPos.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }
  update() {
    this.draw();
    //offset attackbox for enemy
    this.attackBox.position.x = this.position.x - this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}

// create players

const player = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
});

const enemy = new Sprite({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: 50,
    y: 0,
  },
});

// keys object

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

// helper functions

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

/// timer functionality
let timer = 60;
const timerEle = document.getElementById("timer");
const decreaseTimer = function () {
  if (timer > 0) {
    setTimeout(decreaseTimer, 1000);
    timer--;
    timerEle.textContent = timer;
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
    console.log("hit!!");
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
    console.log("Player-hit!!");
  }
};

// animation loop
const animate = function () {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update("green");
  enemy.update("red");
  movePlayer();
  moveEnemy();
  colDetectPlayer();
  colDetectEnemy();
};

animate();

// event listeners

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      player.lastkey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.lastkey = "a";
      break;
    case "w":
      jump(player);
      break;
    case " ":
      player.attack();
      break;

    // enemy movements
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastkey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastkey = "ArrowLeft";
      break;
    case "ArrowUp":
      jump(enemy);
      break;
    case "Control":
      enemy.attack();
      break;
  }
  //console.log(event.key);
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
