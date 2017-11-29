class GameWorld {
    constructor() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.background = game.add.sprite(0, 0, 'background');
        this.player = new Player();

        this.platforms = new CollidableGroup(1, 'platform', PlatformFactory);
        this.stars = new CollidableGroup(5, 'star', StarFactory);
        this.enemies = new CollidableGroup(10, 'enemy', EnemyFactory);
        console.log("GameWorld Instantiated.");
    }

    update() {
        this.player.HandleInput();
        this.enemies.updateGroup();
        this.stars.updateGroup();
    }

    cleanup() {
        this.platforms.destroyGroup();
        this.stars.destroyGroup();
        this.enemies.destroyGroup();
    }
}

function PlatformFactory(sprite) {
    sprite.entity = new Entity();
}

function StarFactory(sprite) {
    sprite.entity = new Entity();
    sprite.entity.addControl(FollowPlayer);
}

function EnemyFactory(sprite) {
    sprite.entity = new Entity();
    sprite.entity.addControl(FollowPlayer);
    sprite.entity.addControl(JumpAttackControl);
};