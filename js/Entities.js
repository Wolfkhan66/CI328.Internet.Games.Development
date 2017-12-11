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

    createEnemy(x, y, scaleX, scaleY) {
        console.log("Creating enemy");
        // get the first sprite in the group that is not in use
        const enemy = this.group.getFirstExists(false);
        if (enemy) {
            enemy.body.collideWorldBounds = true;
            enemy.reset(x, y);
            enemy.scale.setTo(scaleX, scaleY);
            enemy.body.gravity.y = 500;
            enemy.anchor.setTo(0.5, 0.5);
            enemy.animations.add('attack', ['Test/attack1.png', 'Test/attack2.png'], 6, false);
            enemy.animations.add('run', ['Test/running1.png', 'Test/running2.png', 'Test/running3.png', 'Test/running4.png'], 7, true);
            enemy.animations.add('idle', ['Test/idle.png', 'Test/idle.png'], 2, true);
            enemy.animations.add('damaged', ['Test/damaged.png', 'Test/damaged.png'], 2, false);
            enemy.body.bounce.y = 0.3;
            enemy.timer = game.time.create(false);
            enemy.health = 100;
            enemy.range = game.rnd.integerInRange(20, 80);
            enemy.speed = game.rnd.integerInRange(30, 100);
            enemy.damage = game.rnd.integerInRange(4, 6);
            enemy.reactionTime = (game.rnd.integerInRange(7, 10) / 10);
            enemy.facingLeft = false;
            enemy.facingRight = false;
            enemy.attacking = false;
            enemy.cooldown = false;
            enemy.inRange = false;
            enemy.chargingAttack = false;
            enemy.following = true;
            enemy.takingDamage = false;
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