import { cars, getNearestCar } from "../sketch.js";
import { Tower} from "./tower.js";

const allowTint = [100, 255, 100];
const denyTint = [255, 100, 100];

export const turretColor = [200, 200, 200];
export const bodyTurretSize = [-5, -5, 30, 10];
export const cost = 250;

// How many pixels away the tower can shoot
const firingRange = 75;

/**
 * Update function for the tower
 
 *
 * @this Tower
 */
export function update() {
  this.obj.target = getNearestCar(this.obj.position.x, this.obj.position.y);
  for (const car of cars) {
    const distanceToTarget = this.obj.target.dist(this.obj.position);

    if (distanceToTarget <= firingRange) {
      car.setSpeed(2); // Slow down the car to speed 1 when in range
    }
    if (distanceToTarget > firingRange) {
      // TODO: remember to fix this before committing!
      car.setSpeed(1); // Reset the car speed to normal when out of range
    }
  }
}

/**
 * Tint a base color with a tint color
 *
 * @param {number[]} base The base color
 * @param {number[]} tint The tint color
 * @param {number} n How much to tint.
 * @returns {number[]} the tinted color
 */
function tintColor(base, tint, n) {
  const ret = [];
  for (let i = 0; i < 3; i++) {
    ret.push(base[i] * (1 - n) + tint[i] * n);
  }
  return ret;
}

/**
 * Draw function for the tower
 *
 * @this Tower
 */
export function draw() {
  /** @type {number[]} */
  let localTurretColor;
  // Tint the colors
  if (this.obj.isGhost) {
    if (this.obj.canPlace) {
      localTurretColor = tintColor(turretColor, allowTint, 0.7);
    } else {
      localTurretColor = tintColor(turretColor, denyTint, 0.7);
    }
  } else {
    localTurretColor = turretColor;
  }
  /** @type {p5.Vector} */
  const target = this.obj.target ?? createVector(0, 0);
  stroke(0, 0, 0);
  // fill(...localBodyColor);
  // Point the turret at the mouse
  translate(this.obj.position.x, this.obj.position.y);
  rotate(
    Math.atan2(target.y - this.obj.position.y, target.x - this.obj.position.x)
  );
  fill(...localTurretColor);
  rect(...bodyTurretSize);
  resetMatrix();
}
