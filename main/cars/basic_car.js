//removed because circular dependency made game crash
//import { cars } from "../sketch.js";

export class Car {
  /**
   * Size of the collision circle of the car.
   *
   * @type {number}
   */
  colliderSize = 30;

  /**
   * Returns an object with all of the car's data.
   *
   * @param {p5.Vector[]} path The path that the car follows
   * @param {number} speed How fast the car is
   * @param {number} health how much damage the car can take before it breaks
   */
  constructor(path, speed = 2, health = 100) {
    /** The path that the car follows @property {p5.Vector[]} */
    this.path = path;
    /** The current position of the car @property {Vector} */
    this.pos = path[0].copy();
    /**
     * Which entry in the path the car is moving towards.
     *
     * @property {number}
     * @see path
     */
    this.targetWaypointIndex = 1;
    /** How fast the car moves. @property {number} */
    this.speed = speed;
    /** The velocity of the car @property {p5.Vector} */
    this.velocity = createVector(0, 0);
    /** Whether the car has reached the end or not @property {boolean} */
    this.isFinished = false;

    // health tracking attributes
    /** The total health that the car starts with. @property {number} */
    this.maxHealth = health;
    /** How much health the car has right now. @property {number} */
    this.currentHealth = health;

    // Shape and appearances
    /** @property {number} */
    this.bodyWidth = 25;
    /** @property {number} */
    this.bodyHeight = 14;
    /** @property {p5.Color} */
    this.bodyColor = color("brown");

    // Set the color based on the maximum health. Different cars have different colors
    if (this.maxHealth < 100) {
      this.bodyColor = color("brown");
    } else if (this.maxHealth < 200) {
      this.bodyColor = color("red");
    } else if (this.maxHealth < 400) {
      this.bodyColor = color("blue");
    } else {
      this.bodyColor = color("pink");
    }

    /** @property {p5.Color} */
    this.windowColor = color("grey");
    /** @property {p5.Color} */
    this.tireColor = color("black");
    this.affectedBySpeedCamera = false;
    this.affectedByPowerPole = false;
  }

  setSpeed(newSpeed) {
    this.speed = newSpeed;
  }

  draw() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.velocity.heading());

    //Added health bar drawing for testing purposes
    const healthBarWidth = this.bodyWidth;
    const healthBarHeight = 5;
    const healthBarOffset = -this.bodyHeight / 2 - healthBarHeight - 2;

    noStroke();
    fill(255, 0, 0);
    rect(
      -healthBarWidth / 2,
      healthBarOffset,
      healthBarWidth,
      healthBarHeight,
      2
    );

    const greenWidth = map(
      this.currentHealth,
      0,
      this.maxHealth,
      0,
      healthBarWidth
    );

    //draw green part
    fill(0, 255, 0);
    rect(-healthBarWidth / 2, healthBarOffset, greenWidth, healthBarHeight, 2);

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

  isDead() {
    return this.currentHealth <= 0;
  }

  value() {
    return 50;
  }

  update() {
    if (this.isFinished || this.isDead()) {
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
      let speed = this.speed;
      if (this.affectedBySpeedCamera) {
        speed *= 0.5;
      }
      if (this.affectedByPowerPole) {
        speed *= 0.8;
        this.takeDamage(0.25);
      }
      direction.mult(speed);
      this.velocity = direction;
      this.pos.add(this.velocity);
    }
  }
}
