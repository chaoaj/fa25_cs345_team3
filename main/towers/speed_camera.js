import { cars, getNearestCar } from "../sketch.js";

const allowTint = [100, 255, 100];
const denyTint = [255, 100, 100];

export const turretColor = [200, 200, 200];
export const bodyTurretSize = [-5, -5, 30, 10];
export const cost = 250;

// How many pixels away the tower can shoot
const firingRange = 75;

/**
 * @typedef {Object} TowerLocalData
 * @property {p5.Vector} position Where the tower is.
 * @property {boolean} isGhost True if the tower is being placed right now.
 * @property {boolean} canPlace True if the tower can be placed at the current position.
 * @property {p5.Vector} target Where the tower is aiming at.
 * @property {number} cost How much the tower costs.
 */

/**
 * Tower constructor. could be called like new Tower(whatever).
 *
 * @param {() => void} draw The function to draw the tower.
 * @param {() => void} update The function to update the tower.
 * @param {string} name What the name of the tower type is.
 */
export function Tower(draw, update, name) {
  /**
   * Called every frame to draw.
   *
   * @property {() => void}
   */
  this.draw = draw;
  /** runs the actual game code, called every frame. @property {() => void} */
  this.update = update;
  /** The name of the tower type @type {() => void} */
  this.name = name;
  // local data for this tower; varies between towers; composition
  // over inheritance!
  /** Local data for the tower @type {TowerLocalData} */
  this.obj = {};
  // Other possible properties:
  //  • position	- (x,y) coordinates
  //  • cost		- how much it costs to place it
  //  • upgrades	- some structure for the upgrades?
  //  • name          - what type of tower it is. might be used somewhere
  //  • isGhost       - while a tower is being placed, it is shown on the
  //                    screen, but it shouldn't fire at anything. if this
  //                    is true, then the tower doesn't actually exist,
  //                    and shouldn't fire or anything.
  // would have to have other code implemented to know what we need.
}

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
  fill(...localBodyColor);
  // Point the turret at the mouse
  translate(this.obj.position.x, this.obj.position.y);
  rotate(
    Math.atan2(target.y - this.obj.position.y, target.x - this.obj.position.x)
  );
  fill(...localTurretColor);
  rect(...bodyTurretSize);
  resetMatrix();
}
