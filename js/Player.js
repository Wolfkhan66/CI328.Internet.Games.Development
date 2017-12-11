class Player {

    constructor() {
        console.log("Player Instantiated.")
        const playerSprite = game.add.sprite(0, 0, 'player', 'idle.png');
        game.physics.arcade.enable(playerSprite);
        playerSprite.anchor.setTo(0.5, 0.5);
        playerSprite.body.gravity.y = 500;
        playerSprite.body.collideWorldBounds = true;
        playerSprite.animations.add('idle', ['idle.png', 'idle.png'], 5, true);
        playerSprite.animations.add('jump', ['jump.png', 'idle.png'], 1.5, false);
        playerSprite.animations.add('run', ['running1.png', 'running2.png', 'running3.png', 'running4.png'], 7, true);
        playerSprite.animations.add('attack1', ['attack1.png', 'attack2.png'], 6, false);
        playerSprite.animations.add('attack2', ['attack3.png', 'attack4.png'], 6, false);
        playerSprite.animations.add('attack3', ['attack5.png', 'attack6.png', 'attack7.png', 'attack8.png'], 7, false);
        playerSprite.animations.add('damaged', ['damaged.png'], 5, false);
        playerSprite.health = 100;
        playerSprite.damage = 2;
        playerSprite.takingDamage = false;
        playerSprite.attacking = false;
        playerSprite.attackCounter = 0;
        playerSprite.jumping = false;
        playerSprite.facingLeft = false;
        playerSprite.facingRight = true;
        playerSprite.attackCounterTimer = game.time.create(false);
        playerSprite.visible = false;
        playerSprite.leftButton = false;
        playerSprite.rightButton = false;

        this.sprite = playerSprite;

        var attackKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR); attackKey.onDown.add(this.attack, this);
        var jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.UP); jumpKey.onDown.add(this.jump, this);
    }

    setPlayerPosition(x, y) {
        this.sprite.x = x;
        this.sprite.y = y;
    }

    resetPlayer() {
        this.sprite.visible = false;
        this.sprite.health = 100;
        ui.setPlayerHealth(this.sprite.health);
    }

    update() {
        var cursors = game.input.keyboard.createCursorKeys();

        this.sprite.body.velocity.x -= this.sprite.body.velocity.x / 15;
        if (this.sprite.facingLeft) {
            this.sprite.scale.setTo(-1, 1);
        }
        else if (this.sprite.facingRight) {
            this.sprite.scale.setTo(1, 1);
        }

        if (this.sprite.attackCounterTimer.seconds > 1) {
            this.sprite.attackCounterTimer.stop();
            this.sprite.attackCounter = 0;
        }

        if (!this.sprite.attacking && !this.sprite.takingDamage) {
            if (this.sprite.leftButton) {
                this.moveLeft();
            }
            else if (this.sprite.rightButton) {
                this.moveRight();
            }
            else {
                if (cursors.left.isDown) {
                    this.moveLeft();
                }
                else if (cursors.right.isDown) {
                    this.moveRight();
                }
                else {
                    if (!this.sprite.jumping) {
                        this.idle();
                    }
                }
            }
        }
    }

    death() {
        sceneManager("GameOver");
    }

    takeDamage(damage) {
        if (!this.sprite.takingDamage) {
            this.sprite.takingDamage = true;
            this.sprite.jumping = false;
            this.sprite.attacking = false;
            this.sprite.health -= damage
            ui.setPlayerHealth(this.sprite.health);
            this.sprite.animations.play('damaged');
            this.sprite.animations.currentAnim.onComplete.add(function () { this.sprite.takingDamage = false; this.sprite.attacking = false; }, this);
            if (this.sprite.health <= 0) {
                this.death();
            }
        }
    }

    moveLeft() {
        this.sprite.body.velocity.x = -150;
        if (!this.sprite.jumping) {
            this.sprite.animations.play('run');
        }
        this.sprite.scale.setTo(-1, 1);
        this.sprite.facingRight = false;
        this.sprite.facingLeft = true;
    }

    moveRight() {
        console.log("Moving Right -->")
        this.sprite.body.velocity.x = 150;
        if (!this.sprite.jumping) {
            this.sprite.animations.play('run');
        }
        this.sprite.facingRight = true;
        this.sprite.facingLeft = false;
    }

    attack() {
        if (!this.sprite.attacking && !this.sprite.takingDamage) {
            this.sprite.attackCounterTimer.stop();
            this.sprite.jumping = false;
            this.sprite.attacking = true;
            this.sprite.body.velocity.y = -50;

            if (this.sprite.facingLeft) {
                this.sprite.body.velocity.x = -200;
            }
            else if (this.sprite.facingRight) {
                this.sprite.body.velocity.x = 200;
            }

            switch (this.sprite.attackCounter) {
                case 0: {
                    this.sprite.animations.play('attack1');
                    break;
                }
                case 1: {
                    this.sprite.animations.play('attack2');
                    break;
                }
                case 2: {
                    this.sprite.animations.play('attack3');
                    break;
                }
            }

            this.sprite.attackCounter++;
            if (this.sprite.attackCounter == 3) {
                this.sprite.attackCounter = 0;
            }
            this.sprite.animations.currentAnim.onComplete.add(function (sprite) { sprite.attacking = false; sprite.attackCounterTimer.start(); }, this);
        }
    }

    jump() {
        if (!this.sprite.jumping && !this.sprite.attacking && !this.sprite.takingDamage) {
            this.sprite.jumping = true;
            this.sprite.animations.play('jump');
            this.sprite.animations.currentAnim.onComplete.add(function () { this.sprite.jumping = false; }, this);
            this.sprite.body.velocity.y = -400;
        }
    }

    idle() {
        this.sprite.animations.play('idle');
    }
}