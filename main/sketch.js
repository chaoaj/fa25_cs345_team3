import * as BasicTower from "./towers/basic_tower.js";
import { Car } from "./cars/basic_car.js";
import * as Constants from "./constants.js";

let towers = [];
export let cars = [];
export let projectiles = [];
let testCar;
let path1;
let path2;
let path3;
let path;

let carsPerLevel = 20; // # of cars for first level
let carsSpawned = 0;
let spawnTimer = 0; //Countdown time for next spawn

let mapImage;
let placeImage;

// Checks an image lookup to see if a tower can be placed at
// position. Green pixel=tower can be placed, red pixel=tower cannot
// be placed.
function canPlaceAt(x, y) {
  // Return false if the tower is out of bounds.
  if (x < 0 || x > Constants.mapWidth || y < 0 || y > Constants.mapHeight) {
    return false;
  }
  // Get the pixel
  const pixel = placeImage.get(x, y);
  // Get the color channels that we use
  const red = pixel[0];
  const green = pixel[1];
  // To account for image weirdness, the pixel is considered "green"
  // so long as it is more green than red.
  return green > red;
}

//state variable for tower being dragged
let towerBeingPlaced = null;

// --- NEW: Data-driven array for the tower menu ---
// To add a new tower, just add a new object to this array.
const towerMenu = [
  {
    name: "Basic Tower",
    cost: 0,
    // This function creates the actual tower object
    create: () => new Tower(BasicTower.draw, BasicTower.update),
    // This function draws the icon in the menu
    drawIcon: (x, y) => {
      push();
      translate(x, y); // Center the drawing
      stroke(0);
      fill(...BasicTower.bodyColor); // bodyColor
      circle(0, 0, BasicTower.bodyCircleSize);
      fill(...BasicTower.turretColor); // turretColor
      rect(...BasicTower.bodyTurretSize);
      pop();
    },
    // These will be populated by the draw() loop
    menuX: 0,
    menuY: 0,
    menuSize: 40 // The click-able radius
  },
  // --- EXAMPLE: Add a new tower here ---
  // {
  //   name: "Stop sign",
  //   cost: 150,
  //   create: () => new Tower(CannonTower.draw, CannonTower.update),
  //   drawIcon: (x, y) => {
  //     push();
  //     translate(x, y);
  //     fill('blue');
  //     rectMode(CENTER);
  //     square(0, 0, 30);
  //     rect(10, 0, 20, 10);
  //     pop();
  //   },
  //   menuX: 0, menuY: 0, menuSize: 40
  // },
];

export function preload() {
  mapImage = loadImage("./assets/board2.png");
  placeImage = loadImage("./assets/board2_placemap.png");
}

export function setup() {
  createCanvas(Constants.mapWidth + Constants.mapWidth, Constants.mapHeight);

  // Test tower
  const tower = new Tower(BasicTower.draw, BasicTower.update);

  path1 = [ // map 1
    createVector(-17.6, 150),
    createVector(360, 150),
    createVector(360, 270),
    createVector(80, 270),
    createVector(80, 396),
    createVector(657.6, 396),
  ];
  path2 = [ // key shape
    createVector(100, -20),
    createVector(100, 100),
    createVector(500, 100),
    createVector(500, 200),
    createVector(100, 200),
    createVector(100, 300),
    createVector(375, 300),
    createVector(375, 400),
    createVector(-20, 400),
  ]

  path2 = [ // key shape
    createVector(100, -20),
    createVector(100, 100),
    createVector(500, 100),
    createVector(500, 200),
    createVector(100, 200),
    createVector(100, 300),
    createVector(375, 300),
    createVector(375, 400),
    createVector(-20, 400),
  ]
  
  path3 = [ // 4 corners
    createVector(280, -20),
    createVector(280, 175),
    createVector(75, 175),
    createVector(75, 75),
    createVector(175, 75),
    createVector(175, 405),
    createVector(75, 405),
    createVector(75, 305),
    createVector(565, 305),
    createVector(565, 405),
    createVector(465, 405),
    createVector(465, 75),
    createVector(565, 75),
    createVector(565, 175),
    createVector(360, 175),
    createVector(360, -20),
  ]

  path = path2; // set equal to whatever level player is on

  setNextSpawnTimer();
}

export function draw() {
  image(mapImage, 0, 0);
  
  for (let i = 0; i < path.length - 1; i++) {
    line(path[i].x, path[i].y, path[i+1].x, path[i+1].y);
  }

  for (let tower of towers) {
    if (!tower.obj.isGhost) {
      tower.update();
    }
  }
  for (let tower of towers) {
    tower.draw();
  }
  for (let proj of projectiles) {
    proj.draw();
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

  if (towerBeingPlaced) {
    //make ghost tower follow mouse
    towerBeingPlaced.obj.position.x = mouseX;
    towerBeingPlaced.obj.position.y = mouseY;
    towerBeingPlaced.obj.canPlace = canPlaceAt(mouseX, mouseY);
    towerBeingPlaced.draw();
  }

  //Menu for towers
  fill('tan');
  rect(Constants.mapWidth, 0, Constants.menuWidth, Constants.mapHeight);
  noFill();
  // Draw border
  stroke('black');
  rect(Constants.mapWidth + Constants.menuBorderPadding, Constants.menuBorderPadding, 180, 480 - 2 * Constants.menuBorderPadding);

  // --- Draw tower buttons from the menu array ---
  const menuX = Constants.mapWidth;
  const col1X = menuX + Constants.menuWidth / 4;
  const col2X = menuX + (Constants.menuWidth / 4) * 3;
  const buttonSpacing = 70; // Space between rows
  const startY = 60; // Top padding

  towerMenu.forEach((towerType, index) => {
    let col = index % 2;
    let row = Math.floor(index / 2);

    // Calculate and store the button's position
    let x = (col === 0) ? col1X : col2X;
    let y = startY + row * buttonSpacing;
    towerType.menuX = x;
    towerType.menuY = y;

    // Draw the button icon
    towerType.drawIcon(x, y);

    // Draw cost
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    text(`$${towerType.cost}`, x, y + 25);
  });
  for (let projectile of projectiles) {
    projectile.update();
    projectile.draw();
  }
}

export function spawnCar() {
  //create new car with created path
  let newCar = new Car(path2, random(1, 2.5), 100);
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
  return { x: Infinity, y: Infinity };
}

//Function to add mouse pressed functionality
export function mousePressed() {
  if (towerBeingPlaced !== null) {
    if (canPlaceAt(mouseX, mouseY)) {
      towerBeingPlaced.obj.isGhost = false;
      towerBeingPlaced.obj.position = createVector(mouseX, mouseY);
      towers.push(towerBeingPlaced);
      towerBeingPlaced = null;
    } else if (mouseX >= 640) {
      // Remove ghost tower if the tower is being placed back in the
      // menu.
      towerBeingPlaced = null;
    }
    return;
  }

  for (const towerType of towerMenu) {
    if (dist(mouseX, mouseY, towerType.menuX, towerType.menuY) < towerType.menuSize / 2) {
      towerBeingPlaced = towerType.create();
      towerBeingPlaced.obj = {
        position: createVector(mouseX, mouseY),
        isGhost: true
      };
      break;
    }
  }
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
//function placeTower(tower, x, y) {

//}
