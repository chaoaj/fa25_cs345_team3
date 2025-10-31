//removed because circular dependency made game crash
//import { cars } from "../sketch.js";

export class Car {
  constructor(path, speed = 2, health = 100) {
    // returns object with all of cars data

    this.path = path;
    this.pos = path[0].copy();
    this.targetWaypointIndex = 1;
    this.speed = speed;
    this.velocity = createVector(0, 0);
    this.isFinished = false;

    // health tracking attributes
    this.maxHealth = health;
    this.currentHealth = health;

    // Shape and appearances
    this.bodyWidth = 25;
    this.bodyHeight = 14;
    this.bodyColor = color("red");
    this.windowColor = color("grey");
    this.tireColor = color("black");
  }

  draw() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.velocity.heading());

    rectMode(CENTER);
    noStroke();

    //Draws tires
    fill(this.tireColor);
    rect(-this.bodyWidth / 3, -this.bodyHeight / 2 - 1, 6, 2); // Top-left
    rect(this.bodyWidth / 3, -this.bodyHeight / 2 - 1, 6, 2); // Top-right
    rect(-this.bodyWidth / 3, this.bodyHeight / 2 + 1, 6, 2); // Bottom-left
    rect(this.bodyWidth / 3, this.bodyHeight / 2 + 1, 6, 2); // Bottom-right

    fill(this.bodyColor);
    rect(0, 0, this.bodyWidth, this.bodyHeight, 3);

    fill(this.windowColor);
    rect(this.bodyWidth / 6, 0, this.bodyHeight / 2.5, this.bodyHeight - 2, 2);
    pop();
  }

  takeDamage(amount) {
    this.currentHealth -= amount;
  }

  carIsDead() {
    return this.currentHealth <= 0;
  }

  update() {
    if (this.isFinished || this.carIsDead()) {
      return;
    }

    if (this.targetWaypointIndex >= this.path.length) {
      this.isFinished = true;
      return;
    }

    let target = this.path[this.targetWaypointIndex];

    let direction = p5.Vector.sub(target, this.pos);

    if (direction.mag() < this.speed) {
      this.pos = target.copy();

      this.targetWaypointIndex++;

      if (this.targetWaypointIndex >= this.path.length) {
        this.isFinished = true;
      }
    } else {
      direction.normalize();
      direction.mult(this.speed);
      this.velocity = direction;
      this.pos.add(this.velocity);
    }
  }
}
