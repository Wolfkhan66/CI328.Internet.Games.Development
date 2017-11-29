
function TestControl(sprite) {
    console.log("Test Control running...");
}

function FollowPlayer(sprite) {
    // If the sprite isn't attacking
    if (sprite.following) {
        //console.log("Following player");
        // if the player sprite x coordinate is higher than this sprites x coordinate
        if (gameWorld.player.sprite.x > sprite.x) {
            // Stop sprite action timer and raise x velocity to move to the right
            sprite.body.velocity.x = sprite.speed;
            sprite.animations.play('right');
            sprite.facingLeft = false;
            sprite.facingRight = true;
        }
        else {
            // Stop sprite action timer and lower x velocity to move to the left
            sprite.body.velocity.x = -sprite.speed;
            sprite.animations.play('left');
            sprite.facingLeft = true;
            sprite.facingRight = false;
        }
    }
}

function JumpAttackControl(sprite) {
    // if sprite is not in range to attack and is not on cooldown, reset the attack booleans and stop the action timer.
    if (!sprite.inRange && !sprite.cooldown) { sprite.attacking = false; sprite.chargingAttack = false; sprite.timer.stop(); }
    // if the player is to the right
    if (gameWorld.player.sprite.x > sprite.x) {
        // if the player is in attack range to the right, set in range to true and stop following the player
        if (gameWorld.player.sprite.x - sprite.range < sprite.x) { sprite.inRange = true; sprite.following = false; }
        // if the player isn't in attack range and if the sprite isn't currently attacking or on cooldown, then start following the player again 
        else {
            sprite.inRange = false;
            if (!sprite.attacking && !sprite.chargingAttack && !sprite.cooldown) {
                sprite.following = true;
            }
        }
    }
    // same as above but to the left // Needs to be refactored to follow the DRY principle
    else {
        if (gameWorld.player.sprite.x + sprite.range > sprite.x) { sprite.inRange = true; sprite.following = false; }
        else {
            sprite.inRange = false;
            if (!sprite.attacking && !sprite.chargingAttack && !sprite.cooldown) {
                sprite.following = true;
            }
        }
    }

    // if the sprite is on cooldown
    if (sprite.cooldown) {
        //console.log("Cooling down");
        // if the sprite is moving left or right, slowly bring the x velocity to 0
        if (sprite.body.velocity.x > 0) {
            sprite.body.velocity.x -= 3;
        }
        else if (sprite.body.velocity.x < 0){
            sprite.body.velocity.x += 3;
        }
        // if the action timer reaches reactionTime, set cooldown to false and stop the action timer
        if (sprite.timer.seconds > sprite.reactionTime) {
            sprite.cooldown = false;
            sprite.timer.stop();
        }
    }

    // if sprite is in range and is not attacking or on cooldown
    if (sprite.inRange && !sprite.chargingAttack && !sprite.attacking && !sprite.cooldown) {
        //console.log("In range");
        // stop animations and set x velocity to 0 to appear paused
        // start the action timer and set chargingAttack to true
        sprite.animations.stop();
        sprite.body.velocity.x = 0;
        sprite.timer.start();
        sprite.chargingAttack = true;
    }

    // if the sprite is in range and the sprite is charging an attack
    if (sprite.chargingAttack) {
        //console.log("Charging attack");
        // after reaction time, jump towards the player and stop the action timer.
        // set attacking to true and cooldown to true and restart the action timer for the cooldown
        if (sprite.timer.seconds > sprite.reactionTime) {
            sprite.body.velocity.y = -80;
            if (gameWorld.player.sprite.x > sprite.x) {
                sprite.body.velocity.x = +200;
            }
            else {
                sprite.body.velocity.x = -200;
            }
            sprite.timer.stop();
            sprite.chargingAttack = false;
            sprite.attacking = true;
            sprite.cooldown = true;
            sprite.timer.start();
        }
    }
}


