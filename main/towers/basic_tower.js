import { basicTowerProjectile } from "../projectiles/basic_tower_proj.js";
import { cars, getNearestCar } from "../sketch.js";

export function getFirstCar() {
  return cars[0].pos;
}

const bodyColor = [255, 0, 0];
const turretColor = [200, 200, 200];
// How many pixels away the tower can shoot
const firingRange = 200;

// this method should fire a projectile at the nearest/first car
export function fire(pos) {
  // This code isn't going to work, make a projectiles array in
  // sketch.js or something, push to that, and call proj.draw in draw
  let proj = new basicTowerProjectile(pos, getFirstCar(), 10, 10);
  projectiles.push(proj);

  getFirstCar().copy();
}

export function update() {
  this.obj.target = getNearestCar(this.obj.position.x, this.obj.position.y);
  // TODO: Add some way of getting a timestamp so this can have a cooldown
  const enoughTimeElapsed = frameCount % 60 === 0; // Placeholder: every second
  // Check whether the nearest car is close enough.
  const distanceToTarget = dist(
    this.obj.target.x,
    this.obj.target.y,
    this.obj.position.x,
    this.obj.position.y
  );
  if (enoughTimeElapsed && distanceToTarget < firingRange) {
    // TODO: Fire a projectile once those are implemented
    console.log("Fire!");
    fire(this.obj.position);
  }
}

export function draw() {
  stroke(0, 0, 0);
  fill(...bodyColor);
  circle(this.obj.position.x, this.obj.position.y, 25);
  // Point the turret at the mouse
  translate(this.obj.position.y, this.obj.position.x);
  rotate(
    Math.atan2(
      this.obj.target.y - this.obj.position.y,
      this.obj.target.x - this.obj.position.x
    )
  );
  fill(...turretColor);
  rect(-5, -5, 30, 10);
  resetMatrix();
}
