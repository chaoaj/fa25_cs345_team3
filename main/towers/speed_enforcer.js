import { cars, aircraftImage, speedLimitSign } from "../sketch.js";
import * as Constants from "../constants.js";

export const cost = 315;
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
    if (this.obj.cooldown === undefined) this.obj.cooldown = 0;
    if (this.obj.planeActive === undefined) this.obj.planeActive = false;
    if (this.obj.planeX === undefined) this.obj.planeX = -200;

    //Explosion array
    if (this.obj.explosions === undefined) this.obj.explosions = [];

    if (this.obj.cooldown > 0) {
        this.obj.cooldown--;
    }

    if (this.obj.planeActive) {
        this.obj.planeX += 25; // planeSpeed
        if (this.obj.planeX > Constants.mapWidth + 200) {
            this.obj.planeActive = false;
        }
    }

    for (let i = this.obj.explosions.length - 1; i >= 0; i--) {
        let p = this.obj.explosions[i];
        p.life -= 17;      // Fade out speed
        p.size += 6;    // Expansion speed

        if (p.life <= 0) {
            this.obj.explosions.splice(i, 1); // Remove dead particle
        }
    }

    if (this.obj.cooldown <= 0 && !this.obj.planeActive) {
        let carsInRange = false;
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
            for (let i = 0; i < 15; i++) {
                obj.explosions.push({
                    x: car.pos.x + random(-20, 20),
                    y: car.pos.y + random(-20, 20),
                    size: random(3, 7),
                    color: random(['#FF0000', '#FF4500', '#FFA500', '#FFFF00']),
                    life: 255
                });
            }
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

    // Check if image exists before trying to draw
    if (speedLimitSign) {
        imageMode(CENTER);
        // Draw the image.
        image(speedLimitSign, 0, -30, 75, 55);
    } else {
        // Fallback placeholder just in case image doesn't load
        fill(postColor); rect(0, -15, 10, 30);
    }

    pop();

    if (!this.obj.isGhost && this.obj.planeActive && aircraftImage) {
        push();
        translate(this.obj.planeX, this.obj.position.y);

        rotate(PI / 2);

        imageMode(CENTER);
        image(aircraftImage, 0, 0, 80, 80);
        pop();
    }

    //draw explosions
    if (this.obj.explosions) {
        push();
        noStroke();
        for (let p of this.obj.explosions) {
            // Set the color with the current transparency (alpha)
            let c = color(p.color);
            c.setAlpha(p.life);
            fill(c);

            // Draw the expanding circle
            circle(p.x, p.y, p.size);
        }
        pop();
    }
}

/**
 * Draws the icon for the tower menu
 * @param {number} x - The x coordinate of the menu button center
 * @param {number} y - The y coordinate of the menu button center
 */
export function drawIcon(x, y) {
    push();
    translate(x, y);

    // Check if image exists before trying to draw
    if (speedLimitSign) {
        imageMode(CENTER);
        image(speedLimitSign, 0, 0, 60, 40);
    } else {
        rectMode(CENTER);
        fill(255);
        stroke(0);
        rect(0, 0, 30, 25);
        noStroke();
        fill(0);
        textSize(4);
        textAlign(CENTER, CENTER);
        text("SPEED\nLIMIT", 0, 0);
    }

    pop();
}
