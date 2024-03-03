import React, { useEffect, useState } from 'react';
import Phaser from 'phaser';

function PhaserTest() {
  const [paused, setPaused] = useState(false);
  const [game, setGame] = useState(null);
  class Example extends Phaser.Scene {
    constructor() {
      super({
        physics: {
          arcade: {
            debug: true,
          },
        },
      });

      // Initialize enemies and block as class properties
      this.block = this.projectiles = this.enemies = null;
      this.gameInfo = {
        round: 1,
        numOfEnemies: 1,
      };
      this.currentWave = 1;
    }

    preload() {
      this.load.image('block', 'assets/sprites/block.png');
      this.load.image('projectile', 'assets/sprites/projectile.png');
    }

    create() {
      this.block = this.physics.add
        .sprite(400, 300, 'block')
        .setCollideWorldBounds(true);
      this.projectiles = this.physics.add.group();
      this.enemies = this.physics.add.group();

      this.block.customData = {
        health: 100,
        speed: 1.5,
        score: 0,
        level: 1,
        exp: 0,
      };
      // Define keyboard cursors
      // const cursors = this.input.keyboard.createCursorKeys();

      this.input.on('pointerdown', (pointer) => {
          const projectile = this.projectiles.create(
            this.block.x,
            this.block.y,
            'projectile'
          );

          const velocity = new Phaser.Math.Vector2(
            pointer.worldX - this.block.x,
            pointer.worldY - this.block.y
          )
            .normalize()
            .scale(400);

          projectile.setVelocity(velocity.x, velocity.y);
          projectile.customData = {
            damage: 75 * this.block.customData.level,
            pierce: 2,
          };
      });
      this.physics.world.setBoundsCollision(true, true, true, true);

      // Destroy projectiles when they leave the screen
      this.physics.world.on('worldbounds', (body) => {
        if (body.gameObject instanceof Phaser.GameObjects.Sprite) {
          body.gameObject.destroy();
        }
      });

      for (let i = 0; i < this.gameInfo.numOfEnemies; i++) {
        const x = Phaser.Math.Between(
          this.physics.world.bounds.left - 1000,
          this.physics.world.bounds.right + 1000
        );
        const y = Phaser.Math.Between(
          -200,
          this.physics.world.bounds.height + 200
        );
        const enemy = this.enemies.create(x, y, 'enemy');
        enemy.setCollideWorldBounds(false);
        if (i <= 15)
          enemy.customData = { health: 75, speed: 250, damage: 30, exp: 20 };
        else if (i > 15 && i <= 25)
          enemy.customData = { health: 125, speed: 200, damage: 50, exp: 50 };
        else
          enemy.customData = { health: 200, speed: 100, damage: 75, exp: 100 };
      }
      this.physics.add.overlap(
        this.projectiles,
        this.enemies,
        this.projectileEnemyCollision,
        null,
        this
      );
      this.startNewWave();
    }
    startNewWave() {
      // Calculate number of enemies for the current wave
      const numOfEnemies = Math.ceil(
        this.gameInfo.numOfEnemies * Math.pow(1.5, this.currentWave - 1)
      );
      console.log(numOfEnemies);
      // Create enemies for the current wave
      for (let i = 0; i < numOfEnemies; i++) {
        const x = Phaser.Math.Between(
          this.physics.world.bounds.left - 1000,
          this.physics.world.bounds.right + 1000
        );
        const y = Phaser.Math.Between(
          -200,
          this.physics.world.bounds.height + 200
        );
        const enemy = this.enemies.create(x, y, 'enemy');
        enemy.setCollideWorldBounds(false);
        // Set custom data for different types of enemies
        if (i <= 15)
          enemy.customData = { health: 75, speed: 250, damage: 30, exp: 20 };
        else if (i > 15 && i <= 25)
          enemy.customData = { health: 125, speed: 200, damage: 50, exp: 50 };
        else
          enemy.customData = { health: 200, speed: 100, damage: 75, exp: 100 };
      }
    }
    projectileEnemyCollision(projectile, enemy) {
      projectile.customData.pierce--;
      if (projectile.customData.pierce === 0) {
        projectile.destroy();
      }
      // Destroy the projectile
      enemy.customData.health -= projectile.customData.damage; // Reduce enemy health
      if (enemy.customData.health <= 0) {
        enemy.destroy();
        console.log('Enemies: ' + this.enemies.getChildren().length);
        this.block.customData.exp += enemy.customData.exp;
        if (this.block.customData.exp >= 100 * this.block.customData.level) {
          const remainingExp =
            this.block.customData.exp - 100 * this.block.customData.level;
          this.block.customData.level++; // Increase player level
          this.block.customData.exp = remainingExp; // Update exp with remaining exp
          console.log('Level: ' + this.block.customData.level);
          this.scene.pause();
          setPaused(true);
        }
        if (this.enemies.getChildren().length === 0) {
          // Start a new wave
          this.currentWave++;
          this.startNewWave();
        }
      }
    }
    upgradePlayer(option){
      if(option === "speed")this.block.customData.speed += .1;
      if(option === "health")this.block.customData.health += 10;
      if(option === "test")this.block.customData.score += 1;
      this.scene.resume();
      setPaused(false);
    }
    update(time, delta) {
        this.enemies.children.iterate((enemy) => {
          const angle = Phaser.Math.Angle.Between(
            enemy.x,
            enemy.y,
            this.block.x,
            this.block.y
          );
          const velocity = new Phaser.Math.Vector2(
            Math.cos(angle),
            Math.sin(angle)
          )
            .normalize()
            .scale(enemy.customData.speed);
          enemy.setVelocity(velocity.x, velocity.y);
        });

        const pointer = this.input.mousePointer;
        const distance = Phaser.Math.Distance.Between(
          this.block.x,
          this.block.y,
          pointer.worldX,
          pointer.worldY
        );
        const angle = Phaser.Math.Angle.Between(
          this.block.x,
          this.block.y,
          pointer.worldX,
          pointer.worldY
        );
        const velocityX =
          Math.cos(angle) * distance * this.block.customData.speed;
        const velocityY =
          Math.sin(angle) * distance * this.block.customData.speed;

        // Set velocity for the block
        this.block.setVelocity(velocityX, velocityY);
    }
  }

  const config = {
    type: Phaser.AUTO,
    width: window.innerHeight,
    height: window.innerWidth,
    parent: 'phaser-example',
    physics: {
      default: 'arcade',
      arcade: { debug: true },
    },
    scene: Example,
  };
  useEffect(() => {
    const phaserGame = new Phaser.Game(config);
    setGame(phaserGame);

    return () => {
      phaserGame.destroy(true);
    };
  }, []);
  function upgradePlayer(option){
    if(game !== null){
      game.scene.scenes[0].upgradePlayer(option);
    }
  }
   return (
    <div id='phaser-game'>
      {paused ? (<div>
        <button onClick={() => upgradePlayer("speed")}>Speed</button>
        <button onClick={() => upgradePlayer("health")}>Health</button>
        <button onClick={() => upgradePlayer("test")}>Test</button>
      </div>) : null}
    </div>
  );
}

export default PhaserTest;