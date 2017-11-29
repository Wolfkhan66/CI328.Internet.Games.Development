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

    createPlatform(x, y, scaleX, scaleY) {
        // get the first sprite in the group that is not in use
        const platform = this.group.getFirstExists(false);
        if (platform) {
            // reset the x and y of the sprite and set the scale
            platform.reset(x, y);
            platform.scale.setTo(scaleX, scaleY);
            // make the sprite body immovable to ensure the player collides properly with them.
            platform.body.immovable = true;
        }
    }

    createStar(x, y, scaleX, scaleY) {
        // get the first sprite in the group that is not in use
        const star = this.group.getFirstExists(false);
        if (star) {
            // reset the x and y of the sprite and set the scale
            star.reset(x, y);
            star.scale.setTo(scaleX, scaleY);
            star.anchor.setTo(0.5, 0.5);
            //give the sprite some gravity and a random bounce value
            star.body.gravity.y = 300;
            star.body.bounce.y = 0.7 + Math.random() * 0.2;
            star.following = true;
            star.speed = 50;
        }
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
            enemy.animations.add('right', [2, 3], 10, true);
            enemy.animations.add('left', [0, 1], 10, true);
            enemy.body.bounce.y = 0.3;
            enemy.timer = game.time.create(false);
            enemy.health = 10;
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