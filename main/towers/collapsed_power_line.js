import { cars, getNearestCar } from "../sketch.js";
import { Tower} from "./tower.js";

const allowTint = [100, 255, 100];
const denyTint = [255, 100, 100];

export const poleColor = [200, 200, 200];
export const poleSize = [-5, -5, 75, 10];
export const cost = 210;

// How many pixels away the tower can shoot
export const firingRange = 10;

/**
 * Update function for the tower

 *
 * @this Tower
 */
export function update() {
  this.obj.target = getNearestCar(this.obj.position.x, this.obj.position.y);
  for (const car of cars) {
    const distanceToTarget = car.pos.dist(this.obj.position);

    if (distanceToTarget <= firingRange) {
      car.affectedByPowerPole = true;
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
  let localPoleColor;
  // Tint the colors
  if (this.obj.isGhost) {
    if (this.obj.canPlace) {
      localPoleColor = tintColor(poleColor, allowTint, 0.7);
    } else {
      localPoleColor = tintColor(poleColor, denyTint, 0.7);
    }
  } else {
    localPoleColor = poleColor;
  }
  stroke(0, 0, 0);
  translate(this.obj.position.x, this.obj.position.y);
  fill(...localPoleColor);
  rect(...poleSize);
  resetMatrix();
}
