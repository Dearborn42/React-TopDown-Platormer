import React, { useEffect } from 'react';
import Phaser from 'phaser';

function PhaserTest({round, enemies}) {
    class Example extends Phaser.Scene {
        constructor() {
            super({
                physics: {
                    arcade: {
                        debug: true,
                    }
                }
            });

            // Initialize enemies and block as class properties
            this.block = this.projectiles = this.enemies = null;
            this.gameInfo = {
                round,
                numOfEnemies: enemies
            }
        }

        preload() {
            this.load.image('block', 'assets/sprites/block.png');
            this.load.image('projectile', 'assets/sprites/projectile.png');
        }

        create() {
            this.block = this.physics.add.sprite(400, 300, 'block').setCollideWorldBounds(true);
            this.projectiles = this.physics.add.group();
            this.enemies = this.physics.add.group();

            this.block.customData = {
                health: 100,
                speed: 1.5,
                score: 0
            };
            // Define keyboard cursors
            // const cursors = this.input.keyboard.createCursorKeys();

            this.input.on('pointerdown', (pointer) => {
                const projectile = this.projectiles.create(this.block.x, this.block.y, 'projectile');

                const velocity = new Phaser.Math.Vector2(pointer.worldX - this.block.x, pointer.worldY - this.block.y).normalize().scale(400);

                projectile.setVelocity(velocity.x, velocity.y);
            });
            this.physics.world.setBoundsCollision(true, true, true, true);

            // Destroy projectiles when they leave the screen
            this.physics.world.on('worldbounds', (body) => {
                if (body.gameObject instanceof Phaser.GameObjects.Sprite) {
                    body.gameObject.destroy();
                }
            });

            for (let i = 0; i < this.gameInfo.numOfEnemies; i++) {
                const x = Phaser.Math.Between(0, this.physics.world.bounds.width);
                const y = Phaser.Math.Between(0, this.physics.world.bounds.height);
                const enemy = this.enemies.create(x, y, 'enemy');
                enemy.setCollideWorldBounds(true);
            }
        }
        update(time, delta){
            this.enemies.children.iterate(enemy => {
                const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.block.x, this.block.y);
                const velocity = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle)).normalize().scale(150);
                enemy.setVelocity(velocity.x, velocity.y);
            });

            const pointer = this.input.mousePointer;
            const distance = Phaser.Math.Distance.Between(this.block.x, this.block.y, pointer.worldX, pointer.worldY);
            const angle = Phaser.Math.Angle.Between(this.block.x, this.block.y, pointer.worldX, pointer.worldY);
            const velocityX = Math.cos(angle) * distance * this.block.customData.speed;
            const velocityY = Math.sin(angle) * distance * this.block.customData.speed;

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
            arcade: { debug: true }
        },
        scene: Example
    };
    useEffect(() => {
        new Phaser.Game(config);
    }, []);

    return <div id="phaser-game" />;
}

export default PhaserTest;