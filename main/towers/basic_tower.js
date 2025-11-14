import { basicTowerProjectile } from "../projectiles/basic_tower_proj.js";
import { cars, getNearestCar, projectiles } from "../sketch.js";

const allowTint = [100, 255, 100];
const denyTint = [255, 100, 100];

export const bodyColor = [255, 0, 0];
export const turretColor = [200, 200, 200];
export const bodyCircleSize = 25;
export const bodyTurretSize = [-5, -5, 30, 10];

// How many pixels away the tower can shoot
const firingRange = 200;

// this method should fire a projectile at the nearest/first car
export function fire(pos, target) {
  // This code isn't going to work, make a projectiles array in
  // sketch.js or something, push to that, and call proj.draw in draw
  let proj = new basicTowerProjectile(pos, target);
  projectiles.push(proj);
}

export function update() {
  this.obj.target = getNearestCar(this.obj.position.x, this.obj.position.y);
  // TODO: Add some way of getting a timestamp so this can have a
  // cooldown. As it is now, all towers will fire in sync which is
  // lame. Also frameCount=bad
  const enoughTimeElapsed = frameCount % 45 === 0;
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
