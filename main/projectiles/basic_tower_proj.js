const speed = 0.75;

export class basicTowerProjectile {
  damage = 25;
  
  constructor(towerPos, target) {
    this.pos = towerPos.copy();
    this.direction = p5.Vector.sub(target, towerPos).normalize();
  }

  update() {
    this.pos = this.pos.add(p5.Vector.mult(this.direction, speed * deltaTime));
  }
  
  draw() {
    push();
    ellipse(this.pos.x, this.pos.y, 10, 10);
    translate();
    pop();
  }
}
