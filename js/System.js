class Audio {
    constructor() {
        console.log("Building Audio")
        this.sounds = [];

        this.createSound("BackgroundMusic", 0.1, true);
        this.createSound("MainMenuMusic", 1, true);
        this.createSound("Heal", 1, false);
        this.createSound("Arrow", 1, false);
        this.createSound("Laser", 1, false);
        this.createSound("MeleeAttack", 1, false);
    }

    createSound(name, volume, loop) {
        this.sounds.push({ Name: name, SoundEffect: game.add.audio(name, volume, loop) });
    }

    playSound(name) {
        this.sounds.forEach(function (object) { if (object.Name == name) { object.SoundEffect.play(); } });
    }

    stopSound(name) {
        this.sounds.forEach(function (object) { if (object.Name == name) { object.SoundEffect.stop(); } });
    }

    stopAllSounds() {
        this.sounds.forEach(object => object.SoundEffect.stop());
    }
}

class UI {
    constructor() {
        console.log("Constructing UI Elements")
        this.textObjects = [];
        this.sprites = [];

        // InGameUI \\
        this.createSprite('HealthBar', 'InGameUI', 24, 10, 100, 11, 'HealthBar', null, null);
        this.createSprite('HUD', 'InGameUI', 0, 0, 800, 600, 'HUD', null, null);
        this.createSprite('LeftButton', 'InGameUI', 10, 540, 50, 50, 'LeftButton', function () { gameWorld.player.sprite.leftButton = true; }, function () { gameWorld.player.sprite.leftButton = false; });
        this.createSprite('RightButton', 'InGameUI', 60, 540, 50, 50, 'RightButton', function () { gameWorld.player.sprite.rightButton = true; }, function () { gameWorld.player.sprite.rightButton = false; });
        this.createSprite('JumpButton', 'InGameUI', 740, 490, 50, 50, 'JumpButton', function () { gameWorld.player.jump() }, null);
        this.createSprite('AttackButton', 'InGameUI', 740, 540, 50, 50, 'AttackButton', function () { gameWorld.player.attack() }, null);
        this.createText('WaveCounter', 'InGameUI', 335, 8, 'Wave: 0', 35, null);
        this.createText('EnemyCounter', 'InGameUI', 355, 50, 'Enemies: ', 20, null);
        this.createText('WaveHelperText', 'InGameUI', 270, (game.height / 2) - 100, 'Prepare Yourself!', 40, null);
        this.createText('Score', 'InGameUI', 660, 2, 'Score: 0', 20, null);

        // TimeAttackUI
        this.createText('Timer', 'TimeAttackUI', 380, 50, '90', 40, null);

        // MainMenuUI \\
        this.createSprite('SplashScreen', 'MainMenuUI', 0, 0, 800, 600, 'SplashScreen', null, null);
        this.createText('NewGameText', 'MainMenuUI', (game.width / 2) - 34, (game.height / 2), 'New Game', 25, function () { sceneManager("DifficultySelect") });
        this.createText('SplashText', 'MainMenuUI', (game.width / 5), (game.height / 6), 'InExile', 150, function () { sceneManager("DifficultySelect") });

        // DifficultySelectUI \\
        this.createSprite('SplashScreen', 'DifficultySelectUI', 0, 0, 800, 600, 'SplashScreen', null, null);
        this.createText('Easy', 'DifficultySelectUI', (game.width / 2) - 34, (game.height / 2), 'Easy', 25, function () { game.difficultyLevel = 1; sceneManager("ModeSelect"); });
        this.createText('Normal', 'DifficultySelectUI', (game.width / 2) - 34, (game.height / 2) + 30, 'Normal', 25, function () { game.difficultyLevel = 2; sceneManager("ModeSelect"); });
        this.createText('Hard', 'DifficultySelectUI', (game.width / 2) - 34, (game.height / 2) + 60, 'Hard', 25, function () { game.difficultyLevel = 3; sceneManager("ModeSelect"); });
        this.createText('BackFromDifficultySelect', 'DifficultySelectUI', (game.width / 2) - 34, (game.height / 2) + 120, 'Back', 25, function () { sceneManager("Menu"); });

        // ModeSelectUI \\
        this.createSprite('SplashScreen', 'ModeSelectUI', 0, 0, 800, 600, 'SplashScreen', null, null);
        this.createText('Classic', 'ModeSelectUI', (game.width / 2) - 34, (game.height / 2), 'Classic', 25, function () { game.gameMode = "Classic"; sceneManager("MapSelect"); });
        this.createText('TimeAttack', 'ModeSelectUI', (game.width / 2) - 34, (game.height / 2) + 30, 'Time Attack', 25, function () { game.gameMode = "TimeAttack"; sceneManager("MapSelect"); });
        this.createText('Survival', 'ModeSelectUI', (game.width / 2) - 34, (game.height / 2) + 60, 'Survival', 25, function () { game.gameMode = "Survival"; sceneManager("MapSelect"); });
        this.createText('BackFromModeSelect', 'ModeSelectUI', (game.width / 2) - 34, (game.height / 2) + 120, 'Back', 25, function () { sceneManager("DifficultySelect"); });

        // MapSelectUI \\
        this.createSprite('SplashScreen', 'MapSelectUI', 0, 0, 800, 600, 'SplashScreen', null, null);
        this.createText('Map1', 'MapSelectUI', (game.width / 2) - 34, (game.height / 2), 'Map 1', 25, function () { sceneManager("Map1") });
        this.createText('Map2', 'MapSelectUI', (game.width / 2) - 34, (game.height / 2) + 30, 'Map 2', 25, function () { sceneManager("Map2") });
        this.createText('BackFromMapSelect', 'MapSelectUI', (game.width / 2) - 34, (game.height / 2) + 90, 'Back', 25, function () { sceneManager("ModeSelect") });

        // GameOverUI \\
        this.createSprite('SplashScreen', 'GameOverUI', 0, 0, 800, 600, 'SplashScreen', null, null);
        this.createText('GameOver', 'GameOverUI', (game.width / 5), (game.height / 4), 'Game Over', 100, null);
        this.createText('YourScore', 'GameOverUI', (game.width / 2) - 64, (game.height / 2), 'Your Score: ', 25, null);
        this.createText('Continue?', 'GameOverUI', (game.width / 2) - 44, (game.height / 2) + 40, 'Continue?', 25, function () { sceneManager("Menu") });
    }

    createText(name, UI, x, y, string, size, event) {
        var textObject = game.add.text(0, 0, string, {
            font: size + 'px Old English Text MT',
            fill: '#fff'
        });
        if (event != null) {
            textObject.inputEnabled = true;
            textObject.events.onInputDown.add(event, this);
        }
        textObject.fixedToCamera = true;
        textObject.cameraOffset.setTo(x, y);
        this.textObjects.push({ Name: name, UI: UI, Text: textObject });
    }

    createSprite(name, UI, x, y, width, height, image, eventDown, eventUp) {
        var sprite = game.add.sprite(0, 0, image);
        sprite.width = width;
        sprite.height = height;
        if (eventDown != null) {
            sprite.inputEnabled = true;
            sprite.events.onInputDown.add(eventDown, this);
        }
        if (eventUp != null) {
            sprite.inputEnabled = true;
            sprite.events.onInputUp.add(eventUp, this);
        }
        sprite.fixedToCamera = true;
        sprite.cameraOffset.setTo(x, y);
        this.sprites.push({ Name: name, UI: UI, Sprite: sprite });
    }

    showUI(UIType) {
        this.textObjects.forEach(function (object) { if (object.UI == UIType) { object.Text.visible = true; } });
        this.sprites.forEach(function (object) { if (object.UI == UIType) { object.Sprite.visible = true; } });
    }

    hideAll() {
        this.sprites.forEach(object => object.Sprite.visible = false);
        this.textObjects.forEach(object => object.Text.visible = false);
    }

    setText(name, value) {
        this.textObjects.forEach(function (object) { if (object.Name == name) { object.Text.text = value; } });
    }

    setTextPosition(name, x, y) {
        this.textObjects.forEach(function (object) { if (object.Name == name) { object.Text.cameraOffset.setTo(x, y); } });
    }

    setPlayerHealth(health) {
        this.sprites.forEach(function (object) { if (object.Name == "HealthBar") { object.Sprite.width = health; } });
    }

}