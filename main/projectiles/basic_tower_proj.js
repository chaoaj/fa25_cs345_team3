import { projectiles } from "../sketch";

export class basicTowerProjectile {
  constructor(towerPos, carPos, v, d) {
    this.carPos = carPos.copy();
    this.projPos = towerPos.copy();
    this.v = v;
    this.d = d;
    this.dir = p5.Vector.sub(this.carPos, this.towerPos)
      .normalize()
      .mult(this.v);
  }

  draw() {
    push();
    let x = this.towerPos.x;
    let y = this.towerPos.y;
    ellipse(x, y, 10, 10);
    translate(this.carPos);
    this.projPos.add(this.dir);
    // x += this.v;
    // y += this.v;
    pop();
  }
  
  update() {
    if (this.projPos == this.carPos) {
      projectiles.splice(this, 1);
      cars[0].takeDamage(this.d);

    }
  }
}
