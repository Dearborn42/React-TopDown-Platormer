import React from "react";
import { ReactP5Wrapper } from "@p5-wrapper/react";



export default function P5Sketch() {
  function sketch(p5) {

    let playerX = 50;
    let playerY = 50;
    let playerSpeed = 5;

    const numEnemies = 5;
    let enemies = [];

    var projectiles = [];

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

    p5.mouseClicked = () => {
      const newProjectile = {
        damage: 50,
        x: playerX,
        y: playerY,
        speed: 7,
        angle: p5.atan2(p5.mouseY - playerY, p5.mouseX - playerX),
        color: p5.color(0, 255, 0)
      };
      projectiles.push(newProjectile);
    };

    const moveProjectile = (projectile) => {
      let vx = p5.cos(projectile.angle) * projectile.speed;
      let vy = p5.sin(projectile.angle) * projectile.speed;
      projectile.x += vx;
      projectile.y += vy;
      if(projectile.x < 0 || projectile.x > window.innerWidth) {
        projectiles = projectiles.filter((pro) => pro !== projectile)
      }
      if(projectile.y < 0 || projectile.y > window.innerHeight) {
        projectiles = projectiles.filter((pro) => pro !== projectile)
      }
    };

    const drawProjectile = (projectile) => {
      p5.fill(projectile.color);
      p5.rect(projectile.x, projectile.y, 10, 5);
    };

    p5.setup = () => {
      p5.createCanvas(window.innerWidth, window.innerHeight);
      for (let i = 0; i < numEnemies; i++) {
        enemies.push({
          health: 100,
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
         
        projectiles.forEach(projectile => {
          moveProjectile(projectile);
          drawProjectile(projectile);
        });

        if (p5.keyIsDown(65)) playerX -= playerSpeed;

        if (p5.keyIsDown(68)) playerX += playerSpeed;
        
        if (p5.keyIsDown(87)) playerY -= playerSpeed;
        
        if (p5.keyIsDown(83)) playerY += playerSpeed;
      };
    }
  return <ReactP5Wrapper sketch={sketch} />;
}
