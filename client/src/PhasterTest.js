import React, { useEffect, useState } from 'react';
import Phaser from 'phaser';
import player from './images/player.png';
import eBasic from './images/enemyBasic.png';
import eTank from './images/enemyTank.png';
import eFast from './images/enemyFast.png';
import bgTile from './images/bgTile.png';
import { useNavigate } from 'react-router';
import pierceI from './images/pierceIcon.png';
import dmgI from './images/dmgIcon.png';
import healthI from './images/heartIcon.png';
import regenI from './images/regenIcon.png';
import normalI from './images/normalIcon.png';
import grenadeI from './images/grenadeIcon.png';
import sniperI from './images/sniperIcon.png';
import shotgunI from './images/shotgunIcon.png';
import rateI from './images/rateIcon.png';
import speedI from './images/speedIcon.png';
import normalProj from './images/normalProj.png';
function PhaserTest() {
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [paused, setPaused] = useState(false);
  const [level, setLevel] = useState(1);
  const [death, setDeath] = useState(false);
  const [form, setForm] = useState({
    name: '',
    score: '',
  });
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }
  class Example extends Phaser.Scene {
    constructor() {
      super({
        physics: {
          arcade: {
            debug: false,
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
      this.healthRegenRate = false;
      this.difficulty = 0;
      this.death = false;
      this.weapon0 = {
        fireRate: 1000,
        damage: 75,
        pierce: 1,
        damageIncrease: 35,
      };
      this.weapon1 = {
        fireRate: 3000,
        damage: 125,
        pierce: 999999,
        damageIncrease: 75,
      };
      this.weapon2 = {
        fireRate: 1750,
        damage: 50,
        pierce: 1,
        damageIncrease: 20,
        shots: 4,
      };
      this.weapon3 = {
        fireRate: 4000,
        damage: 200,
        pierce: 999999,
        radius: 100,
        damageIncrease: 100,
      };
    }

    preload() {
      this.load.image('block', player);
      this.load.image('projectile', normalProj);
      this.load.image('enemy', eBasic);
      this.load.image('enemyFast', eFast);
      this.load.image('enemyTank', eTank);
      this.load.image('bgTile', bgTile);
    }

    create() {
      const background = this.add.tileSprite(
        0,
        0,
        this.game.config.width,
        this.game.config.height,
        'bgTile'
      );
      background.setOrigin(0, 0);
      this.block = this.physics.add
        .sprite(400, 300, 'block')
        .setCollideWorldBounds(true);
      this.projectiles = this.physics.add.group();
      this.enemies = this.physics.add.group();
      this.block.setScale(0.2, 0.2);
      this.block.customData = {
        health: 80,
        maxHealth: 80,
        speed: 1.5,
        score: 0,
        level: 1,
        exp: 0,
        pierce: 2,
        regen: 2,
        currentWeapon: 0,
      };
      this.nextExp = 100 * this.block.customData.level;
      this.healthBarBackground = this.add.rectangle(
        this.block.x,
        this.block.y + 40,
        80,
        8,
        0xe74c3c
      );
      this.healthBar = this.add.rectangle(
        this.block.x,
        this.block.y + 40,
        80,
        8,
        0x2ecc71
      );
      this.expBarBackground = this.add
        .rectangle(
          0,
          this.game.config.height - 20,
          this.game.config.width,
          20,
          0x333333
        )
        .setOrigin(0, 1);
      this.expBar = this.add
        .rectangle(
          0,
          this.game.config.height - 20,
          this.game.config.width,
          20,
          0xffd700
        )
        .setOrigin(0, 1);
      this.rateBackground = this.add
        .rectangle(this.block.x, this.block.y + 40, 80, 8, 0x333333)
        .setOrigin(0, 1);
      this.rateBar = this.add
        .rectangle(this.block.x, this.block.y + 40, 80, 8, 0xff5500)
        .setOrigin(0, 1);
      this.healthBar.setOrigin(0);
      this.healthBarBackground.setOrigin(0);

      this.input.on('pointerdown', (pointer) => {
        if (!this.fireRateForWepaon) {
          this.fireRateChange();
          this.rateBar.width = 0;

          if (this.block.customData.currentWeapon === 0) {
            const projectile = this.projectiles.create(
              this.block.x,
              this.block.y,
              'projectile'
            );
            projectile.setScale(0.3);
            const velocity = new Phaser.Math.Vector2(
              pointer.worldX - this.block.x,
              pointer.worldY - this.block.y
            )
              .normalize()
              .scale(600);
            projectile.setVelocity(velocity.x, velocity.y);
            projectile.customData =
              this[`weapon${this.block.customData.currentWeapon}`];
            projectile.setCollideWorldBounds(true);
            projectile.body.onWorldBounds = true;
          }
          if (this.block.customData.currentWeapon === 1) {
            const projectile = this.projectiles.create(
              this.block.x,
              this.block.y,
              'projectile'
            );
            projectile.setScale(0.3);
            const velocity = new Phaser.Math.Vector2(
              pointer.worldX - this.block.x,
              pointer.worldY - this.block.y
            )
              .normalize()
              .scale(1000);
            projectile.setVelocity(velocity.x, velocity.y);
            projectile.customData =
              this[`weapon${this.block.customData.currentWeapon}`];
            projectile.setCollideWorldBounds(true);
            projectile.body.onWorldBounds = true;
          }
          if (this.block.customData.currentWeapon === 2) {
            const velocity = new Phaser.Math.Vector2(
              pointer.worldX - this.block.x,
              pointer.worldY - this.block.y
            )
              .normalize()
              .scale(600);

            // Define spread angles for the shotgun projectiles
            const spreadAngles = [];
            for (let i = 0; i < this.weapon2.shots; i++) {
              spreadAngles.push((i - (this.weapon2.shots - 1) / 2) * 0.1); // Adjust spread angle here
            }
            // Iterate over each spread angle
            for (let i = 0; i < spreadAngles.length; i++) {
              const spreadVelocity = velocity.clone().rotate(spreadAngles[i]);

              // Create a projectile for each spread angle
              const projectile = this.projectiles.create(
                this.block.x,
                this.block.y,
                'projectile'
              );
              projectile.setScale(0.3);

              projectile.setVelocity(spreadVelocity.x, spreadVelocity.y);
              projectile.customData =
                this[`weapon${this.block.customData.currentWeapon}`];
              projectile.setCollideWorldBounds(true);

              // Set up world bounds collision
              projectile.body.onWorldBounds = true;
              projectile.body.world.on('worldbounds', () => {
                projectile.destroy();
              });
            }
          }
          if (this.block.customData.currentWeapon === 3) {
            const projectile = this.projectiles.create(
              this.block.x,
              this.block.y,
              'projectile'
            );
            projectile.setScale(0.6);

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
          this.setFireRate = this.time.delayedCall(
            this[`weapon${this.block.customData.currentWeapon}`].fireRate,
            this.fireRateChange,
            [],
            this
          );
          this.tweens.add({
            targets: this.rateBar,
            width: 80,
            duration:
              this[`weapon${this.block.customData.currentWeapon}`].fireRate,
            ease: 'Linear',
          });
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
          this.physics.world.bounds.left - 300,
          this.physics.world.bounds.left - 100
        );
        const xR = Phaser.Math.Between(
          this.physics.world.bounds.right + 300,
          this.physics.world.bounds.right + 100
        );
        const yT = Phaser.Math.Between(-300, -100);
        const yB = Phaser.Math.Between(
          this.physics.world.bounds.height + 300,
          this.physics.world.bounds.height + 100
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
      this.physics.add.collider(this.enemies, this.enemies, null, null, this);
      this.startNewWave();
    }
    startNewWave() {
      // Calculate number of enemies for the current wave
      const numOfEnemies = Math.ceil(
        this.gameInfo.numOfEnemies * Math.pow(difficulty, this.currentWave - 1)
      );
      // Create enemies for the current wave
      for (let i = 0; i < numOfEnemies; i++) {
        const xL = Phaser.Math.Between(
          this.physics.world.bounds.left - 300,
          this.physics.world.bounds.left - 100
        );
        const xR = Phaser.Math.Between(
          this.physics.world.bounds.right + 300,
          this.physics.world.bounds.right + 100
        );
        const yT = Phaser.Math.Between(-300, -100);
        const yB = Phaser.Math.Between(
          this.physics.world.bounds.height + 300,
          this.physics.world.bounds.height + 100
        );
        const spawn = Math.round(Math.random(0, 1));
        const spawn2 = Math.round(Math.random(0, 1));

        // Set custom data for different types of enemies
        if (i <= Math.ceil(numOfEnemies * 0.6)) {
          const enemy = this.enemies.create(
            spawn ? xR : xL,
            spawn2 ? yT : yB,
            'enemy'
          );
          enemy.setCollideWorldBounds(false);
          enemy.setScale(0.2, 0.2);
          enemy.customData = { health: 150, speed: 200, damage: 50, exp: 30 };
        } else if (
          i > Math.ceil(numOfEnemies * 0.6) &&
          i <= Math.ceil(numOfEnemies * 0.8)
        ) {
          const enemy = this.enemies.create(
            spawn ? xR : xL,
            spawn2 ? yT : yB,
            'enemyFast'
          );
          enemy.setCollideWorldBounds(false);
          enemy.setScale(0.2, 0.2);
          enemy.customData = { health: 100, speed: 300, damage: 30, exp: 100 };
        } else {
          const enemy = this.enemies.create(
            spawn ? xR : xL,
            spawn2 ? yT : yB,
            'enemyTank'
          );
          enemy.setCollideWorldBounds(false);
          enemy.setScale(0.2, 0.2);
          enemy.customData = { health: 400, speed: 100, damage: 100, exp: 250 };
        }
      }
    }
    updateHealthBar(currentHealth, maxHealth) {
      const newWidth = (currentHealth / maxHealth) * 100;
      this.healthBar.setSize(newWidth, 8);
    }
    projectileEnemyCollision(projectile, enemy) {
      if (difficulty !== null) {
        projectile.customData.pierce--;
        if (projectile.customData.pierce <= 0) {
          if (this.block.customData.currentWeapon !== 3) {
            projectile.destroy();
          } else {
            this.destroyProjectileAndApplyAOE(projectile);
          }
        }
        if (this.block.customData.currentWeapon !== 3) {
          enemy.customData.health -= projectile.customData.damage; // Reduce enemy health
          if (enemy.customData.health <= 0) {
            enemy.destroy();
            this.block.customData.score += 1 * difficulty;
            this.block.customData.exp += enemy.customData.exp;
            if (
              this.block.customData.exp >=
              100 * this.block.customData.level
            ) {
              const remainingExp =
                this.block.customData.exp - 100 * this.block.customData.level;
              this.block.customData.level++;
              this.nextExp = 100 * this.block.customData.level;
              this.block.customData.exp = remainingExp;
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
          if (block.customData.health <= 0) {
            updateForm({ score: Math.ceil(this.block.customData.score) });
            this.death = true;
            this.scene.pause();
            setDeath(true);
          }
        }
        this.time.delayedCall(500, this.iframeChange, [], this);
      }
    }
    upgradePlayer(option) {
      if (option === 'speed') this.block.customData.speed += 0.1;
      if (option === 'health') this.block.customData.maxHealth += 10;
      if (option === 'pierce')
        this[`weapon${this.block.customData.currentWeapon}`].pierce += 1;
      if (option === 'damage')
        this[`weapon${this.block.customData.currentWeapon}`].damage +=
          this[`weapon${this.block.customData.currentWeapon}`].damageIncrease;
      if (option === 'fire-rate')
        this[`weapon${this.block.customData.currentWeapon}`].fireRate -= 75;
      if (option === 'shots')
        this[`weapon${this.block.customData.currentWeapon}`].shots += 1;
      if (option === 'aoe')
        this[`weapon${this.block.customData.currentWeapon}`].radius += 25;
      this.scene.resume();
      setPaused(false);
    }
    changeWeapon(option) {
      this.block.customData.currentWeapon = option;
      this.scene.resume();
      setPaused(false);
      setLevel((prev) => prev++);
    }
    changeHealthRegen() {
      this.healthRegenRate = !this.healthRegenRate;
    }
    destroyProjectileAndApplyAOE(projectile) {
      projectile.destroy();
      const enemiesInRange = this.enemies.getChildren().filter((enemy) => {
        return (
          Phaser.Math.Distance.Between(
            projectile.x,
            projectile.y,
            enemy.x,
            enemy.y
          ) <= this.weapon3.radius
        );
      });
      enemiesInRange.forEach((enemy) => {
        enemy.customData.health -= projectile.customData.damage;
        if (enemy.customData.health <= 0) {
          enemy.destroy();
          this.block.customData.score += 1 * difficulty;
          this.block.customData.exp += enemy.customData.exp;
          if (this.block.customData.exp >= 100 * this.block.customData.level) {
            const remainingExp =
              this.block.customData.exp - 100 * this.block.customData.level;
            this.block.customData.level++;
            this.nextExp = 100 * this.block.customData.level;
            this.block.customData.exp = remainingExp;
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
    updateExpBar(currentExp, nextExp) {
      const newWidth = (currentExp / nextExp) * this.game.config.width;
      // console.log(currentExp, nextExp);
      // console.log(newWidth);
      this.expBar.setSize(newWidth, 20);
    }
    update(time, delta) {
      this.updateExpBar(this.block.customData.exp, this.nextExp);
      if (this.block.customData.health < this.block.customData.maxHealth) {
        if (!this.healthRegenRate) {
          this.changeHealthRegen();
          this.block.customData.health += this.block.customData.regen;
          this.time.delayedCall(1000, this.changeHealthRegen, [], this);
        }
      }
      this.healthBarBackground.x = this.block.x - 40;
      this.healthBarBackground.y = this.block.y + 40;
      this.healthBar.x = this.block.x - 40;
      this.healthBar.y = this.block.y + 40;
      this.rateBackground.x = this.block.x - 40;
      this.rateBackground.y = this.block.y + 60;
      this.rateBar.x = this.block.x - 40;
      this.rateBar.y = this.block.y + 60;
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
        if (this.block.customData.currentWeapon === 3) {
          const MAX_DISTANCE = 200;
          const distanceTraveled = Phaser.Math.Distance.Between(
            this.block.x,
            this.block.y,
            projectile.x,
            projectile.y
          );
          if (distanceTraveled > MAX_DISTANCE) {
            this.destroyProjectileAndApplyAOE(projectile);
          } else {
            if (projectile.body.onWorldBounds) {
              if (projectile.body.checkWorldBounds()) {
                projectile.destroy();
              }
            }
          }
        } else {
          if (projectile.body.onWorldBounds) {
            if (projectile.body.checkWorldBounds()) {
              projectile.destroy();
            }
          }
        }
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
      this.block.rotation = angle + Math.PI / 2;
      this.enemies.children.iterate((enemy) => {
        const angle = Phaser.Math.Angle.Between(
          enemy.x,
          enemy.y,
          this.block.x,
          this.block.y
        );
        enemy.rotation = angle + Math.PI / 2;
      });
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
      arcade: { debug: false },
    },
    scene: Example,
  };
  useEffect(() => {
    if (difficulty !== null) {
      const phaserGame = new Phaser.Game(config);
      setGame(phaserGame);
      return () => {
        phaserGame.destroy(true);
      };
    }
  }, [difficulty]);
  function upgradePlayer(option) {
    if (game !== null) {
      game.scene.scenes[0].upgradePlayer(option);
    }
  }
  function changeWeapon(option) {
    if (game !== null) {
      console.log(game);
      game.scene.scenes[0].changeWeapon(option);
    }
  }
  async function submitScore(e) {
    if (game) {
      e.preventDefault();
      console.log(game.scene.scenes[0].block.customData);
      console.log(difficulty);
      const leaderboardFetch = await fetch(
        'http://localhost:5000/leaderboard/edit',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      );
      console.log(form);
      const leaderboard_response = await leaderboardFetch.json();
      if (leaderboard_response.success) {
        navigate('/');
      } else {
        console.log(form);
        console.log(leaderboard_response.error);
      }
    }
  }

  // return difficulty === null ? (
  //   <div id='diff'>
  //     <button onClick={() => setDifficulty(1.1)}>Easy</button>
  //     <button onClick={() => setDifficulty(1.5)}>Medium</button>
  //     <button onClick={() => setDifficulty(2)}>Hard</button>
  //   </div>
  // ) : ( game && game.scene && game.scene.scenes[0] && !game.scene.scenes[0].block.customData.death ? (
  //   <div id='phaser-game'>
  //     {paused && game.scene.scenes[0].block.customData.level > 2 ? (
  //       <div>
  //         <button onClick={() => upgradePlayer('speed')}>
  //           <img src={speedI} alt=''   />
  //           Speed
  //         </button>
  //         <button onClick={() => upgradePlayer('health')}>
  //           <img src={healthI} alt=''   />
  //           Health
  //         </button>
  //         <button onClick={() => upgradePlayer('damage')}>
  //           <img src={dmgI} alt=''   />
  //           Damage
  //         </button>
  //         {game.scene.scenes[0].block.customData.currentWeapon <= 1 ? (
  //           <button onClick={() => upgradePlayer('pierce')}>
  //             <img src={pierceI} alt=''   />
  //             Pierce
  //           </button>
  //         ) : game.scene.scenes[0].block.customData.currentWeapon === 2 ? (
  //           <button onClick={() => upgradePlayer('shots')}>
  //             <img src={shotgunI} alt=''   />
  //             Shots
  //           </button>
  //         ) : (
  //           <button onClick={() => upgradePlayer('aoe')}>
  //             <img src={grenadeI} alt=''   />
  //             Blast radius
  //           </button>
  //         )}
  //         <button onClick={() => upgradePlayer('fire-rate')}>
  //           <img src={rateI} alt=''   />
  //           Fire rate
  //         </button>
  //       </div>
  //     ) : paused ? (
  //       <div>
  // <button onClick={() => changeWeapon(0)}>
  //   <img src={normalI} alt=''   />
  //   Keep weapon
  // </button>
  // <button onClick={() => changeWeapon(1)}>
  //   <img src={sniperI} alt=''   />
  //   Sniper
  // </button>
  // <button onClick={() => changeWeapon(2)}>
  //   <img src={shotgunI} alt=''   />
  //   Shotgun
  // </button>
  // <button onClick={() => changeWeapon(3)}>
  //   <img src={grenadeI} alt=''   />
  //   Grenades
  // </button>
  //       </div>
  //     ) : null}
  //   </div>) : game && game.scene && game.scene.scenes[0] && game.scene.scenes[0].block.customData.death ? (
  //      <div id='diff'>
  //       <form onSubmit={submitScore}>
  //         <input type="text" name="name" id="name" onChange={(e) => updateForm({name: e.target.value})}/>
  //         <button type="submit">Submit</button>
  //       </form>
  //     </div>
  //   ): null
  // );
  return (
    <>
      {difficulty === null && (
        <div id='diff'>
          <button onClick={() => setDifficulty(1.1)}>Easy</button>
          <button onClick={() => setDifficulty(1.5)}>Medium</button>
          <button onClick={() => setDifficulty(2)}>Hard</button>
        </div>
      )}

      {game && game.scene && game.scene.scenes[0] && !death && (
        <div id='phaser-game'>
          {paused && game.scene.scenes[0].block.customData.level > 2 ? (
            <div>
              <button onClick={() => upgradePlayer('speed')}>
                <img src={speedI} alt='' />
                Speed
              </button>
              <button onClick={() => upgradePlayer('health')}>
                <img src={healthI} alt='' />
                Health
              </button>
              <button onClick={() => upgradePlayer('damage')}>
                <img src={dmgI} alt='' />
                Damage
              </button>
              <button onClick={() => upgradePlayer('fire-rate')}>
                <img src={rateI} alt='' />
                Fire rate
              </button>
              {game.scene.scenes[0].block.customData.currentWeapon <= 1 ? (
                <button onClick={() => upgradePlayer('pierce')}>
                  <img src={pierceI} alt='' />
                  Pierce
                </button>
              ) : game.scene.scenes[0].block.customData.currentWeapon === 2 ? (
                <button onClick={() => upgradePlayer('shots')}>
                  <img src={shotgunI} alt='' />
                  Shots
                </button>
              ) : (
                <button onClick={() => upgradePlayer('aoe')}>
                  <img src={grenadeI} alt='' />
                  Blast radius
                </button>
              )}
            </div>
          ) : paused ? (
            <div>
              <button onClick={() => changeWeapon(0)}>
                <img src={normalI} alt='' />
                Keep weapon
              </button>
              <button onClick={() => changeWeapon(1)}>
                <img src={sniperI} alt='' />
                Sniper
              </button>
              <button onClick={() => changeWeapon(2)}>
                <img src={shotgunI} alt='' />
                Shotgun
              </button>
              <button onClick={() => changeWeapon(3)}>
                <img src={grenadeI} alt='' />
                Grenades
              </button>
            </div>
          ) : null}
        </div>
      )}

      {game && game.scene && game.scene.scenes[0] && death && (
        <div id='diff'>
          <form onSubmit={submitScore}>
            <h1>Name:</h1>
            <input
              className='in'
              type='text'
              name='name'
              id='name'
              onChange={(e) => updateForm({ name: e.target.value })}
            />
            <button type='submit'>Submit</button>
          </form>
        </div>
      )}
    </>
  );
}

export default PhaserTest;
