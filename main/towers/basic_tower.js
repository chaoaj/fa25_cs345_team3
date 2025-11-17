import { basicTowerProjectile } from "../projectiles/basic_tower_proj.js";
import { cars, getNearestCar, projectiles } from "../sketch.js";

const allowTint = [100, 255, 100];
const denyTint = [255, 100, 100];

export const bodyColor = [255, 0, 0];
export const turretColor = [200, 200, 200];
export const bodyCircleSize = 25;
export const bodyTurretSize = [-5, -5, 30, 10];
export const cost = 100;

// How many pixels away the tower can shoot
const firingRange = 200;

<<<<<<< Updated upstream
// this method should fire a projectile at the nearest/first car
=======
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
  this.cost = cost;
}


/**
 * This method should fire a projectile at the nearest/first car
 *
 * @param {p5.Vector} pos the position to start the projectile at.
 * @param {p5.Vector} target where the projectile is aimed at.
 */
>>>>>>> Stashed changes
export function fire(pos, target) {
  // This code isn't going to work, make a projectiles array in
  // sketch.js or something, push to that, and call proj.draw in draw
  let proj = new basicTowerProjectile(pos, target);
  projectiles.push(proj);
}

<<<<<<< Updated upstream
=======
/**
 * Update function for the tower
 *
 * @this Tower
 */
>>>>>>> Stashed changes
export function update() {
  this.obj.target = getNearestCar(this.obj.position.x, this.obj.position.y);
  // TODO: Add some way of getting a timestamp so this can have a
  // cooldown. As it is now, all towers will fire in sync which is
  // lame. Also frameCount=bad
  const enoughTimeElapsed = frameCount % 60 === 0;
  // Check whether the nearest car is close enough.
  const distanceToTarget = dist(
    this.obj.target.x,
    this.obj.target.y,
    this.obj.position.x,
    this.obj.position.y
  );
  if (enoughTimeElapsed && distanceToTarget < firingRange) {
    // TODO: Fire a projectile once those are implemented
    fire(this.obj.position, this.obj.target);
  }
}

function tintColor(base, tint, n) {
  let ret = [];
  for (let i = 0; i < 3; i++) {
    ret.push(base[i] * (1 - n) + tint[i] * n);
  }
  return ret;
}

<<<<<<< Updated upstream
=======
/**
 * Draw function for the tower
 *
 * @this Tower
 */
>>>>>>> Stashed changes
export function draw() {
  let localBodyColor;
  let localTurretColor;
  // Tint the colors
  if (this.obj.isGhost) {
    if (this.obj.canPlace) {
      localBodyColor = tintColor(bodyColor, allowTint, 0.7);
      localTurretColor = tintColor(turretColor, allowTint, 0.7);
    } else {
      localBodyColor = tintColor(bodyColor, denyTint, 0.7);
      localTurretColor = tintColor(turretColor, denyTint, 0.7);
    }
  } else {
    localBodyColor = bodyColor;
    localTurretColor = turretColor;
  }
  let target = this.obj.target ?? createVector(0, 0);
  stroke(0, 0, 0);
  fill(...localBodyColor);
  circle(this.obj.position.x, this.obj.position.y, bodyCircleSize);
  // Point the turret at the mouse
  translate(this.obj.position.x, this.obj.position.y);
  rotate(
    Math.atan2(
      target.y - this.obj.position.y,
      target.x - this.obj.position.x
    )
  );
  fill(...localTurretColor);
  rect(...bodyTurretSize);
  resetMatrix();
}
