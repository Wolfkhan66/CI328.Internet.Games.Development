var game;

function main() {
    game = new Phaser.Game(800, 600, Phaser.AUTO, '', { create: create });
}

function create() {
    game.add.text(50, 50, "Phaser is working!", { fontSize: '32px', fill: '#FFF' });
}