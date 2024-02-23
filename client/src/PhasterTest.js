import React, { useEffect } from 'react';
import Phaser from 'phaser';

let game;
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
    }

    preload() {
        this.load.image('block', 'assets/sprites/block.png');
        this.load.image('projectile', 'assets/sprites/projectile.png');
    }

    create() {
        this.block = this.physics.add.sprite(400, 300, 'block').setCollideWorldBounds(true);
        this.projectiles = this.physics.add.group();
        this.enemies = this.physics.add.group();
        // Define keyboard cursors
        const cursors = this.input.keyboard.createCursorKeys();

        this.input.on('pointerdown', (pointer) => {
            const projectile = this.projectiles.create(this.block.x, this.block.y, 'projectile');

            // Calculate direction towards the mouse pointer
            const angle = Phaser.Math.Angle.Between(this.block.x, this.block.y, pointer.worldX, pointer.worldY);
            const velocity = new Phaser.Math.Vector2(pointer.worldX - this.block.x, pointer.worldY - this.block.y).normalize().scale(400);

            // Set velocity for the projectile
            projectile.setVelocity(velocity.x, velocity.y);
        });
        this.physics.world.setBoundsCollision(true, true, true, true);

        // Destroy projectiles when they leave the screen
        this.physics.world.on('worldbounds', (body) => {
            if (body.gameObject instanceof Phaser.GameObjects.Sprite) {
                body.gameObject.destroy();
            }
        });

        // Set velocity based on keyboard input
        this.input.keyboard.on('keydown', (event) => {
            const speed = 200;
            if(event.key === "w")this.block.setVelocityY(-speed);
            if(event.key === "s")this.block.setVelocityY(speed);
            if(event.key === "a")this.block.setVelocityX(-speed);
            if(event.key === "d")this.block.setVelocityX(speed);
        });

        // Stop the sprite when the key is released
        this.input.keyboard.on('keyup', () => {
            this.block.setVelocity(0);
        });
        const numEnemies = 10; // Change this to the desired number of enemies
        for (let i = 0; i < numEnemies; i++) {
            const x = Phaser.Math.Between(0, this.physics.world.bounds.width);
            const y = Phaser.Math.Between(0, this.physics.world.bounds.height);
            const enemy = this.enemies.create(x, y, 'enemy');
            enemy.setCollideWorldBounds(true);
        }
    }
    update(time, delta){
        this.enemies.children.iterate(enemy => {
            const speed = 150;
            const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.block.x, this.block.y);
            const velocity = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle)).normalize().scale(150);
            enemy.setVelocity(velocity.x, velocity.y);
        });
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


function PhaserTest() {
    useEffect(() => {
        game = new Phaser.Game(config);
    }, []);

    return <div id="phaser-game" />;
}

export default PhaserTest;