import * as BasicTower from "./towers/basic_tower.js";
import { Car } from "./cars/basic_car.js";

let towers = [];
export let cars = [];
let testCar;


export function setup() {
  createCanvas(400, 400);

  // Test tower
  const tower = new Tower(BasicTower.draw, BasicTower.update);
  tower.obj = {
    position: createVector(300, 300),
  };
  towers.push(tower);

  //fake path
  let fakePath = [
    createVector(100, 200),
    createVector(150, 250),
    createVector(200, 250),
    //add more vectrors to sim real path
  ];

  testCar = new Car(fakePath);
  cars.push(testCar);
}

export function draw() {
  background(220);
  //map1
  noStroke();
  rect(-5, 100, 250, 45);
  rect(205, 100, 45, 150);
  rect(25, 205, 225, 45);
  rect(25, 205, 45, 150);
  rect(25, 310, 400, 45);
  
  for (let tower of towers) {
    tower.update();
  }
  for (let tower of towers) {
    tower.draw();
  }

  testCar.update();
  testCar.draw();

}



// Ephram and Joesph


// yet to be implemented. takes a position, returns the nearest car
// object, whatever that looks like.
export function getNearestCar(x, y) {
  return cars[0].pos;
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
