import React, {useState} from "react";
import { ReactP5Wrapper } from "@p5-wrapper/react";



export default function P5Sketch() {
  function sketch(p5) {

    let playerX = 50;
    let playerY = 50;
    let playerSpeed = 5;

    const numEnemies = 5;
    let enemies = [];

    function moveEnemy(enemy){
      let dx = playerX - enemy.x;
      let dy = playerY - enemy.y;
      let angle = p5.atan2(dy, dx);
      let vx = p5.cos(angle) * enemy.speed;
      let vy = p5.sin(angle) * enemy.speed;
      enemy.x += vx;
      enemy.y += vy;
    };
    function drawEnemy(enemy){
      p5.fill(enemy.color);
      p5.square(enemy.x, enemy.y, 50);
    };

    p5.setup = () => {
      p5.createCanvas(window.innerWidth, window.innerHeight);
      for (let i = 0; i < numEnemies; i++) {
        enemies.push({
          x: p5.random(0, p5.width),
          y: p5.random(0, p5.height),
          speed: p5.random(1, 4),
          color: p5.color(255, 0, 0)
        });
      }
    };

    p5.draw = () => {
        p5.background(220);

        p5.fill(0, 0, 255);
        p5.square(playerX, playerY, 50);

        // Draw enemy square
        enemies.forEach(enemy => {
          moveEnemy(enemy);
          drawEnemy(enemy);
        });
         
        

        if (p5.keyIsDown(65)) playerX -= playerSpeed;

        if (p5.keyIsDown(68)) playerX += playerSpeed;
        
        if (p5.keyIsDown(87)) playerY -= playerSpeed;
        
        if (p5.keyIsDown(83)) playerY += playerSpeed;
      };
    }
  return <ReactP5Wrapper sketch={sketch} />;
}
