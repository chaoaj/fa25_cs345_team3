import { cars } from "../sketch.js";

export class Car {

  constructor(path, speed = 2, health = 100) {
    // returns object with all of cars data

    this.path = path;
    this.pos = path[0].copy();
    this.targetWaypointIndex = 1;
    this.speed = speed;
    this.velocity = createVector(0, 0);
    this.isFInished = false;

    // health tracking atributes
    this.maxHealth = health;
    this.currenthealth = health;

    // Shape and appearances
    this.bodyWidth = 25;
    this.bodyHeight = 14;
    this.bodyColor = color('red');
    this.windowColor = color('grey');
    this.tireColor = color('black');

  }

  draw() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.velocity.heading());

    rectMode(CENTER);
    noStroke();

    fill(this.tireColor);
    rect(-this.bodyWidth / 3, -this.bodyHeight, 2 - 1, 6, 2);
    rect(this.bodyWidth / 3, -this.bodyHeight, 2 - 1, 6, 2);
    rect(-this.bodyWidth / 3, this.bodyHeight, 2 - 1, 6, 2);
    rect(this.bodyWidth / 3, this.bodyHeight, 2 - 1, 6, 2);

    fill(this.bodyColor);
    rect(0, 0, this.bodyWidth, this.bodyHeight, 3);

    fill(this.windowColor);
    rect(this.bodyWidth / 6, 0, this.bodyHeight / 2.5, this.bodyHeight - 2, 2);
    pop();
  }

  takeDamage(amount) {
    this.currenthealth -= amount;
  }

  carIsDead() {
    return this.currenthealth <= 0;

  }

  update() {
    if (this.isFinished) {
      return;
    }

    if (this.carIsDead(this)) {
      cars.splice(cars.indexOf(this), 1);
      return;
    }

    if (this.targetWaypointIndex >= this.path.length) {
      this.isFinished = true;
      return;
    }

    let target = this.path[this.targetWaypointIndex]

    let direction = p5.Vector.sub(target, this.pos)

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
