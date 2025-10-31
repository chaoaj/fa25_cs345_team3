export class basicTowerProjectile {

    constructor(towerPos) {
        this.towerPos = towerPos
    }

    draw() {
        push()
        ellipse(towerPos.x, towerPos.y, 10, 10);
        translate()
        pop()
    }
}
