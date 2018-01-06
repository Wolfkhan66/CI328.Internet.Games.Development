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
    game.gameMode = "";
    game.cameraMovingLeft = false;
    game.cameraMovingRight = false;
    game.cameraLastX = 0;
    game.countDown = 60;
}

function preload() {
    console.log("Loading Assets...");
    // Load game assets \\
    game.load.image('SplashScreen', 'Assets/Screens/SplashScreen.png');
    game.load.image('HUD', 'Assets/HUD/HUD.png');
    game.load.image('LeftButton', 'Assets/HUD/LeftButton.png');
    game.load.image('RightButton', 'Assets/HUD/RightButton.png');
    game.load.image('AttackButton', 'Assets/HUD/AttackButton.png');
    game.load.image('JumpButton', 'Assets/HUD/JumpButton.png');
    game.load.image('HealthBar', 'Assets/HUD/HealthBarLine.png');
    game.load.image('healthPotion', 'Assets/Collectibles/health.png');
    game.load.image('arrow', 'Assets/Projectiles/arrow.png');
    game.load.atlasJSONHash('player', 'Assets/Player/player.png', 'Assets/Player/player.json');
    game.load.atlasJSONHash('archer', 'Assets/Enemies/archer.png', 'Assets/Enemies/archer.json');
    game.load.atlasJSONHash('critters', 'Assets/Enemies/critters.png', 'Assets/Enemies/critters.json');
    game.load.atlasJSONHash('mage', 'Assets/Enemies/mage.png', 'Assets/Enemies/mage.json');
    game.load.atlasJSONHash('mystic', 'Assets/Enemies/mystic.png', 'Assets/Enemies/mystic.json');
    game.load.atlasJSONHash('warrior', 'Assets/Enemies/warriors.png', 'Assets/Enemies/warriors.json');
    game.load.tilemap('map1', 'Assets/Maps/Map1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('map2', 'Assets/Maps/Map2.json', null, Phaser.Tilemap.TILED_JSON);

    // 3rd party assets \\
    //Jungle Asset Pack by Jesse M - https://jesse-m.itch.io/jungle-pack
    game.load.image('Paralex1', 'Assets/Backgrounds/Paralex1.png');
    game.load.image('Paralex2', 'Assets/Backgrounds/Paralex2.png');
    game.load.image('Paralex3', 'Assets/Backgrounds/Paralex3.png');
    game.load.image('Paralex4', 'Assets/Backgrounds/Paralex4.png');
    game.load.image('Paralex5', 'Assets/Backgrounds/Paralex5.png');
    game.load.image('jungle tileset', 'Assets/Maps/jungle tileset.png');

    // B-3 by BoxCat Games - http://freemusicarchive.org/music/BoxCat_Games/Nameless_the_Hackers_RPG_Soundtrack/BoxCat_Games_-_Nameless-_the_Hackers_RPG_Soundtrack_-_04_B-3
    game.load.audio('BackgroundMusic', 'Assets/Audio/BackgroundMusic.mp3');
    // Mt Fox Shop by BoxCat Games - http://freemusicarchive.org/music/BoxCat_Games/Nameless_the_Hackers_RPG_Soundtrack/BoxCat_Games_-_Nameless-_the_Hackers_RPG_Soundtrack_-_02_Mt_Fox_Shop
    game.load.audio('MainMenuMusic', 'Assets/Audio/MenuMusic.mp3');
    // Retro game heal sound by lulyc - https://freesound.org/people/lulyc/sounds/346116/
    game.load.audio('Heal', 'Assets/Audio/Heal.wav');
    // Arrow by EverHeat - https://freesound.org/people/EverHeat/sounds/205563/
    game.load.audio('Arrow', 'Assets/Audio/Arrow.wav');
    // Laser Wrath 4 by marcuslee - https://freesound.org/people/marcuslee/sounds/42106/
    game.load.audio('Laser', 'Assets/Audio/Laser.wav');
    // knife slash 3 by beerbelly38 - https://freesound.org/people/beerbelly38/sounds/362348/
    game.load.audio('MeleeAttack', 'Assets/Audio/MeleeAttack.wav');

    console.log("Assets Loaded.");
}


function create() {
    console.log("Creating World...");

    // create some game timers that are used to trigger certain events.
    game.actionTimer = game.time.create(false);
    game.enemySpawnTimer = game.time.create(false);

    // set the bounds of the game world to 1920x1080 so the world is larger than the canvas
    game.world.setBounds(0, 0, 2400, 600);

    //Instantiate The GameWorld and system classes
    gameWorld = new GameWorld();
    ui = new UI();
    audio = new Audio();

    // set the built in camera to follow the player sprite and set it to platformer mode
    game.camera.follow(gameWorld.player.sprite, Phaser.Camera.FOLLOW_PLATFORMER);

    // Load the first scene that starts the game, the main menu.
    sceneManager("Menu");
    console.log("Create complete.");
}

function update() {
    handleCollisions();
    gameWorld.update();
    gameManager();

    // Keep track of the cameras movements to allow paralex scrolling of the in game backgrounds
    if (game.cameraLastX > game.camera.x) {
        game.cameraMovingLeft = true;
        game.cameraMovingRight = false;
        game.cameraLastX = game.camera.x;
    } else if (game.cameraLastX < game.camera.x) {
        game.cameraMovingLeft = false;
        game.cameraMovingRight = true;
        game.cameraLastX = game.camera.x;
    }
    else if (game.cameraLastX == game.camera.x) {
        game.cameraMovingLeft = false;
        game.cameraMovingRight = false;
    }
}

function resetGame() {
    console.log("Reseting game variables");
    gameWorld.player.resetPlayer();
    game.score = 0;
    ui.setText("Score", "Score: " + game.score);
    ui.setText("WaveCounter", "Wave: 1");
    ui.setText("WaveHelperText", "Prepare Yourself!");
    game.currentWave = 0;
    game.enemiesAlive = 0;
    game.waveActive = false;
    game.gameMode = "";
    game.cameraMovingLeft = false;
    game.cameraMovingRight = false;
    game.cameraLastX = 0;
    game.countDown = 60;
    audio.stopAllSounds();
}

function handleCollisions() {
    // These collisions make the sprites collide with one another so they may not overlap
    game.physics.arcade.collide(gameWorld.player.sprite, gameWorld.layer);
    game.physics.arcade.collide(gameWorld.warriors.group, gameWorld.layer);
    game.physics.arcade.collide(gameWorld.critters.group, gameWorld.layer);
    game.physics.arcade.collide(gameWorld.mages.group, gameWorld.layer);
    game.physics.arcade.collide(gameWorld.archers.group, gameWorld.layer);
    game.physics.arcade.collide(gameWorld.mystics.group, gameWorld.layer);
    game.physics.arcade.collide(gameWorld.potions.group, gameWorld.layer);

    // These collisions detect if sprites have overlapped and passes those sprites to a method to further handle the outcome
    game.physics.arcade.overlap(gameWorld.player.sprite, gameWorld.warriors.group, enemyPlayerCollision);
    game.physics.arcade.overlap(gameWorld.player.sprite, gameWorld.critters.group, enemyPlayerCollision);
    game.physics.arcade.overlap(gameWorld.player.sprite, gameWorld.mages.group, enemyPlayerCollision);
    game.physics.arcade.overlap(gameWorld.player.sprite, gameWorld.archers.group, enemyPlayerCollision);
    game.physics.arcade.overlap(gameWorld.player.sprite, gameWorld.mystics.group, enemyPlayerCollision);
    game.physics.arcade.overlap(gameWorld.player.sprite, gameWorld.potions.group, potionCollision);
    game.physics.arcade.overlap(gameWorld.player.sprite, gameWorld.projectiles.group, projectileCollision);
}

function projectileCollision(player, projectile) {
    gameWorld.player.takeDamage(projectile.damage);
    projectile.kill();
}


function potionCollision(player, potion) {
    if (player.health < 100) {
        potion.kill();
        player.health += 10;
        if (player.health > 100) { player.health = 100; }
        ui.setPlayerHealth(player.health);
        audio.playSound("Heal");
    }
}

function enemyPlayerCollision(player, enemy) {
    if (enemy.attacking) {
        gameWorld.player.takeDamage(enemy.damage);
        if (enemy.facingLeft) {
            player.body.velocity.x = -100;
        }
        if (enemy.facingRight) {
            player.body.velocity.x = 100;
        }
    }

    if (player.attacking) {
        enemy.health -= player.damage;
        enemy.takingDamage = true;
        if (player.facingLeft) {
            enemy.body.velocity.x = -100;
        }
        if (player.facingRight) {
            enemy.body.velocity.x = 100;
        }
    }
}

// Handles the overall flow of the game by loading different scenes.
function sceneManager(scene) {
    ui.hideAll();
    gameWorld.player.sprite.visible = false;
    gameWorld.cleanup();
    switch (scene) {
        case "Menu": {
            resetGame();
            audio.playSound("MainMenuMusic");
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
        case "ModeSelect": {
            ui.showUI("ModeSelectUI");
            break;
        }
        case "GameOver": {
            ui.showUI("GameOverUI");
            break;
        }
        case "Map1": {
            audio.stopSound("MainMenuMusic");
            audio.playSound("BackgroundMusic");
            ui.showUI("InGameUI");
            gameWorld.player.sprite.visible = true;
            gameWorld.player.setPlayerPosition(1200, game.height / 2);
            gameWorld.createMap("map1");
            break;
        }
        case "Map2": {
            audio.stopSound("MainMenuMusic");
            audio.playSound("BackgroundMusic");
            ui.showUI("InGameUI");
            gameWorld.player.sprite.visible = true;
            gameWorld.player.setPlayerPosition(1200, game.height / 2);
            gameWorld.createMap("map2");
            break;
        }
    }
}

// Handles which function is called depending on the set game mode to affect gameplay.
function gameManager() {
    switch (game.gameMode) {
        case "Classic": {
            classic();
            break;
        }
        case "Survival": {
            survival();
            break;
        }
        case "TimeAttack": {
            ui.showUI("TimeAttackUI");
            timeAttack();
            break;
        }
    }
}

// Creates a delay at the beginning of each Wave or game mode and provides helper text to give visual feedback.
function waveCooldown() {
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

// Called when the classic game mode is activated. Spawns enemies as waves as long as difficulty is higher than 0. 
// If all enemies in the wave are killed then the wave is deactivated and the WaveCooldown() function is called to activate the next wave.
function classic() {
    if (game.enemiesAlive == 0 && !game.waveActive) {
        waveCooldown();
    }
    else if (game.waveActive) {
        ui.setText("EnemyCounter", "Enemies: " + (game.enemiesAlive));
        if (game.difficulty > 0) {
            if (game.enemiesAlive < 10) {
                gameWorld.createEnemy();
            }
        }
        else if (game.enemiesAlive == 0) {
            game.waveActive = false;
            ui.setText("WaveHelperText", "Prepare Yourself!");
        }
    }
}

// Called when the survival mode is activated. Spawns enemies repeatedly if there are less than 10 alive at once.
function survival() {
    ui.setText("EnemyCounter", "");
    if (game.enemiesAlive == 0 && !game.waveActive) {
        waveCooldown();
    }
    else if (game.waveActive) {
        if (game.enemiesAlive < 10) {
            gameWorld.createEnemy();
        }
    }
}

// Called when the time attack mode is actived. After the inital wave cooldown it starts a countdown timer and repeatedly spawns enemies if there are less than 10.
// If the countdown reaches 0 then the player.death() function is called.
function timeAttack() {
    ui.setText("EnemyCounter", "");
    if (game.enemiesAlive == 0 && !game.waveActive) {
        ui.setText("Timer", Math.floor(game.countDown));
        waveCooldown();
    }
    else if (game.waveActive) {
        game.countDown = game.countDown - (1 / 60);
        ui.setText("Timer", Math.floor(game.countDown));
        if (game.enemiesAlive < 10) {
            gameWorld.createEnemy();
        }
    }
    if (game.countDown <= 0) {
        gameWorld.player.death();
    }
}