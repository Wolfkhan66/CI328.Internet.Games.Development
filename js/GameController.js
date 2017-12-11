function main() {
    console.log("main();");

    const GAMEWIDTH = 800;
    const GAMEHEIGHT = 600;

    // Initialize the phaser game window, give it a width of GAMEWIDTH and a height of GAMEHEIGHT, set the rendering context to auto and attach the window to a div with the ID "GameWindow"
    game = new Phaser.Game(GAMEWIDTH, GAMEHEIGHT, Phaser.AUTO, 'GameWindow', {
        preload: preload,
        create: create,
        update: update
    });
    game.score = 0;
    game.currentWave = 0;
    game.enemiesAlive = 0;
    game.waveActive = false;
}

function preload() {
    console.log("Loading Assets...");
    // Load game assets
    game.load.spritesheet('enemy', 'Assets/Enemies/baddie.png', 32, 32);
    game.load.image('SplashScreen', 'Assets/Screens/SplashScreen.png');
    game.load.image('star', 'Assets/Collectibles/star.png');
    game.load.image('HUD', 'Assets/HUD/HUD.png');
    game.load.image('LeftButton', 'Assets/HUD/LeftButton.png');
    game.load.image('RightButton', 'Assets/HUD/RightButton.png');
    game.load.image('AttackButton', 'Assets/HUD/AttackButton.png');
    game.load.image('JumpButton', 'Assets/HUD/JumpButton.png');
    game.load.image('HealthBar', 'Assets/HUD/HealthBarLine.png');
    game.load.atlasJSONHash('player', 'Assets/Player/player.png', '../GameCore/Assets/Player/player.json');
    game.load.atlasJSONHash('enemies', 'Assets/Enemies/enemies.png', '../GameCore/Assets/Enemies/enemies.json');
    game.load.tilemap('map', 'Assets/Maps/Map1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('jungle tileset', 'Assets/Maps/jungle tileset.png');

    console.log("Assets Loaded.");
}

function create() {
    console.log("Creating World...");

    game.actionTimer = game.time.create(false);
    // set the bounds of the game world to 1920x1080 so the world is larger than the canvas
    game.world.setBounds(0, 0, 2400, 600);
    //Instantiate The GameWorld and system classes
    gameWorld = new GameWorld();
    ui = new UI();
    audio = new Audio();

    // set the built in camera to follow the player sprite and set it to platformer mode
    game.camera.follow(gameWorld.player.sprite, Phaser.Camera.FOLLOW_PLATFORMER);

    sceneManager("Menu");
    console.log("Create complete.");
}

function update() {
    handleCollisions();
    gameWorld.update();
    waveManager();
}

function resetGame() {
    gameWorld.player.resetPlayer();
    game.score = 0;
    ui.setText("Score", "Score: " + game.score);
    game.currentWave = 0;
    game.enemiesAlive = 0;
    game.waveActive = false;
}

function sceneManager(scene) {
    ui.hideAll();
    gameWorld.player.sprite.visible = false;
    gameWorld.cleanup();
    switch (scene) {
        case "Menu": {
            resetGame();
            ui.showUI("MainMenuUI");
            break;
        }
        case "MapSelect": {
            ui.showUI("MapSelectUI");
            break;
        }
        case "DifficultySelect": {
            ui.showUI("DifficultySelectUI");
            break;
        }
        case "GameOver": {
            resetGame();
            ui.showUI("GameOverUI");
            break;
        }
        case "Map1": {
            resetGame();
            ui.showUI("InGameUI");
            gameWorld.player.sprite.visible = true;
            gameWorld.player.setPlayerPosition(game.width / 2, game.height / 2);
            gameWorld.createMap1();
            game.currentMap = "Map1";
            break;
        }
        case "Map2": {
            resetGame();
            ui.showUI("InGameUI");
            gameWorld.player.sprite.visible = true;
            gameWorld.player.setPlayerPosition(game.width / 2, game.height / 2);
            game.currentMap = "Map2";
            break;
        }
    }
}

function waveManager() {
    if (game.enemiesAlive == 0 && !game.waveActive) {
        game.actionTimer.start();
        if (game.actionTimer.seconds > 7) {
            ui.setText("WaveHelperText", "Here They Come!");
        }
        if (game.actionTimer.seconds > 12) {
            game.currentWave++;
            game.difficulty = (game.currentWave * 5) * game.difficultyLevel;
            ui.setText("WaveCounter", "Wave: " + game.currentWave);
            ui.setText("WaveHelperText", " ");
            game.waveActive = true;
            game.actionTimer.stop();
        }
    }
    else if (game.waveActive) {
        ui.setText("EnemyCounter", "Enemies: " + (game.difficulty + game.enemiesAlive));
        if (game.difficulty > 0) {
            if (game.enemiesAlive < 6) {
                const x = game.rnd.integerInRange(20, 780);
                const y = game.rnd.integerInRange(20, 500);
                gameWorld.enemies.createEnemy(x, y, 1, 1);
                game.enemiesAlive++;
                game.difficulty--;
            }
        }
        else if (game.enemiesAlive == 0) {
            game.waveActive = false;
            ui.setText("WaveHelperText", "Prepare Yourself!");
        }
    }
}

function handleCollisions() {
    // These collisions make the sprites collide with one another so they may not overlap
    game.physics.arcade.collide(gameWorld.player.sprite, gameWorld.layer);
    game.physics.arcade.collide(gameWorld.enemies.group, gameWorld.layer);

    // These collisions detect if sprites have overlapped and passes those sprites to a method to further handle the outcome
    game.physics.arcade.overlap(gameWorld.player.sprite, gameWorld.stars.group, collectStar);
    game.physics.arcade.overlap(gameWorld.player.sprite, gameWorld.enemies.group, enemyPlayerCollision);
}

function collectStar(player, star) {
    star.kill();
    game.score += 10;
    ui.setText("Score", "Score: " + game.score);
}

function enemyPlayerCollision(player, enemy) {
    if (enemy.attacking) {
        gameWorld.player.takeDamage(enemy.damage);
        if (enemy.facingLeft) {
            player.body.velocity.x = -200;
        }
        if (enemy.facingRight) {
            player.body.velocity.x = 200;
        }
    }

    if (player.attacking) {
        enemy.health -= player.damage;
        enemy.takingDamage = true;
        if (player.facingLeft) {
            enemy.body.velocity.x = -200;
        }
        if (player.facingRight) {
            enemy.body.velocity.x = 200;
        }
    }
}