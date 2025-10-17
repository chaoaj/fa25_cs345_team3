function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}


// Ephram and Joesph


// yet to be implemented. takes a position, returns the nearest car
// object, whatever that looks like.
function getNearestCar(x, y)
// Tower constructor. could be called like new Tower(whatever)
function Tower(draw, update, obj) {
    // called every frame to draw the tower on the screen maybe takes
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
    this.obj = obj;
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
function placeTower(tower, x, y);
