
var game = new Phaser.Game('90', '90', Phaser.CANVAS, 'content', { preload: preload, create: create, update: update, render: render }, 1);


function preload() {

    game.load.spritesheet('eric', 'assets/eric.png', 32, 48);
    game.load.spritesheet('bug', 'assets/bluemetal_32x32x4.png', 32, 32);
    game.load.image('bullet', 'assets/purple_ball.png');
    game.load.bitmapFont('arcadeFont', 'fonts/arcade.png', 'fonts/arcade.fnt');


}

var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;
var bullets;
var fireRate = 150;
var nextFire = 0;
var score = 0;
var scoreText;
var text;
var text2;
var text3;

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
    bugs.setAll('outOfBoundsKill', true);
    
    //define a group for the player's bullets
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    bullets.createMultiple(50, 'bullet');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);

    //Add the text for the score

    scoreText = game.add.bitmapText(game.world.centerX, 50, 'arcadeFont', 'Score: 0', 20);

    //spawn new bugs every second, difficulty will ramp within createBug()
    game.time.events.repeat(Phaser.Timer.SECOND, 10000, createBug, this);

    //keybindings
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    //dvorak masterrace
    altLeft = game.input.keyboard.addKey(Phaser.Keyboard.A);
    altRight = game.input.keyboard.addKey(Phaser.Keyboard.E);
    altJump = game.input.keyboard.addKey(Phaser.Keyboard.COMMA);
    altaltRight = game.input.keyboard.addKey(Phaser.Keyboard.D);
    altaltJump = game.input.keyboard.addKey(Phaser.Keyboard.W);
    
    restartButton = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
}

function createBug(){
    
    for (i = 0; i < (this.game.time.totalElapsedSeconds()); i++) {
        var s = bugs.create(game.rnd.integerInRange(100,700), game.rnd.integerInRange(32, 200), 'bug');
        s.animations.add('spin', [0, 1, 2, 3]);
        s.play('spin', 20, true);
        s.body.velocity.set(game.rnd.integerInRange(-200, 200), game.rnd.integerInRange(-200, 200));
    }
}

function loseGame() {
    //var s = bugs.create(game.rnd.integerInRange(100,700), game.rnd.integerInRange(32, 200), 'bug');
    //s.play('spin', 20, true);
    //s.body.velocity.set(game.rnd.integerInRange(-200, 200), game.rnd.integerInRange(-200, 200));
    game.world.removeAll();
    text = game.add.bitmapText(600, 300, 'arcadeFont', 'Game Over', 64);
    text2 = game.add.bitmapText(600, 350, 'arcadeFont', "Score: " + score, 32);
//    text3 = game.add.bitmapText(600, 400, 'arcadeFont', "Press ENTER to play again!", 32);
    text.anchor.x = 0.5;
    text.anchor.y = 0.5;
    text2.anchor.x = 0.5;
    text2.anchor.y = 0.6;
  //  text3.anchor.x = 0.5;
   // text3.anchor.y = 0.7;

}

function killSprites(bullet, bug) {

bullet.kill();
bug.kill();
score++;
scoreText.setText("Score: " + score);
}


function update() {

    // game.physics.arcade.collide(player, layer);

    // you lose if you touch a bug
    game.physics.arcade.collide(player, bugs, loseGame, null, this);
//    game.physics.arcade.collide(bullets, bugs, killSprites, null, this);
    game.physics.arcade.collide(bullets, bugs, killSprites, null, this);

    player.body.velocity.x = 0;

    
    if (game.input.activePointer.isDown) {
        fire();
    }

    if (restartButton.isDown) {
        //game.state.start('Play');
    }

    if (cursors.left.isDown || altLeft.isDown)
    {
        player.body.velocity.x = -150;

        if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown || altRight.isDown || altaltRight.isDown)
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
    
    if ((jumpButton.isDown || altJump.isDown || cursors.up.isDown || altaltJump.isDown) && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -250;
        jumpTimer = game.time.now + 750;
    }

}

function fire() {

    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstDead();
        bullet.reset(player.x - 8, player.y - 8);
        bullet.body.allowGravity = false;
        game.physics.arcade.moveToPointer(bullet, 300);
    }

}

function render () {

    game.debug.text(game.time.suggestedFps, 32, 32);
    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);

}
