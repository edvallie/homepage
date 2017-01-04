
var game = new Phaser.Game('90', '90', Phaser.CANVAS, 'content', { preload: preload, create: create, update: update, render: render }, 1);

function preload() {

    game.load.spritesheet('eric', 'assets/eric.png', 32, 48);
    game.load.spritesheet('bug', 'assets/bluemetal_32x32x4.png', 32, 32);
    game.load.bitmapFont('desyrel', 'bitmapFonts/desyrel.png', 'bitmapFonts/desyrel.xml');
}

var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;


function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.time.desiredFps = 30;
    game.physics.arcade.gravity.y = 250;
    player = game.add.sprite(32, 32, 'eric');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    //Set how much we want to bounce
    player.body.bounce.y = 0.5;
    //turn on collisions with edges of map
    player.body.collideWorldBounds = true;
    //set eric's size
    player.body.setSize(20, 32, 5, 16);

    //define eric's sprite animation for moving
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    //define a physics group for the bugs we'll be killing
    bugs = game.add.physicsGroup(Phaser.Physics.ARCADE);
    bugs.setAll('body.collideWorldBounds', false);
    bugs.setAll('body.bounce.x', 1);
    bugs.setAll('body.bounce.y', 0);
    
    //player.body.onCollide = new Phaser.Signal();
    //player.body.onCollide.add(loseGame, this);
    
    //spawn new bugs every second, difficulty will ramp within createBug()
    game.time.events.repeat(Phaser.Timer.SECOND, 10000, createBug, this);

    //keybindings
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    //dvorak masterrace
    altLeft = game.input.keyboard.addKey(Phaser.Keyboard.A);
    altRight = game.input.keyboard.addKey(Phaser.Keyboard.E);
    altJump = game.input.keyboard.addKey(Phaser.Keyboard.COMMA);
}

function createBug(){
    
    var s = bugs.create(game.rnd.integerInRange(100,700), game.rnd.integerInRange(32, 200), 'bug');
    s.play('spin', 20, true);
    s.body.velocity.set(game.rnd.integerInRange(-200, 200), game.rnd.integerInRange(-200, 200));
}

function loseGame() {
    //var s = bugs.create(game.rnd.integerInRange(100,700), game.rnd.integerInRange(32, 200), 'bug');
    //s.play('spin', 20, true);
    //s.body.velocity.set(game.rnd.integerInRange(-200, 200), game.rnd.integerInRange(-200, 200));
    game.world.removeAll();
    var text = game.add.bitmapText(400, 300, 'desyrel', 'Game Over', 64);
    text.anchor.x = 0.5;
    text.anchor.y = 0.5;

}


function update() {

    // game.physics.arcade.collide(player, layer);

    game.physics.arcade.collide(player, bugs, loseGame, null, this);

    player.body.velocity.x = 0;

    if (cursors.left.isDown || altLeft.isDown)
    {
        player.body.velocity.x = -150;

        if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown || altRight.isDown)
    {
        player.body.velocity.x = 150;

        if (facing != 'right')
        {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
        if (facing != 'idle')
        {
            player.animations.stop();

            if (facing == 'left')
            {
                player.frame = 0;
            }
            else
            {
                player.frame = 5;
            }
	    player.frame = 4;
            facing = 'idle';
        }
    }
    
    if ((jumpButton.isDown || altJump.isDown || cursors.up.isDown) && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -250;
        jumpTimer = game.time.now + 750;
    }

}

function render () {

    game.debug.text(game.time.suggestedFps, 32, 32);

    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);

}
