import { cars, aircraftImage } from "../sketch.js";
import * as Constants from "../constants.js";

export const cost = 200;
export const range = 150; // The radius around the sign
const damage = 110; // High damage
const cooldownTime = 360; //5 seconds at 60 fps
const planeSpeed = 25; 

// Colors for the Sign
export const signColor = [255, 255, 255];
export const postColor = [50, 50, 50];

/**
 * Update function for the Aircraft Tower
 * @this Tower
 */
export function update() {
  // Initialize state variables if they don't exist yet
  if (this.obj.cooldown === undefined) this.obj.cooldown = 0;
  if (this.obj.planeActive === undefined) this.obj.planeActive = false;
  if (this.obj.planeX === undefined) this.obj.planeX = -200;

  if (this.obj.cooldown > 0) {
    this.obj.cooldown--;
  }

  if (this.obj.planeActive) {
    this.obj.planeX += planeSpeed;
    if (this.obj.planeX > Constants.mapWidth + 200) {
      this.obj.planeActive = false;
    }
  }

  if (this.obj.cooldown <= 0 && !this.obj.planeActive) {
    let carsInRange = false;

    // Check if ANY car is close to the SIGN
    for (const car of cars) {
      if (this.obj.position.dist(car.pos) <= range) {
        carsInRange = true;
        break;
      }
    }

    if (carsInRange) {
      triggerAirstrike(this.obj);
    }
  }
}

function triggerAirstrike(obj) {
  obj.cooldown = cooldownTime;

  // Start Plane Animation from the left
  obj.planeActive = true;
  obj.planeX = -100;

  // Deal AOE Damage to all cars near the sign
  for (const car of cars) {
    if (obj.position.dist(car.pos) <= range) {
      car.takeDamage(damage);
    }
  }
}

/**
 * Draw function for the Aircraft Tower
 * @this Tower
 */
export function draw() {

  push();
  translate(this.obj.position.x, this.obj.position.y);

  // Post
  fill(postColor);
  noStroke();
  rect(-2, 0, 4, 25);

  // Sign Board
  if (this.obj.isGhost) {
    fill(this.obj.canPlace ? [100, 255, 100] : [255, 100, 100]);
  } else {
    fill(signColor);
  }
  stroke(0);
  strokeWeight(1);
  rectMode(CENTER);
  rect(0, -15, 40, 30); // The sign body

  // Text on sign
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(6);
  text("SPEED\nLIMIT\nENFORCED\nBY AIRCRAFT", 0, -15);
  pop();

  if (!this.obj.isGhost && this.obj.planeActive && aircraftImage) {
    push();
    translate(this.obj.planeX, this.obj.position.y);

    rotate(PI / 2);

    imageMode(CENTER);
    image(aircraftImage, 0, 0, 80, 80);
    pop();
  }
}

export function drawIcon(x, y) {
  push();
  translate(x, y);
  rectMode(CENTER);
  fill(255);
  stroke(0);
  rect(0, 0, 30, 25);
  noStroke();
  fill(0);
  textSize(4);
  textAlign(CENTER, CENTER);
  text("AIRCRAFT\nLIMIT", 0, 0);
  pop();
}