class Fighter {
  constructor({ position, velocity, color = "blue", offset }) {
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
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
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

const player = new Fighter({
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

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "red",
  offset: {
    x: 50,
    y: 0,
  },
});
