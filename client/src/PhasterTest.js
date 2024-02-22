import React, { useEffect } from 'react';
import Phaser from 'phaser';

let game;
class Example extends Phaser.Scene {
    preload() {
        this.load.image('block', 'assets/sprites/block.png');
        this.load.image('projectile', 'assets/sprites/projectile.png');
    }

    create() {
        const block = this.physics.add.image(400, 300, 'block').setCollideWorldBounds(true);
        const projectiles = this.physics.add.group();

        // Define keyboard cursors
        const cursors = this.input.keyboard.createCursorKeys();

        this.input.on('pointerdown', (pointer) => {
            const projectile = projectiles.create(block.x, block.y, 'projectile');

            // Calculate direction towards the mouse pointer
            const angle = Phaser.Math.Angle.Between(block.x, block.y, pointer.worldX, pointer.worldY);
            const velocity = new Phaser.Math.Vector2(pointer.worldX - block.x, pointer.worldY - block.y).normalize().scale(400);

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
            if(event.key === "w")
                block.setVelocityY(-speed);
            if(event.key === "s")
                block.setVelocityY(speed);
            if(event.key === "a")
                block.setVelocityX(-speed);
            if(event.key === "d")
                block.setVelocityX(speed);
        });

        // Stop the sprite when the key is released
        this.input.keyboard.on('keyup', () => {
            block.setVelocity(0);
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