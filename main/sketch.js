import * as BasicTower from "./towers/basic_tower.js";
import { Car } from "./cars/basic_car.js";
import * as Constants from "./constants.js";

// Check this variable for any debug displays or features that you want to add.
let DEBUG = false;

let towers = [];
export let cars = [];
export let projectiles = [];

let path1;
let path2;
let path3;
let path;

let carsPerLevel = 20; // # of cars for first level
let carsSpawned = 0;
let spawnTimer = 0; //Countdown time for next spawn
let currency = 0;

let mapImage;
let placeImage;

// Tower menu coordinates
let tmenuX;
let tmenuY;

// Whether a coordinate is in bounds of the screen
function inBounds(x, y) {
  return (
    x >= 0 && x <= Constants.mapWidth && y >= 0 && y <= Constants.mapHeight
  );
}

// Checks an image lookup to see if a tower can be placed at
// position. Green pixel=tower can be placed, red pixel=tower cannot
// be placed.
function canPlaceAt(x, y) {
  // Return false if the tower is out of bounds.
  if (!inBounds(x, y)) {
    return false;
  }
  // Get the pixel
  const pixel = placeImage.get(x, y);
  // Get the color channels that we use
  const red = pixel[0];
  const green = pixel[1];
  // To account for image weirdness, the pixel is considered "green"
  // so long as it is more green than red.
  if (green < red) {
    return false;
  }
  for (let tower of towers) {
    if (tower == towerBeingPlaced) {
      continue;
    }
    if (dist(tower.obj.position.x, tower.obj.position.y, x, y) < 20) {
      return false;
    }
  }
  return true;
}

//state variable for tower being dragged
let towerBeingPlaced = null;
let towerBeingMenued = null;

// --- NEW: Data-driven array for the tower menu ---
// To add a new tower, just add a new object to this array.
const towerMenu = [
  {
    name: "Basic Tower",
    cost: 0,
    // This function creates the actual tower object
    create: (name) => new Tower(BasicTower.draw, BasicTower.update, name),
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
    menuSize: 40, // The click-able radius
    menuPos: null,
    menuSize: 40, // The click-able radius
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
  const debugCheckbox = document.querySelector("#debug");
  DEBUG = debugCheckbox.checked;
  debugCheckbox.oninput = function () {
    DEBUG = debugCheckbox.checked;
  };
  createCanvas(Constants.mapWidth + Constants.mapWidth, Constants.mapHeight);

  path1 = [
    // map 1
    createVector(-17.6, 150),
    createVector(360, 150),
    createVector(360, 270),
    createVector(80, 270),
    createVector(80, 396),
    createVector(657.6, 396),
  ];
  path2 = [
    // key shape
    createVector(100, -20),
    createVector(100, 100),
    createVector(500, 100),
    createVector(500, 200),
    createVector(100, 200),
    createVector(100, 300),
    createVector(375, 300),
    createVector(375, 400),
    createVector(-20, 400),
  ];

  path2 = [
    // key shape
    createVector(100, -20),
    createVector(100, 100),
    createVector(500, 100),
    createVector(500, 200),
    createVector(100, 200),
    createVector(100, 300),
    createVector(375, 300),
    createVector(375, 400),
    createVector(-20, 400),
  ];

  path3 = [
    // 4 corners
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
  ];

  path = path2; // set equal to whatever level player is on

  setNextSpawnTimer();
}

export function draw() {
  image(mapImage, 0, 0);

  for (let tower of towers) {
    if (!tower.obj.isGhost) {
      tower.update();
    }
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
      if (car.isDead()) {
        currency += car.value();
      }
    }
  }

  for (let i = 0; i < projectiles.length; i++) {
    const projectile = projectiles[i];
    projectile.update();
    projectile.draw();

    // TODO: Check car collision
    // Remove a projectile if it is out of bounds.
    let hitCar = null;
    for (let car of cars) {
      if (car.pos.dist(projectile.pos) < car.colliderSize) {
        hitCar = car;
        break;
      }
    }
    if (hitCar) {
      hitCar.takeDamage(projectile.damage);
    }
    if (hitCar || !inBounds(projectile.pos.x, projectile.pos.y)) {
      projectiles.splice(i, 1);
      i--;
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
  fill("tan");
  rect(Constants.mapWidth, 0, Constants.menuWidth, Constants.mapHeight);
  noFill();
  // Draw border
  stroke("black");
  rect(
    Constants.mapWidth + Constants.menuBorderPadding,
    Constants.menuBorderPadding,
    180,
    480 - 2 * Constants.menuBorderPadding
  );

  // --- Draw tower buttons from the menu array ---
  const menuX = Constants.mapWidth;
  const col1X = menuX + Constants.menuWidth / 4;
  const col2X = menuX + (Constants.menuWidth / 4) * 3;
  const buttonSpacing = 70; // Space between rows
  const startY = 60; // Top padding

  towerMenu.forEach((towerType, index) => {
    let col = index % 2;
    let row = Math.floor(index / 2);

    // TODO: put this in setup somehow, because it doesn't need to be
    // recalculated every frame.
    const x = col === 0 ? col1X : col2X;
    const y = startY + row * buttonSpacing;
    towerType.menuPos = createVector(x, y);

    // Draw the button icon
    towerType.drawIcon(x, y);

    // Draw cost
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    text(`$${towerType.cost}`, x, y + 25);
  });

  if (towerBeingMenued) {
    tmenuX = towerBeingMenued.obj.position.x + 20;
    tmenuY = towerBeingMenued.obj.position.y;

    // Make sure that the menu doesn't go below the screen
    tmenuY = Math.min(
      tmenuY,
      Constants.mapHeight - Constants.towerMenuHeight - 10
    );
    fill("tan");
    rect(tmenuX, tmenuY, Constants.towerMenuWidth, Constants.towerMenuHeight);
    fill(0, 0, 0);
    textAlign(LEFT, TOP);
    text(`${towerBeingMenued.name}`, tmenuX, tmenuY);
    fill(255, 0, 0);
    // TODO: make some sort of button asset for this :3
    rect(
      tmenuX + 10,
      tmenuY +
        Constants.towerMenuHeight -
        Constants.towerMenuCloseButtonSize -
        10,
      Constants.towerMenuCloseButtonSize,
      Constants.towerMenuCloseButtonSize
    );
  }

  // Draw the lines if debug mode is on
  if (DEBUG) {
    stroke(255, 0, 0);
    for (let i = 0; i < path.length - 1; i++) {
      line(path[i].x, path[i].y, path[i + 1].x, path[i + 1].y);
    }
    for (let car of cars) {
      stroke(0, 0, 0, 0);
      fill(255, 255, 0, 100);
      // Draw car colliders
      circle(car.pos.x, car.pos.y, car.colliderSize);
    }
  }
  textAlign(RIGHT, TOP);
  textSize(16);
  fill(0);
  noStroke();
  text(`Money: $${currency}`, Constants.mapWidth - 10, 10);
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
  let pos = createVector(x, y);
  let nearestCar = createVector(Infinity, Infinity);
  let dist = pos.dist(nearestCar);
  for (let car of cars) {
    let carDist = pos.dist(car.pos);
    if (carDist < dist) {
      nearestCar = car.pos;
      dist = carDist;
    }
  }
  return nearestCar;
}

//Function to add mouse pressed functionality
export function mousePressed() {
  const mouseVector = createVector(mouseX, mouseY);
  // If there is a tower being placed, then clicking the mouse should
  // place the tower
  if (towerBeingPlaced) {
    if (canPlaceAt(mouseVector.x, mouseVector.y)) {
      towerBeingPlaced.obj.isGhost = false;
      towerBeingPlaced.obj.position = mouseVector.copy();
      towers.push(towerBeingPlaced);
      towerBeingPlaced = null;
    } else if (mouseVector.x >= Constants.mapWidth) {
      // Remove ghost tower if the tower is being placed back in the
      // menu.
      towerBeingPlaced = null;
    }
    return;
  }

  let somethingClicked = false;

  // Check for a click to the menu TODO: It'd be neat if checking if a
  // vector collided with a rectangle (AABB) was its own function,
  // because i just wrote it twice.
  if (
    mouseX >= tmenuX &&
    mouseX < tmenuX + Constants.towerMenuWidth &&
    mouseY >= tmenuY &&
    mouseY < tmenuY + Constants.towerMenuHeight
  ) {
    somethingClicked = true;
    // Check if the close button was clicked

    // TODO: Duplicated logic for placing the menu and clicking the
    // menu WILL cause a bug at some point.
    const beginX = tmenuX + 10;
    const endX = beginX + Constants.towerMenuCloseButtonSize;
    const beginY =
      tmenuY +
      Constants.towerMenuHeight -
      Constants.towerMenuCloseButtonSize -
      10;
    const endY = beginY + Constants.towerMenuCloseButtonSize;
    if (
      mouseX >= beginX &&
      mouseX < endX &&
      mouseY >= beginY &&
      mouseY < endY
    ) {
      // Jankily remove the tower
      towers = towers.filter(function (t) {
        return t != towerBeingMenued;
      });
      towerBeingMenued = null;
    }
  }

  // Check if a tower in the tower purchase menu was clicked
  for (const towerType of towerMenu) {
    if (
      dist(mouseX, mouseY, towerType.menuX, towerType.menuY) <
      towerType.menuSize / 2
    ) {
      towerBeingPlaced = towerType.create();
      if (mouseVector.dist(towerType.menuPos) < towerType.menuSize / 2) {
        towerBeingPlaced = towerType.create(towerType.name);
        towerBeingPlaced.obj = {
          position: createVector(mouseX, mouseY),
          isGhost: true,
        };
        somethingClicked = true;
        break;
      }
    }

    // If nothing was clicked so far, check if any tower was clicked
    if (!somethingClicked) {
      for (let tower of towers) {
        //                                         TODO: get rid of this magic number
        if (mouseVector.dist(tower.obj.position) < 30) {
          towerBeingMenued = tower;
          somethingClicked = true;
          break;
        }
      }
    }
    // If nothing was clicked, close the tower popup menu
    if (!somethingClicked) {
      towerBeingMenued = null;
    }
  }

  // Tower constructor. could be called like new Tower(whatever)
  function Tower(draw, update, name) {
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
    this.name = name;
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
}
