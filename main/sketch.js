import * as BasicTower from "./towers/basic_tower.js";
import { Car } from "./cars/basic_car.js";

let towers = [];
export let cars = [];
let projectiles = []
let testCar;
let path1;

let carsPerLevel = 20; // # of cars for first level
let carsSpawned = 0;
let spawnTimer = 0; //Countdown time for next spawn

let mapImage;

export function preload() {
  mapImage = loadImage("./assets/board_demo.png");
}

export function setup() {
  createCanvas(640, 480);

  // Test tower
  const tower = new Tower(BasicTower.draw, BasicTower.update);
  tower.obj = {
    position: createVector(300, 300),
  };
  towers.push(tower);

  path1 = [
    createVector(-17.6, 150),
    createVector(360, 150),
    createVector(360, 270),
    createVector(80, 270),
    createVector(80, 396),
    createVector(657.6, 396),
  ]
  
  setNextSpawnTimer();
}

export function draw() {
  background(220);
  image(mapImage, 0, 0);
  noStroke();
  // rect(-5, 100, 250, 45);
  // rect(205, 100, 45, 150);
  // rect(25, 205, 225, 45);
  // rect(25, 205, 45, 150);
  // rect(25, 310, 400, 45);

  for (let tower of towers) {
    tower.update();
  }
  for (let tower of towers) {
    tower.draw();
  }

  spawnTimer--;
  if (spawnTimer <= 0 && carsSpawned < carsPerLevel) {
    spawnCar();
    carsSpawned++;
    setNextSpawnTimer();
  }

  for (let i = cars.length - 1; i >= 0; i--) {
    let car = cars[i];
    car.update();
    car.draw();

    //Remove car from array at death or end of map
    if (car.isFinished || car.isDead()) {
      cars.splice(i, 1);
    }
  }

}

export function spawnCar() {
  //create new car with created path
  let newCar = new Car(path1, random(1, 2.5), 100);
  cars.push(newCar);
}

export function setNextSpawnTimer() {
  //picks between 1 second at 2.5 seconds
  spawnTimer = random(60, 150); //at 60 fps
}

// yet to be implemented. takes a position, returns the nearest car
// object, whatever that looks like.
export function getNearestCar(x, y) {
  // TODO: make this target the nearest car like the name
  if (cars.length > 0) {
    return cars[0].pos; //targets car safer
  }

  //if no car is present, targets dummy pos (prevent crash)
  return {x: Infinity, y: Infinity};
}
// Tower constructor. could be called like new Tower(whatever)
function Tower(draw, update) {
  // called every frame to draw // TODO: he tower on the screen maybe takes
  // a position, or maybe uses the position stored in the object
  this.draw = draw;
  // runs the actual game code, called every frame.
  //
  // for the basic tower, this would probably get a timestamp, and
  // compare it to a local variable lastFiredTimestamp. if the
  // difference is greater than a second, call getNearestCar. If its
  // within a certain radius, fire a new Projectile() with the
  // position of the tower, and with a velocity pointing towards the
  // car. then, update lastFiredTimestamp to the current timestamp,
  // so that a second or so will be waited again.
  this.update = update;
  // local data for this tower; varies between towers; composition
  // over inheritance!
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

// A function to place a tower at a position.
function placeTower(tower, x, y) {

}
