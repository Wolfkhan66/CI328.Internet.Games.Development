class GameWorld {
    constructor() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.player = new Player();

        this.map = game.add.tilemap('map');
        this.layer = this.map.createLayer('Tile Layer 1');
        this.map.visible = false;
        this.layer.visible = false;

        this.stars = new CollidableGroup(5, 'star', starFactory);
        this.enemies = new CollidableGroup(10, 'enemies', enemyFactory);
        console.log("GameWorld Instantiated.");
    }

    update() {
        this.player.update();
        this.enemies.updateGroup();
        this.stars.updateGroup();
    }

    cleanup() {
        this.stars.destroyGroup();
        this.enemies.destroyGroup();
    }

    createMap1() {
        this.map = game.add.tilemap('map');
        this.map.addTilesetImage('jungle tileset');

        this.map.setCollisionBetween(41, 82, 120);
        this.layer = this.map.createLayer('Tile Layer 1');
        this.map.visible = true;
        this.layer.visible = true;

        this.layer.resizeWorld();
        game.world.sendToBack(this.map);
        game.world.sendToBack(this.layer);
    }
}

function starFactory(sprite) {
    sprite.entity = new Entity();
    sprite.entity.addControl(followPlayerControl);
}

function enemyFactory(sprite) {
    sprite.entity = new Entity();
    sprite.entity.addControl(followPlayerControl);
    //sprite.entity.addControl(jumpAttackControl);
    sprite.entity.addControl(attackControl);
    sprite.entity.addControl(cooldownControl);
    sprite.entity.addControl(deathControl);
    sprite.entity.addControl(takeDamageControl);
    sprite.entity.addControl(xGravityControl);
};