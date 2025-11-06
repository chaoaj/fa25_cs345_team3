export class basicTowerProjectile {

    constructor(towerPos, v, d) {
        this.towerPos = towerPos;
        this.v = v;
        this.d = d;
    }

    draw() {
        push();
        ellipse(this.towerPos.x, this.towerPos.y, 10, 10);
        translate();
        pop();
    }
}
