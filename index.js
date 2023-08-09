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
  constructor({ position, imageSrc, scale = 1 }) {
    this.position = position;
    this.height = 150;
    this.width = 50;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
  }

  draw() {
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.image.width * this.scale,
      this.image.height * this.scale
    );
  }

  update() {
    this.draw();
  }
}

// create images

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 95,
  },
  imageSrc: "./img/shop.png",
  scale: 3,
});

// keys object

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

// animation loop
let animateId;
const animate = function () {
  animateId = window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  player.update("green");
  enemy.update("red");
  movePlayer();
  moveEnemy();
  colDetectPlayer();
  colDetectEnemy();
  // end game based on health
  if (enemy.health === 0 || player.health === 0) {
    determineWinner({ player, enemy, timerId, animateId });
  }
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
    case "Shift":
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
