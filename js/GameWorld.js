class GameWorld {
    constructor() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.player = new Player();
        this.paralex = [];
        this.map = game.add.tilemap('map');
        this.layer = this.map.createLayer('Tile Layer 1');
        this.map.visible = false;
        this.layer.visible = false;
        this.enemies = new CollidableGroup(10, 'enemies', enemyFactory);
        console.log("GameWorld Instantiated.");
    }

    update() {
        this.player.update();
        this.enemies.updateGroup();
        this.paralex.forEach(sprite => sprite.update(sprite));
    }

    cleanup() {
        this.enemies.destroyGroup();
        this.paralex.forEach(sprite => sprite.kill());
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
        this.createParalexBackground();
    }

    createParalexBackground() {
        // Needs refactoring to follow DRY principle
        for (var i = -3; i < 3; i++) {
            var sprite = game.add.sprite(799 * i, 0, 'Paralex1');
            sprite.update = function () { if (game.cameraMovingLeft) { this.x -= 0.4 } if (game.cameraMovingRight) { this.x += 0.4 } }
            game.world.sendToBack(sprite);
            this.paralex.push(sprite);
        }
        for (var i = -3; i < 3; i++) {
            var sprite = game.add.sprite(799 * i, 0, 'Paralex2');
            sprite.update = function () { if (game.cameraMovingLeft) { this.x -= 0.6 } if (game.cameraMovingRight) { this.x += 0.6 } }
            game.world.sendToBack(sprite);
            this.paralex.push(sprite);
        }
        for (var i = -3; i < 3; i++) {
            var sprite = game.add.sprite(799 * i, 0, 'Paralex3');
            sprite.update = function () { if (game.cameraMovingLeft) { this.x -= 0.8 } if (game.cameraMovingRight) { this.x += 0.8 } }
            game.world.sendToBack(sprite);
            this.paralex.push(sprite);
        }
        for (var i = -3; i < 3; i++) {
            var sprite = game.add.sprite(799 * i, 0, 'Paralex4');
            sprite.update = function () { if (game.cameraMovingLeft) { this.x -= 1 } if (game.cameraMovingRight) { this.x += 1 } }
            game.world.sendToBack(sprite);
            this.paralex.push(sprite);
        }
        for (var i = -3; i < 3; i++) {
            var sprite = game.add.sprite(799 * i, 0, 'Paralex5');
            sprite.update = function () { }
            game.world.sendToBack(sprite);
            this.paralex.push(sprite);
        }
    }
}

function enemyFactory(sprite) {
    sprite.entity = new Entity();
    sprite.entity.addControl(followPlayerControl);
    sprite.entity.addControl(attackControl);
    sprite.entity.addControl(cooldownControl);
    sprite.entity.addControl(deathControl);
    sprite.entity.addControl(takeDamageControl);
    sprite.entity.addControl(xGravityControl);
};