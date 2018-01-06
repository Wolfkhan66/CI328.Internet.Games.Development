class Entity {
    constructor() {
        this.controls = [];
    }

    addControl(control) {
        this.controls.push(control);
    }

    removeControl(control) {
        var index = this.controls.indexOf(control);
        this.controls.splice(index, 1);
    }

    update(sprite) {
        this.controls.forEach(function (callback) {
            callback(sprite);
        });
    }
}

class CollidableGroup {
    constructor(size, spriteName, initCallback) {
        const group = game.add.group();
        // enable physics body on sprite
        group.enableBody = true;

        // create multiple sprites in the group to be reused
        group.createMultiple(size, spriteName);
        group.forEach(initCallback);

        this.group = group;
    }

    createPotion(x, y, velocityY) {
        const potion = this.group.getFirstExists(false);
        if (potion) {
            potion.body.collideWorldBounds = true;
            potion.reset(x, y);
            potion.body.velocity.y = velocityY;
            potion.body.gravity.y = 500;
            potion.body.bounce.y = 0.5;
            potion.timer = game.time.create(false);
            potion.alive = false;
        }
    }

    createArrow(x, y, velocityX) {
        const arrow = this.group.getFirstExists(false);
        if (arrow) {
            arrow.reset(x, y);
            arrow.body.velocity.x = velocityX;
            arrow.body.gravity.y = 200;
            arrow.body.bounce.y = 0.5;
            arrow.damage = game.rnd.integerInRange(5, 10);
        }
    }

    createEnemy(x, y, type) {
        console.log("Creating enemy");
        const enemy = this.group.getFirstExists(false);
        if (enemy) {
            enemy.type = type;
            enemy.body.collideWorldBounds = true;
            enemy.reset(x, y);
            enemy.body.gravity.y = 500;
            enemy.anchor.setTo(0.5, 0.5);
            enemy.body.bounce.y = 0.3;
            enemy.timer = game.time.create(false);
            enemy.facingLeft = false;
            enemy.facingRight = false;
            enemy.attacking = false;
            enemy.cooldown = false;
            enemy.inRange = false;
            enemy.inYRange = false;
            enemy.chargingAttack = false;
            enemy.following = true;
            enemy.takingDamage = false;
            enemy.playingSound = false;
            enemy.playerYTimer = game.time.create(false);
            this.setAnimations(enemy, type);
            this.setStats(enemy, type);
        }
    }

    setAnimations(enemy, type) {
        switch (type) {
            case "Warrior": {
                enemy.animations.add('attack', ['attack1.png', 'attack2.png'], 6, false);
                enemy.animations.add('move', ['moving1.png', 'moving2.png'], 7, true);
                enemy.animations.add('idle', ['idle.png', 'idle.png'], 2, true);
                enemy.animations.add('damaged', ['damaged1.png', 'damaged2.png'], 2, false);
                break;
            }
            case "Archer": {
                enemy.animations.add('attack', ['attack1.png', 'attack2.png'], 6, false);
                enemy.animations.add('move', ['moving1.png', 'moving2.png'], 7, true);
                enemy.animations.add('idle', ['idle.png', 'idle.png'], 2, true);
                enemy.animations.add('damaged', ['damaged1.png', 'damaged2.png'], 2, false);
                break;
            }
            case "Mage": {
                enemy.animations.add('attack', ['attack1.png', 'attack2.png'], 6, false);
                enemy.animations.add('move', ['moving1.png', 'moving2.png'], 7, true);
                enemy.animations.add('idle', ['idle.png', 'idle.png'], 2, true);
                enemy.animations.add('damaged', ['damaged.png', 'idle.png'], 2, false);
                break;
            }
            case "Mystic": {
                enemy.animations.add('attack', ['attack1.png', 'attack2.png'], 6, false);
                enemy.animations.add('move', ['moving1.png', 'moving2.png'], 7, true);
                enemy.animations.add('idle', ['idle.png', 'idle.png'], 2, true);
                enemy.animations.add('damaged', ['damaged.png', 'idle.png'], 2, false);
                break;
            }
            case "Critter1": {
                enemy.animations.add('move', ['Critter1/moving1.png', 'Critter1/moving2.png'], 7, true);
                enemy.animations.add('attack', ['Critter1/moving2.png', 'Critter1/moving2.png'], 6, false);
                enemy.animations.add('damaged', ['Critter1/damaged.png', 'Critter1/moving1.png'], 2, false);
                break;
            }
            case "Critter2": {
                enemy.animations.add('move', ['Critter2/moving1.png', 'Critter2/moving2.png'], 7, true);
                enemy.animations.add('attack', ['Critter2/moving2.png', 'Critter2/moving2.png'], 6, false);
                enemy.animations.add('damaged', ['Critter2/damaged.png', 'Critter2/moving1.png'], 2, false);
                break;
            }
        }
    }

    setStats(enemy, type) {
        switch (type) {
            case "Warrior": {
                enemy.health = 50 * game.difficultyLevel;
                enemy.range = game.rnd.integerInRange(60, 80);
                enemy.speed = game.rnd.integerInRange(200, 280);
                enemy.damage = game.rnd.integerInRange(5, 10) * game.difficultyLevel;
                enemy.reactionTime = (game.rnd.integerInRange(7, 10) / 10);
                break;
            }
            case "Archer": {
                enemy.health = 25 * game.difficultyLevel;
                enemy.range = game.rnd.integerInRange(300, 350);
                enemy.speed = game.rnd.integerInRange(200, 280);
                enemy.damage = game.rnd.integerInRange(2, 4) * game.difficultyLevel;
                enemy.reactionTime = (game.rnd.integerInRange(7, 10) / 10);
                break;
            }
            case "Mage": {
                enemy.health = 15 * game.difficultyLevel;
                enemy.range = game.rnd.integerInRange(250, 300);
                enemy.speed = game.rnd.integerInRange(200, 280);
                enemy.damage = game.rnd.integerInRange(4, 6) * game.difficultyLevel;
                enemy.reactionTime = (game.rnd.integerInRange(7, 10) / 10);
                break;
            }
            case "Mystic": {
                enemy.health = 100 * game.difficultyLevel;
                enemy.range = 100;
                enemy.speed = game.rnd.integerInRange(200, 280);
                enemy.damage = game.rnd.integerInRange(4, 6) * game.difficultyLevel;
                enemy.reactionTime = (game.rnd.integerInRange(7, 10) / 10);
                break;
            }
            case "Critter1": {
                enemy.health = 20 * game.difficultyLevel;
                enemy.range = game.rnd.integerInRange(20, 80);
                enemy.speed = game.rnd.integerInRange(200, 300);
                enemy.damage = game.rnd.integerInRange(1, 2) * game.difficultyLevel;
                enemy.reactionTime = (game.rnd.integerInRange(7, 10) / 10);
                break;
            }
            case "Critter2": {
                enemy.health = 20 * game.difficultyLevel;
                enemy.range = game.rnd.integerInRange(20, 80);
                enemy.speed = game.rnd.integerInRange(200, 300);
                enemy.damage = game.rnd.integerInRange(1, 2) * game.difficultyLevel;
                enemy.reactionTime = (game.rnd.integerInRange(7, 10) / 10);
                break;
            }
        }
    }

    updateGroup() {
        // For any sprites in this group in use, call their entity update function
        this.group.forEachExists(function (sprite) {
            sprite.entity.update(sprite);
        })
    }

    destroyGroup() {
        // Destroy all sprites in use for this group
        this.group.forEachExists(function (sprite) {
            sprite.kill()
        })
    }

}