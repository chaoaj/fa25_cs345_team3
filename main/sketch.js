import * as BasicTower from "./towers/basic_tower.js";
import * as SpeedCamera from "./towers/speed_camera.js";
import * as CollapsedPowerLine from "./towers/collapsed_power_line.js";
import { Tower } from "./towers/tower.js";
import { Car } from "./cars/basic_car.js";
import * as Constants from "./constants.js";
import { basicTowerProjectile } from "./projectiles/basic_tower_proj.js";

// Check this variable for any debug displays or features that you want to add.
/** @type {boolean} */
let DEBUG = false;

/** @type {boolean} */
let paused = false;

/** @type {Tower[]} */
let towers = [];
/** @type {Car[]} */
export let cars = [];
/** @type {basicTowerProjectile[]} */
export let projectiles = [];

/** @type {p5.Vector[]} */
let path1;
/** @type {p5.Vector[]} */
let path2;
/** @type {p5.Vector[]} */
let path3;
/** @type {p5.Vector[]} */
let path;

let currency = 500;
let health = 100;

let gameWon = false;
let lastSpawn = 0;
let time = 0;
let carSpawnI = 0;

/**
 * Checks for collision with a rectangle and the mouse
 *
 * @param {number} bx x position of the top left corner of the rectangle
 * @param {number} by y position of the top left corner of the rectangle
 * @param {number} ex x position of the bottom right corner of the rectangle
 * @param {number} ey y position of the bottom right corner of the rectangle
 */
function mouseOnRect(bx, by, ex, ey) {
  const x = mouseX;
  const y = mouseY;
  return x > bx && x <= ex && y > by && y <= ey;
}

function s(x) {
  return x * 1000;
}

function w(x) {
  return -s(x);
}

let carSpawns = [
  w(7), s(1), s(1), s(1), s(1),
  w(0.5), s(0.5), s(0.5), s(0.5), s(0.5),
  w(0.5), s(0.5), s(0.5), s(0.5), s(0.5), s(0.5), s(0.5), s(0.5), s(0.5), s(0.5), s(0.5), s(0.5), s(0.5), s(0.5), s(0.5), s(0.5), s(0.5),
];

/** @type {p5.Image} */
let mapImage;
let mapImage1;
let mapImage2;
let magImage3;
/** @type {p5.Image} */
let placeImage;
let placeImage1;
let placeImage2;
let placeImage3;

// Tower menu coordinates
/** @type {number} */
let tmenuX;
/** @type {number} */
let tmenuY;

let menu = true; //runs menudraw until false
let mainMenu = true; //runs menudraw on menu
let credits = false; //says that credits was pressed
let levelSelect = false; //says that levelSelect was pressed

/**
 * Reset the game
 */
function reset() {
  paused = false;
  towers = [];
  cars = [];
  projectiles = [];
  currency = 500;
  health = 100;
  gameWon = false;
  lastSpawn = 0;
  time = 0;
  carSpawnI = 0;
  menu = true;
  mainMenu = true;
  credits = false;
  levelSelect = false;
}

/**
 * Whether a coordinate is in bounds of the screen.
 *
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
function inBounds(x, y) {
  return (
    x >= 0 && x <= Constants.mapWidth && y >= 0 && y <= Constants.mapHeight
  );
}

/**
 * Checks an image lookup to see if a tower can be placed at
 * position. Green pixel=tower can be placed, red pixel=tower cannot
 * be placed.
 *
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
function canPlaceAt(x, y) {
  // Return false if the tower is out of bounds.
  if (!inBounds(x, y)) {
    return false;
  }
  // Get the pixel
  /** @type {number[]} */
  const pixel = placeImage.get(x, y);
  // Get the color channels that we use
  const red = pixel[0];
  const green = pixel[1];
  // To account for image weirdness, the pixel is considered "green"
  // so long as it is more green than red.
  if (green < red) {
    return false;
  }
  for (const tower of towers) {
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
/** @type {Tower} */
let towerBeingPlaced = null;
/** @type {Tower} */
let towerBeingMenued = null;

/**
 * @typedef {Object} TowerMenuEntry
 * @property {string} name
 * @property {number} cost
 * @property {(name: string) => Tower} create
 * @property {(x: number, y: number) => void} drawIcon
 * @property {number} menuSize The click-able radius
 * @property {p5.Vector} menuPos the menu position
 */
// --- NEW: Data-driven array for the tower menu ---
// To add a new tower, just add a new object to this array.
/** @type {TowerMenuEntry[]} */
const towerMenu = [
  {
    name: "Basic Tower",
    cost: BasicTower.cost,
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
    menuSize: 40,
    menuPos: null,
  },
  {
    name: "Speed Camera",
    cost: SpeedCamera.cost,
    create: (name) => new Tower(SpeedCamera.draw, SpeedCamera.update, name),
    drawIcon: (x, y) => {
      push();
      translate(x, y);
      stroke(0);
      // fill(...SpeedCamera.bodyColor);
      // circle(0, 0, SpeedCamera.bodyCircleSize);
      fill(...SpeedCamera.turretColor);
      rect(...SpeedCamera.bodyTurretSize);
      pop();
    },
    menuSize: 40,
    menuPos: null,
  },
  {
    name: "Collapsed Power Line",
    cost: CollapsedPowerLine.cost,
    create: (name) => new Tower(CollapsedPowerLine.draw, CollapsedPowerLine.update, name),
    drawIcon: (x, y) => {
      push();
      translate(x, y);
      stroke(0);
      fill(...CollapsedPowerLine.poleColor);
      rect(...CollapsedPowerLine.poleSize);
      pop();
    },
    menuSize: 40,
    menuPos: null,
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
  mapImage1 = loadImage("./assets/board_demo.png");
  placeImage1 = loadImage("./assets/board1_placemap.png");
  mapImage2 = loadImage("./assets/board2.png");
  placeImage2 = loadImage("./assets/board2_placemap.png");
}

export function setup() {
  const debugCheckbox = document.querySelector("#debug");
  DEBUG = debugCheckbox.checked;
  debugCheckbox.oninput = function() {
    DEBUG = debugCheckbox.checked;
  };
  const pauseCheckbox = document.querySelector("#pause");
  paused = pauseCheckbox.checked;
  pauseCheckbox.oninput = function() {
    paused = pauseCheckbox.checked;
  }
  createCanvas(Constants.mapWidth + Constants.menuWidth, Constants.mapHeight);

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

  path3 = [
    // 4 corners
    createVector(-20, 305),
    createVector(175, 305),
    createVector(175, 405),
    createVector(75, 405),
    createVector(75, 255),
    createVector(465, 255),
    createVector(465, 75),
    createVector(565, 75),
    createVector(565, 175),
    createVector(360, 175),
    createVector(360, -20),
  ];
}

export function draw() {
  //draws menu until play is clicked, then draws game
  if (menu) {
    menuDraw();
  } else {
    gameDraw();
  }
}

export function menuDraw() {
  //main menu
  background("tan");
  stroke(51);
  strokeWeight(2);
  fill("tan");
  textAlign(CENTER, BASELINE);
  if (mainMenu) {
    //buttons
    rect(315, 150, 210, 65); //start
    rect(315, 250, 210, 65); //credits
    rect(315, 350, 210, 65); //quit

    //title line
    line(210, 125, 630, 125);

    //text
    fill(255);
    textSize(40);
    text("Start", 420, 198);
    text("Credits", 420, 298);
    text("Levels", 420, 398);
    textSize(50);
    text("RoadRagerz", 420, 125);
  }

  if (credits) {
    rect(315, 350, 210, 65); //return to menu button

    //text
    fill(255);
    text("Return", 420, 398);
  }

  if (levelSelect) {
    rect(315, 150, 210, 65); //level 1
    rect(315, 250, 210, 65); //level 2
    rect(315, 350, 210, 65); //level 3

    fill(255);
    textSize(40);
    text("Level 1", 420, 198);
    text("Level 2", 420, 298);
    text("Level 3", 420, 398);
  }
}

export function gameDraw() {
  //actual game
  strokeWeight(1);
  image(mapImage, 0, 0);
  if (health <= 0) {
    paused = true;
  }

  // At the beginning of the frame, reset car.affectedBySpeedCamera and car.affectedByPowerPole.
  for (const car of cars) {
    car.affectedBySpeedCamera = false;
    car.affectedByPowerPole = false;
  }

  for (const tower of towers) {
    if (!paused && !tower.obj.isGhost) {
      tower.update();
    }
  }
  for (const tower of towers) {
    tower.draw();
  }

  if (!paused) {
    if (carSpawnI < carSpawns.length) {
      let waitSpawnTimerFoo = carSpawns[carSpawnI];
      let skip = false;
      if (waitSpawnTimerFoo < 0) {
        if (cars.length > 0) {
          skip = true;
          lastSpawn = time;
        }
        waitSpawnTimerFoo = Math.abs(waitSpawnTimerFoo);
      }
      if (!skip) {
        if (time - lastSpawn > waitSpawnTimerFoo) {
          lastSpawn = time;
          carSpawnI += 1;
          spawnCar();
        }
      }
    } else if (cars.length == 0) {
      // The level is finished
      paused = true;
      gameWon = true;
    }
  }

  for (let i = cars.length - 1; i >= 0; i--) {
    const car = cars[i];
    if (!paused) {
      car.update();
    }
    car.draw();

    if (!paused) {
      //Remove car from array at death or end of map
      if (car.isFinished || car.isDead()) {
        cars.splice(i, 1);
        if (car.isDead()) {
          currency += car.value();
        } else if (car.isFinished) {
          health -= car.currentHealth;
        }
      }
    }
  }

  for (let i = 0; i < projectiles.length; i++) {
    const projectile = projectiles[i];
    if (!paused) {
      projectile.update();
    }
    projectile.draw();

    if (!paused) {
      // Remove a projectile if it is out of bounds.
      let hitCar = null;
      for (const car of cars) {
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
  }

  if (towerBeingPlaced) {
    //make ghost tower follow mouse
    if (!paused) {
      towerBeingPlaced.obj.position.x = mouseX;
      towerBeingPlaced.obj.position.y = mouseY;
      towerBeingPlaced.obj.canPlace = canPlaceAt(mouseX, mouseY);
    }
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
    textSize(16);
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
      circle(car.pos.x, car.pos.y, car.colliderSize * 2);
    }
    for (let tower of towers) {
      stroke(0, 0, 0, 0);
      fill(0, 255, 0, 100);
      switch (tower.name) {
      case "Speed Camera":
        circle(tower.obj.position.x, tower.obj.position.y, SpeedCamera.firingRange * 2);
        break;
      case "Basic Tower":
        circle(tower.obj.position.x, tower.obj.position.y, BasicTower.firingRange * 2);
        break;
      case "Collapsed Power Line":
        circle(tower.obj.position.x, tower.obj.position.y, CollapsedPowerLine.firingRange * 2);
      }
    }
  }
  textAlign(RIGHT, TOP);
  textSize(16);
  fill(0);
  noStroke();
  text(`Money: $${currency}`, Constants.mapWidth - 10, 10);
  text(`Health: ${health}`, Constants.mapWidth - 10, 30);
  if (health <= 0) {
    // game over screen
    background(0, 0, 0, 200);
    fill(255);
    textSize(80);
    textAlign(CENTER, CENTER);
    text("Game Over", Constants.mapWidth / 2, Constants.mapHeight / 2);
    stroke(51);
    strokeWeight(2);
    fill(255, 255, 255, 50);
    rect(10, Constants.mapHeight -65 - 10, 390, 65);
    fill(255);
    textSize(40);
    textAlign(LEFT, BOTTOM);
    text("Back to main menu", 20, Constants.mapHeight - 20);
    return;
  }
  if (gameWon) {
    // game won screen
    background(0, 0, 0, 200);
    fill(255);
    textSize(80);
    textAlign(CENTER, CENTER);
    text("Level Complete!", Constants.mapWidth / 2, Constants.mapHeight / 2);
    stroke(51);
    strokeWeight(2);
    fill(255, 255, 255, 50);
    rect(10, Constants.mapHeight -65 - 10, 390, 65);
    fill(255);
    textSize(40);
    textAlign(LEFT, BOTTOM);
    text("Back to main menu", 20, Constants.mapHeight - 20);
  }
  time += deltaTime;
}

export function spawnCar() {
  //create new car with created path
  const newCar = new Car(path, random(1, 2.5), 100);
  cars.push(newCar);
}

// yet to be implemented. takes a position, returns the nearest car
// object, whatever that looks like.
export function getNearestCar(x, y) {
  const pos = createVector(x, y);
  let nearestCar = createVector(Infinity, Infinity);
  let dist = pos.dist(nearestCar);
  for (let car of cars) {
    const carDist = pos.dist(car.pos);
    if (carDist < dist) {
      nearestCar = car.pos;
      dist = carDist;
    }
  }
  return nearestCar;
}

// Function to add mouse pressed functionality
export function mousePressed() {
  const mouseVector = createVector(mouseX, mouseY);
  if (gameWon) {
    if (mouseOnRect(10, Constants.mapHeight - 65 - 10, 10 + 390, Constants.mapHeight - 10)) {
      reset();
    }
    return;
  }
  if (paused && health <= 0) {
    if (mouseOnRect(10, Constants.mapHeight - 65 -10, 10 + 390, Constants.mapHeight - 10)) {
      reset();
    }
    return;
  }
  if (paused) {
    return;
  }
  
  if (menu) {
    if (mainMenu) {
      //start
      if (mouseOnRect(315, 150, 525, 215)) {
        path = path1;
        mapImage = mapImage1;
        placeImage = placeImage1;
        mainMenu = false;
        menu = false;
      }

      //credits
      if (mouseOnRect(315, 250, 525, 315)) {
        mainMenu = false;
        credits = true;
      }

      //level select
      if (mouseOnRect(315, 350, 525, 415)) {
        mainMenu = false;
        levelSelect = true;
      }
      return;
    }

    if (credits) {
      if (mouseOnRect(315, 350, 525, 415)) {
        credits = false;
        mainMenu = true;
      }
      return;
    }

    if (levelSelect) {
      if (mouseOnRect(315, 150, 525, 215)) { //level 1
        path = path1;
        mapImage = mapImage1;
        placeImage = placeImage1;
        levelSelect = false;
        menu = false;
      } else if (mouseOnRect(315, 250, 525, 315)) { //level 2
        path = path2;
        mapImage = mapImage2;
        placeImage = placeImage2;
        levelSelect = false;
        menu = false;

      } else if (mouseOnRect(315, 350, 525, 415)) { //level 3
        path = path3;
        //mapImage = mapImage3;
        //placeImage = placeImage3;
        levelSelect = false;
        menu = false;
      }
      return;
    }
  }

  // If there is a tower being placed, then clicking the mouse should
  // place the tower
  if (towerBeingPlaced) {
    if (canPlaceAt(mouseVector.x, mouseVector.y)) {
      towerBeingPlaced.obj.isGhost = false;
      towerBeingPlaced.obj.position = mouseVector.copy();
      towers.push(towerBeingPlaced);
      currency -= towerMenu.filter(t => t.name === towerBeingPlaced.name)[0].cost;
      towerBeingPlaced = null;
    } else if (mouseVector.x >= Constants.mapWidth) {
      // Remove ghost tower if the tower is being placed back in the
      // menu.
      towerBeingPlaced = null;
    }
    return;
  }

  let somethingClicked = false;

  // Check for a click to the menu 
  if (mouseOnRect(temuX,
                  tmenuY,
                  tmenuX + Constants.towerMenuWidth,
                  tmenuY + Constants.towerMenuHeight)) {
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
    if (mouseOnRect(beginX, beginY, endX, endY)) {
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
      dist(mouseX, mouseY, towerType.menuPos.x, towerType.menuPos.y) <
      towerType.menuSize / 2 && currency >= towerType.cost
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
      for (const tower of towers) {
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
}
