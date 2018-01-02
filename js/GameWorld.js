class GameWorld {
    constructor() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.player = new Player();
        this.paralex = [];
        this.map = game.add.tilemap('map1');
        this.layer = this.map.createLayer('Tile Layer 1');
        this.map.visible = false;
        this.layer.visible = false;
        this.warriors = new CollidableGroup(10, 'warrior', warriorFactory);
        this.archers = new CollidableGroup(10, 'archer', archerFactory);
        this.mages = new CollidableGroup(10, 'mage', mageFactory);
        this.mystics = new CollidableGroup(10, 'mystic', mysticFactory);
        this.critters = new CollidableGroup(10, 'critters', crittersFactory);
        this.potions = new CollidableGroup(3, 'healthPotion', potionFactory);
        this.projectiles = new CollidableGroup(10, 'arrow', projectileFactory);
        console.log("GameWorld Instantiated.");
    }

    update() {
        this.player.update();
        this.warriors.updateGroup();
        this.archers.updateGroup();
        this.mages.updateGroup();
        this.mystics.updateGroup();
        this.critters.updateGroup();
        this.potions.updateGroup();
        this.projectiles.updateGroup();
        this.paralex.forEach(sprite => sprite.update(sprite));
    }

    cleanup() {
        this.warriors.destroyGroup();
        this.archers.destroyGroup();
        this.mages.destroyGroup();
        this.mystics.destroyGroup();
        this.critters.destroyGroup();
        this.potions.destroyGroup();
        this.projectiles.destroyGroup();
        this.paralex.forEach(sprite => sprite.kill());
        this.map.destroy();
        this.layer.destroy();
    }

    createMap(tilemap) {
        this.map = game.add.tilemap(tilemap);
        this.map.addTilesetImage('jungle tileset');
        this.map.setCollisionBetween(41, 82, 120);
        this.layer = this.map.createLayer('Tile Layer 1');
        this.map.visible = true;
        this.layer.visible = true;
        this.layer.resizeWorld();
        game.world.sendToBack(this.map);
        game.world.sendToBack(this.layer);
        this.createParalexBackground("Paralex1", 0.4);
        this.createParalexBackground("Paralex2", 0.6);
        this.createParalexBackground("Paralex3", 0.8);
        this.createParalexBackground("Paralex4", 1);
        this.createParalexBackground("Paralex5", 0);
    }

    createParalexBackground(name, speed) {
        for (var i = -3; i < 3; i++) {
            var sprite = game.add.sprite(799 * i, 0, name);
            sprite.update = function () { if (game.cameraMovingLeft) { this.x -= speed } if (game.cameraMovingRight) { this.x += speed } }
            game.world.sendToBack(sprite);
            this.paralex.push(sprite);
        }
    }

    createEnemy() {
        if (game.enemiesAlive == 0) {
            game.enemySpawnTimer.start();
        }
        if (game.enemySpawnTimer.seconds > 1) {
            var spawnLocation = game.rnd.integerInRange(1, 2);
            var x = 0;
            var y = 450;
            if (spawnLocation == 1) {
                x = 10;
            }
            else {
                x = 2350
            }

            var enemyType = game.rnd.integerInRange(1, 6);

            switch (enemyType) {
                case 1: {
                    this.warriors.createEnemy(x, y, "Warrior");
                    game.enemySpawnTimer.stop();
                    game.enemiesAlive++;
                    game.difficulty--;
                    game.enemySpawnTimer.start();
                    break;
                }
                case 2: {
                    this.archers.createEnemy(x, y, "Archer");
                    game.enemySpawnTimer.stop();
                    game.enemiesAlive++;
                    game.difficulty--;
                    game.enemySpawnTimer.start();
                    break;
                }
                case 3: {
                    this.mages.createEnemy(x, y, "Mage");
                    game.enemySpawnTimer.stop();
                    game.enemiesAlive++;
                    game.difficulty--;
                    game.enemySpawnTimer.start();
                    break;
                }
                case 4: {
                    this.mystics.createEnemy(x, y, "Mystic");
                    game.enemySpawnTimer.stop();
                    game.enemiesAlive++;
                    game.difficulty--;
                    game.enemySpawnTimer.start();
                    break;
                }
                case 5: {
                    this.critters.createEnemy(x, y, "Critter1");
                    game.enemySpawnTimer.stop();
                    game.enemiesAlive++;
                    game.difficulty--;
                    game.enemySpawnTimer.start();
                    break;
                }
                case 6: {
                    this.critters.createEnemy(x, y, "Critter2");
                    game.enemySpawnTimer.stop();
                    game.enemiesAlive++;
                    game.difficulty--;
                    game.enemySpawnTimer.start();
                    break;
                }
            }
        }
    }
}

function projectileFactory(sprite) {
    sprite.entity = new Entity();
    sprite.entity.addControl(destroyOutOfBoundsControl);
}

function potionFactory(sprite) {
    sprite.entity = new Entity();
    sprite.entity.addControl(timeOutControl);
}

function warriorFactory(sprite) {
    sprite.entity = new Entity();
    sprite.entity.addControl(followPlayerXControl);
    sprite.entity.addControl(followPlayerYControl);
    sprite.entity.addControl(attackControl);
    sprite.entity.addControl(chargingAttackControl);
    sprite.entity.addControl(cooldownControl);
    sprite.entity.addControl(deathControl);
    sprite.entity.addControl(takeDamageControl);
    sprite.entity.addControl(xGravityControl);
};

function archerFactory(sprite) {
    sprite.entity = new Entity();
    sprite.entity.addControl(followPlayerXControl);
    sprite.entity.addControl(followPlayerYControl);
    sprite.entity.addControl(rangedAttackControl);
    sprite.entity.addControl(chargingAttackControl);
    sprite.entity.addControl(cooldownControl);
    sprite.entity.addControl(deathControl);
    sprite.entity.addControl(takeDamageControl);
    sprite.entity.addControl(xGravityControl);
};

function mageFactory(sprite) {
    sprite.entity = new Entity();
    sprite.entity.addControl(followPlayerXControl);
    sprite.entity.addControl(followPlayerYControl);
    sprite.entity.addControl(rangedAttackControl);
    sprite.entity.addControl(chargingAttackControl);
    sprite.entity.addControl(cooldownControl);
    sprite.entity.addControl(deathControl);
    sprite.entity.addControl(takeDamageControl);
    sprite.entity.addControl(xGravityControl);
};

function mysticFactory(sprite) {
    sprite.entity = new Entity();
    sprite.entity.addControl(followPlayerXControl);
    sprite.entity.addControl(chargingAttackControl);
    sprite.entity.addControl(attackControl);
    sprite.entity.addControl(cooldownControl);
    sprite.entity.addControl(deathControl);
    sprite.entity.addControl(takeDamageControl);
    sprite.entity.addControl(xGravityControl);
};

function crittersFactory(sprite) {
    sprite.entity = new Entity();
    sprite.entity.addControl(followPlayerXControl);
    sprite.entity.addControl(chargingAttackControl);
    sprite.entity.addControl(jumpAttackControl);
    sprite.entity.addControl(cooldownControl);
    sprite.entity.addControl(deathControl);
    sprite.entity.addControl(takeDamageControl);
    sprite.entity.addControl(xGravityControl);
};
