import { time } from "./sketch.js"

// This file draws some pretty confetti on the victory screen

const confettiColors = [["#e60000", "#ff8e00", "#ffef00", "#00821b", "#004bff", "#780089"], ["#d62900", "#f07722", "#ff9b55", "#ffffff", "#d262a6", "#b75591", "#a50062"], ["#d70071", "#d70071", "#9c4e97", "#0035aa", "#0035aA"], ["#5bcffa", "#f5abb9", "#ffffff", "#f5abb9", "#5bcffa"], ["#3aa740", "#a8d47a", "#fffff", "#ababab", "#000000"], ["#000000", "#a5a5a5", "#ffffff", "#810081"], ["#018e71", "#21cfac", "#9ae9c3", "#ffffff", "#7cafe4", "#4f47cc", "#3c1379"], ["#fff42f", "#ffffff", "#9c59d1", "#292929"], ["#ff1b8d", "#ffd900", "#1bb3ff"], ["#ffd900", "#7a00ac", "#ffd900"]];

let confettis = [];

function Confetti() {
  this.x = 0;
  this.y = 0;
  this.vX = 0;
  this.vY = 0;
  this.a = 0;
  this.vA = 0;
  this.color = undefined;
}

let lf = false;
let confettiColorSet = []
let confettiStartX = 0;

export function draw() {
  strokeWeight(0);
  if (time % 2000 < 500) {
    if (!lf) {
      confettiColorSet = random(confettiColors);
      confettiStartX = random(100, 740);
    }
    for (let i = 0; i < 10; i++) {
      let c = new Confetti();
      c.x = confettiStartX;
      c.y = 480;
      c.vX = random(-0.2, 0.2);
      c.vY = random(-0.1, -0.5);
      c.vA = atan2(c.vX, c.vY) * 0.001;
      c.color = random(confettiColorSet);
      confettis.push(c);
    }
    lf = true;
  } else {
    lf = false;
  }
  for (let i = 0; i < confettis.length; i++) {
    let confetti = confettis[i];
    push();
    translate(confetti.x, confetti.y);
    rotate(confetti.a);
    fill(confetti.color)
    rect(0, 0, 10, 10);
    pop();
    confetti.x += confetti.vX * deltaTime;
    confetti.y += confetti.vY * deltaTime;
    confetti.vY += 0.0002 * deltaTime;
    if (confetti.vY > 0.1) {
      confetti.vY = 0.1;
    }
    confetti.a += confetti.vA * deltaTime;
    if (confetti.y > 480 && confetti.vY > 0) {
      confettis.splice(i, 1);
      i--;
    }
  }
}

export function reset() {
  confettis = [];
}
