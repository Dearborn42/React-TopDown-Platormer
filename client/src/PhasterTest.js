import React, { useEffect } from 'react';
import Phaser from 'phaser';

let game;
class Example extends Phaser.Scene
{
    preload ()
    {
        this.load.image('block', 'assets/sprites/block.png');
        this.load.image('flower', 'assets/sprites/flower-exo.png');
    }

    create ()
    {
        const block = this.physics.add.image(400, 100, 'block')
            .setVelocity(100, 200)
            .setBounce(1, 1)
            .setCollideWorldBounds(true);

        const flower = this.add.image(0, 0, 'flower');

        this.events.on('postupdate', () =>
        {
            Phaser.Display.Align.To.TopCenter(flower, block);
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
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