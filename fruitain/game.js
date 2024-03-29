
let config = {
    type: Phaser.AUTO,
    width: 768,
    height: 608,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);

let walls;
let sprites = [];
let score = 0;
let scoreText;

function preload ()
{
    this.load.image('wall', 'assets/wall.png');
    this.load.image('wood', 'assets/wood.gif');

    this.load.image('strawberry', 'assets/strawberry.png');
    this.load.image('apple', 'assets/apple.png');
    this.load.image('cherry', 'assets/cherry.png');
    this.load.image('banana', 'assets/banana.png');
    this.load.image('bomb', 'assets/bomb.png');

    //  Firefox doesn't support mp3 files, so use ogg
    this.load.audio('music', ['assets/audio/music.mp3', 'assets/audio/music.ogg']);
    this.load.audio('click', ['assets/audio/click.mp3', 'assets/audio/click.ogg']);
    this.load.audio('explosion', ['assets/audio/explosion.mp3', 'assets/audio/explosion.ogg']);
}

function create ()
{
    this.add.tileSprite(0, 0, config.width * 2, config.height * 2, "wood");

    this.ambience = this.sound.add('music');
    let ambienceConfig = {
        volume: 5,
        loop: true,
        delay: 0
    }
    this.ambience.play(ambienceConfig);

    this.click = this.sound.add('click');
    this.explosion = this.sound.add('explosion');


    walls = this.physics.add.staticGroup({
        key: 'wall',
        frameQuantity: 82
    });

    Phaser.Actions.PlaceOnRectangle(walls.getChildren(), new Phaser.Geom.Rectangle(16, 16, config.width - 32, config.height - 32));
    walls.refresh();

    scoreText = this.add.text(24, config.height - 23, 'score: 0', { 
        fontSize: '14px', 
        fill: '#fff', 
        backgroundColor: '#000'
    });

    function createFruit(game, fruit, points, velocity) {
        let sprite = game.physics.add.image(Math.random()*(config.width - 96) + 48, Math.random()*(config.height - 96) + 48, fruit).setInteractive();
        sprite.setBounce(1, 1).setCollideWorldBounds(true);
        game.physics.velocityFromRotation(Math.random()*360, velocity, sprite.body.velocity);
        sprite.on('pointerdown', function (pointer) {
            score += points;
            scoreText.setText('Score: ' + score);
            this.x = Math.random()*(config.width - 96) + 48;
            this.y = Math.random()*(config.height - 96) + 48;
            game.physics.velocityFromRotation(Math.random()*360, velocity, sprite.body.velocity);
            game.click.play();
        });
        sprites.push(sprite);
    }

    createFruit(this, 'strawberry', 30, 240);
    createFruit(this, 'strawberry', 30, 240);
    createFruit(this, 'apple', 50, 320);
    createFruit(this, 'apple', 50, 320);
    createFruit(this, 'banana', 100, 480);
    createFruit(this, 'banana', 100, 480);
    createFruit(this, 'cherry', 100, 640);
    createFruit(this, 'cherry', 100, 640);
    createFruit(this, 'cherry', 100, 640);


    this.time.addEvent({ delay: 2000, callback: function() {
        let bomb = this.add.sprite(Math.random()*(config.width - 96) + 48, Math.random()*(config.height - 96) + 48, 'bomb').setInteractive();
        bomb.once('pointerup', function() { 
            this.explosion.play();
            this.scene.pause();
        }, this);
    }, callbackScope: this, loop: true });
}

function update ()
{
    sprites.forEach(e => {
        this.physics.world.collide(e, walls);
    });
}