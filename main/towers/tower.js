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
}
