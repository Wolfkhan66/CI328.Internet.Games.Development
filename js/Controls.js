function followPlayerXControl(sprite) {
    if (sprite.following) {
        if (gameWorld.player.sprite.x > sprite.x) {
            // Stop sprite action timer and raise x velocity to move to the right
            sprite.body.velocity.x = sprite.speed;
            sprite.animations.play('move');
            sprite.facingLeft = false;
            sprite.facingRight = true;
            sprite.scale.setTo(1, 1);
            // if player is in range to the right
            if (gameWorld.player.sprite.x - sprite.range < sprite.x) {
                sprite.chargingAttack = true;
            } else { sprite.chargingAttack = false; }
        }
        else {
            // Stop sprite action timer and lower x velocity to move to the left
            sprite.body.velocity.x = -sprite.speed;
            sprite.animations.play('move');
            sprite.facingLeft = true;
            sprite.facingRight = false;
            sprite.scale.setTo(-1, 1);
            // if player is in range to the left
            if (gameWorld.player.sprite.x + sprite.range > sprite.x) {
                sprite.chargingAttack = true;
            }
            else { sprite.chargingAttack = false; }
        }
    }
}

function followPlayerYControl(sprite) {
    if (!sprite.inYRange) {
        if (gameWorld.player.sprite.y > sprite.y) {
            sprite.body.velocity.y = sprite.speed;
            if (gameWorld.player.sprite.y - 50 < sprite.y) {
                sprite.inYRange = true;
            } else { sprite.inYRange = false; }
        }
        else {
            sprite.body.velocity.y = -sprite.speed;
        }
    }
    if (sprite.inYRange) {
        sprite.body.velocity.y = 0;
        if (gameWorld.player.sprite.y < sprite.y) {
            if (gameWorld.player.sprite.y - 50 < sprite.y) {
                sprite.inYRange = false;
            }
        }
        else {
            if (gameWorld.player.sprite.y + 50 > sprite.y) {
                sprite.inYRange = false;
            }
        }
    }
}

function xGravityControl(sprite) {
    // apply resistance on the x axis to slow down entities when they are not using a movement control
    if (sprite.body.velocity.x > 0) {
        sprite.body.velocity.x -= 10;
    }
    else if (sprite.body.velocity.x < 0) {
        sprite.body.velocity.x += 10;
    }
}

function chargingAttackControl(sprite) {
    if (sprite.chargingAttack) {
        sprite.following = false;
        sprite.timer.start();
        if (sprite.timer.seconds > sprite.reactionTime) {
            sprite.chargingAttack = false;
            sprite.attacking = true;
            sprite.timer.stop();
        }
    }
}

function attackControl(sprite) {
    if (sprite.attacking) {
        sprite.animations.play('attack');
        sprite.animations.currentAnim.onComplete.add(function () { sprite.attacking = false; sprite.cooldown = true; sprite.soundPlaying = false; }, this);

        if (!sprite.soundPlaying) {
            sprite.soundPlaying = true;
            if (sprite.type == "mystic") {
                audio.playSound("Lazer");
            }
            else {
                audio.playSound("MeleeAttack");
            }
        }
    }
}

function rangedAttackControl(sprite) {
    if (sprite.attacking) {
        sprite.following = false;
        sprite.animations.play('attack');
        sprite.animations.currentAnim.onComplete.add(function () { sprite.cooldown = true; }, this);
        audio.playSound("Arrow");
        if (sprite.facingLeft) {
            gameWorld.projectiles.createArrow(sprite.x, sprite.y - 30, -350)
        }
        else {
            gameWorld.projectiles.createArrow(sprite.x, sprite.y - 30, 350)
        }
        sprite.attacking = false
    }
}

function jumpAttackControl(sprite) {
    if (sprite.attacking) {
        sprite.following = false;
        sprite.body.velocity.y = -80;
        if (!sprite.soundPlaying) {
            audio.playSound("MeleeAttack");
            sprite.soundPlaying = true;
        }
        if (gameWorld.player.sprite.x > sprite.x) {
            sprite.body.velocity.x = +200;
        }
        else {
            sprite.body.velocity.x = -200;
        }
        sprite.animations.play('attack');
        sprite.animations.currentAnim.onComplete.add(function () { sprite.attacking = false; sprite.cooldown = true; sprite.soundPlaying = false; }, this);
    }
}

function cooldownControl(sprite) {
    if (sprite.cooldown) {
        sprite.timer.start();
        sprite.animations.play('idle');
        if (sprite.timer.seconds > 2) {
            sprite.cooldown = false;
            sprite.following = true;
            sprite.timer.stop();
        }
    }
}

function takeDamageControl(sprite) {
    if (sprite.takingDamage) {
        sprite.timer.stop();
        sprite.cooldown = false;
        sprite.chargingAttack = false;
        sprite.attacking = false;
        sprite.following = false;
        sprite.animations.play('damaged');
        sprite.animations.currentAnim.onComplete.add(function () { sprite.takingDamage = false; sprite.following = true; }, this);
    }
}

function deathControl(sprite) {
    if (sprite.health <= 0) {
        game.score += (10 * game.difficultyLevel);
        ui.setText("Score", "Score: " + game.score);
        if (game.gameMode == "TimeAttack") {
            game.countDown = game.countDown + 2;
        }
        var potionSpawnChance = game.rnd.integerInRange(1, 10);
        if (potionSpawnChance == 10) {
            gameWorld.potions.createPotion(sprite.x, sprite.y, 300)
        }
        sprite.kill();
        game.enemiesAlive--;
    }
}

function timeOutControl(sprite) {
    if (!sprite.alive) {
        sprite.timer.start();
        sprite.alive = true;
    }
    if (sprite.timer.seconds > 10) {
        sprite.kill();
    }
}

function destroyOutOfBoundsControl(sprite) {
    if (sprite.x < 0 || sprite.x > 2400) {
        sprite.kill();
    }
    if (sprite.y > 800) {
        sprite.kill();
    }
}