import React, { useEffect, useState } from 'react';
import Phaser from 'phaser';
import player from './images/player.png';
import eBasic from './images/enemyBasic.png';
import eTank from './images/enemyTank.png';

function PhaserTest() {
  const [paused, setPaused] = useState(false);
  const [game, setGame] = useState(null);
  const [level, setLevel] = useState(1);
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
      this.healthBarBackground = null;
      this.healthBar = null;
      this.timedEvent = null;
      this.iframe = false;
      this.fireRateForWepaon = false;
      this.weapon0 = {
        fireRate: 1000,
        damage: 75,
        pierce: 2,
        damageIncrease: 35,
      }
      this.weapon1 = {
        fireRate: 3000,
        damage: 125,
        pierce: 6,
        damageIncrease: 75
      }
      this.weapon2 = {
        fireRate: 1750,
        damage: 50,
        pierce: 1,
        damageIncrease: 20
      }
      this.weapon3 = {
        fireRate: 4000,
        damage: 200,
        pierce: 5,
        radius: 50,
        damageIncrease: 100
      }
    }

    preload() {
      this.load.image('block', player);
      this.load.image('projectile', 'assets/sprites/projectile.png');
      this.load.image('enemy', eBasic);
    }

    create() {
      this.block = this.physics.add
        .sprite(400, 300, 'block')
        .setCollideWorldBounds(true);
      this.projectiles = this.physics.add.group();
      this.enemies = this.physics.add.group();
      this.block.setScale(0.2, 0.2);
      this.block.customData = {
        health: 100,
        maxHealth: 100,
        speed: 1.5,
        score: 0,
        level: 1,
        exp: 0,
        pierce: 2,
        regen: 2,
        currentWeapon: 0,
      };
      this.healthBarBackground = this.add.rectangle(
        this.block.x - 100,
        this.block.y - 30,
        200,
        20,
        0xe74c3c
      );
      this.healthBar = this.add.rectangle(
        this.block.x - 100,
        this.block.y - 30,
        200,
        20,
        0x2ecc71
      );
      this.healthBar.setOrigin(0);
      this.healthBarBackground.setOrigin(0);

      this.input.on('pointerdown', (pointer) => {
        if (!this.fireRateForWepaon) {
          this.fireRateChange();
          if(this.block.customData.currentWeapon === 0){
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
            projectile.customData =
              this[`weapon${this.block.customData.currentWeapon}`];
            projectile.setCollideWorldBounds(true);
            projectile.body.onWorldBounds = true;
          }
          if(this.block.customData.currentWeapon === 1){
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
              .scale(900);
            projectile.setVelocity(velocity.x, velocity.y);
            projectile.customData =
              this[`weapon${this.block.customData.currentWeapon}`];
            projectile.setCollideWorldBounds(true);
            projectile.body.onWorldBounds = true;
          }
          if(this.block.customData.currentWeapon === 2){
            const velocity = new Phaser.Math.Vector2(
                pointer.worldX - this.block.x,
                pointer.worldY - this.block.y
            ).normalize().scale(600);

            // Define spread angles for the shotgun projectiles
            const spreadAngles = [-0.2, -0.1, 0.1, 0.2];

            // Iterate over each spread angle
            for (let i = 0; i < spreadAngles.length; i++) {
                const spreadVelocity = velocity.clone().rotate(spreadAngles[i]);

                // Create a projectile for each spread angle
                const projectile = this.projectiles.create(
                    this.block.x,
                    this.block.y,
                    'projectile'
                );
                projectile.setVelocity(spreadVelocity.x, spreadVelocity.y);
                projectile.customData = this[`weapon${this.block.customData.currentWeapon}`];
                projectile.setCollideWorldBounds(true);

                // Set up world bounds collision
                projectile.body.onWorldBounds = true;
                projectile.body.world.on('worldbounds', () => {
                    projectile.destroy();
                });
            }
          }
          if(this.block.customData.currentWeapon === 3){
            const projectile = this.projectiles.create(
              this.block.x,
              this.block.y,
              'projectile'
            );
            const velocity = new Phaser.Math.Vector2(
              pointer.worldX - this.block.x,
              pointer.worldY - this.block.y
            ).normalize().scale(300);
            projectile.setVelocity(velocity.x, velocity.y);
            projectile.customData = this[`weapon${this.block.customData.currentWeapon}`];
            projectile.setCollideWorldBounds(true);
            projectile.body.onWorldBounds = true;
          }
          this.time.delayedCall(this[`weapon${this.block.customData.currentWeapon}`].fireRate, this.fireRateChange, [], this);
        }
      });
      this.physics.world.setBoundsCollision(true, true, true, true);

      // Destroy projectiles when they leave the screen
      this.physics.world.on('worldbounds', (body) => {
        if (body.gameObject instanceof Phaser.GameObjects.Sprite) {
          body.gameObject.destroy();
        }
      });

      for (let i = 0; i < this.gameInfo.numOfEnemies; i++) {
        const xL = Phaser.Math.Between(
          this.physics.world.bounds.left - 10000,
          this.physics.world.bounds.left - 5000
        );
        const xR = Phaser.Math.Between(
          this.physics.world.bounds.right + 10000,
          this.physics.world.bounds.right + 5000
        );
        const yT = Phaser.Math.Between(-10000, -5000);
        const yB = Phaser.Math.Between(
          this.physics.world.bounds.height + 5000,
          this.physics.world.bounds.height + 10000
        );
        const spawn = Math.round(Math.random(0, 1));
        const spawn2 = Math.round(Math.random(0, 1));
        const enemy = this.enemies.create(
          spawn ? xR : xL,
          spawn2 ? yT : yB,
          'enemy'
        );
        enemy.setCollideWorldBounds(false);
        enemy.setScale(0.2, 0.2);

        console.log(enemy.x, enemy.y);
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
      this.physics.add.collider(
        this.block,
        this.enemies,
        this.enemyPlayerCollision,
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
        enemy.setScale(0.2, 0.2);
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
    updateHealthBar(currentHealth, maxHealth) {
      const newWidth = (currentHealth / maxHealth) * 200;
      this.healthBar.setSize(newWidth, 20);
    }
    projectileEnemyCollision(projectile, enemy) {
      projectile.customData.pierce--;
      if (projectile.customData.pierce <= 0) {
        if(this.block.customData.currentWeapon !== 3){
          projectile.destroy();
        }else{
          this.destroyProjectileAndApplyAOE(projectile);
        }
      }
      if(this.block.customData.currentWeapon !== 3){
        enemy.customData.health -= projectile.customData.damage; // Reduce enemy health
        if (enemy.customData.health <= 0) {
          enemy.destroy();
          this.block.customData.exp += enemy.customData.exp;
          if (this.block.customData.exp >= 100 * this.block.customData.level) {
            const remainingExp =
              this.block.customData.exp - 100 * this.block.customData.level;
            this.block.customData.level++;
            this.block.customData.exp = remainingExp; // Update exp with remaining exp
            console.log('Level: ' + level);
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
    }
    checkCollisions() {
      this.physics.collide(
        this.projectiles,
        this.enemies,
        this.enemyPlayerCollision,
        null,
        this
      );
    }
    iframeChange() {
      this.iframe = !this.iframe;
    }
    fireRateChange() {
      this.fireRateForWepaon = !this.fireRateForWepaon;
    }
    enemyPlayerCollision(block, enemy) {
      if (!this.iframe) {
        this.iframeChange();
        if (block.customData.health > 0) {
          block.customData.health -= enemy.customData.damage;
        } else if (block.customData.health <= 0) {
          block.customData.health = 0;
        }
        this.time.delayedCall(500, this.iframeChange, [], this);
      }
    }
    upgradePlayer(option){
      if(option === "speed")this.block.customData.speed += .1;
      if(option === "health")this.block.customData.maxHealth += 10;
      if(option === "pierce")
        this[`weapon${this.block.customData.currentWeapon}`].pierce += 1;
      if(option === "damage")
        this[`weapon${this.block.customData.currentWeapon}`].damage +=
        this[`weapon${this.block.customData.currentWeapon}`].damageIncrease;
      if(option === "fire-rate")
        this[`weapon${this.block.customData.currentWeapon}`].fireRate += 50
      this.scene.resume();
      setPaused(false);
    }
    changeWeapon(option) {
      this.block.customData.currentWeapon = option;
      this.scene.resume();
      setPaused(false);
      setLevel((prev) => prev++);
    }
    destroyProjectileAndApplyAOE(projectile){
      projectile.destroy();
      const enemiesInRange = this.enemies.getChildren().filter((enemy) => {
        console.log(Phaser.Math.Distance.Between(projectile.x, projectile.y, enemy.x, enemy.y));
          return Phaser.Math.Distance.Between(projectile.x, projectile.y, enemy.x, enemy.y) <= this.weapon3.radius;
      });
      console.log(enemiesInRange);
      enemiesInRange.forEach((enemy) => {
        console.log(enemy)
        console.log(projectile.customData.damage)
        enemy.customData.health -= projectile.customData.damage;
        if (enemy.customData.health <= 0) {
          enemy.destroy();
          this.block.customData.exp += enemy.customData.exp;
          if (this.block.customData.exp >= 100 * this.block.customData.level) {
            const remainingExp =
              this.block.customData.exp - 100 * this.block.customData.level;
            this.block.customData.level++;
            this.block.customData.exp = remainingExp; // Update exp with remaining exp
            console.log('Level: ' + level);
            this.scene.pause();
            setPaused(true);
          }
          if (this.enemies.getChildren().length === 0) {
            // Start a new wave
            this.currentWave++;
            this.startNewWave();
          }
        }
      });
    }
    update(time, delta) {
      if (this.block.customData.health < this.block.customData.maxHealth)
        this.block.customData.health += this.block.customData.regen;
      this.healthBarBackground.x = this.block.x - 100;
      this.healthBarBackground.y = this.block.y - 30;
      this.healthBar.x = this.block.x - 100;
      this.healthBar.y = this.block.y - 30;
        this.updateHealthBar(this.block.customData.health, 100);
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
        this.projectiles.children.iterate((projectile) => {
          if(this.block.customData.currentWeapon === 3){
            const MAX_DISTANCE = 200;
            const distanceTraveled = Phaser.Math.Distance.Between(
                this.block.x,
                this.block.y,
                projectile.x,
                projectile.y
            );
            if (distanceTraveled > MAX_DISTANCE) {
                this.destroyProjectileAndApplyAOE(projectile);
            }else{
              if (projectile.body.onWorldBounds) {
                if (projectile.body.checkWorldBounds()) {
                  projectile.destroy();
                }
              }
            }
          }else{
            if (projectile.body.onWorldBounds) {
              if (projectile.body.checkWorldBounds()) {
                projectile.destroy();
              }
            }
          }
        })

        const pointer = this.input.mousePointer;
        const distance = Phaser.Math.Distance.Between(
          this.block.x,
          this.block.y,
          pointer.worldX,
          pointer.worldY
        );
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
      this.projectiles.children.iterate((projectile) => {
        if (projectile.body.onWorldBounds) {
          if (projectile.body.checkWorldBounds()) {
            projectile.destroy();
          }
        }
      });
      this.block.rotation = angle + Math.PI / 2;
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
    width: window.innerWidth,
    height: window.innerHeight,
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
  function upgradePlayer(option) {
    if (game !== null) {
      game.scene.scenes[0].upgradePlayer(option);
    }
  }
  function changeWeapon(option) {
    if (game !== null) {
      game.scene.scenes[0].changeWeapon(option);
    }
  }

  return (
    <div id='phaser-game'>
      {paused && game.scene.scenes[0].block.customData.level > 2 ? (<div>
        <button onClick={() => upgradePlayer("speed")}>Speed</button>
        <button onClick={() => upgradePlayer("health")}>Health</button>
        <button onClick={() => upgradePlayer("damage")}>Damage</button>
        <button onClick={() => upgradePlayer("pierce")}>Pierce</button>
        <button onClick={() => upgradePlayer("fire-rate")}>Fire rate</button>
      </div>) : paused ? (<div>
        <button onClick={() => changeWeapon(0)}>Keep same weapon</button>
        <button onClick={() => changeWeapon(1)}>Sniper</button>
        <button onClick={() => changeWeapon(2)}>Shotgun</button>
        <button onClick={() => changeWeapon(3)}>Grenade Launcher</button>
      </div>): null}
    </div>
  );
}

export default PhaserTest;
