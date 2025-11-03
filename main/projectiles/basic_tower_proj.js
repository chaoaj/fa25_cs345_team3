export class basicTowerProjectile {

    constructor(towerPos) {
        this.towerPos = towerPos
    }

    draw() {
        push()
        ellipse(this.towerPos.x, this.towerPos.y, 10, 10);
        translate()
        pop()
    }
}
