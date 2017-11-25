var nextFire = 0;
var fireRate = 150;
var facing = 'left';
var jumpTimer = 0;
var score = 0;
var scoreText;
var timer;
var bugCount = 0;

var playState = {
create: function() {

    this.keyboard = game.input.keyboard;
    timer = game.time.create(false);
    timer.loop(1000, createBug, this);
    timer.start();
    bugCount = 0;
    score = 0;

    game.load.spritesheet('eric', 'assets/eric.png', 32, 48);
    game.load.spritesheet('bug', 'assets/buggy1.png', 32, 32);
    game.load.image('bullet', 'assets/purple_ball.png');
    game.load.bitmapFont('arcadeFont', 'fonts/arcade.png', 'fonts/arcade.fnt');

    this.player = game.add.sprite(32, 32, 'eric');
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.time.desiredFps = 30;
    game.physics.arcade.gravity.y = 250;
    game.physics.enable(this.player, Phaser.Physics.ARCADE);
    
    //Set how much we want to bounce
    this.player.body.bounce.y = 0.5;
    //turn on collisions with edges of map
    this.player.body.collideWorldBounds = true;
    //set eric's size
    this.player.body.setSize(20, 32, 5, 16);

	//define eric's sprite animation for moving 
    this.player.animations.add('left', [0, 1, 2, 3], 10, true);
    this.player.animations.add('turn', [4], 20, true);
    this.player.animations.add('right', [5, 6, 7, 8], 10, true);

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

	//show the score!
	scoreText = game.add.bitmapText(game.world.centerX, 50, 'arcadeFont', 'Score: 0', 20);

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
},

update: function() {


	//player loses the game if they collide with a bug
	game.physics.arcade.collide(this.player, bugs, loseGame, null, this);


	//bug dies if you shoot it
	game.physics.arcade.collide(bullets, bugs, killSprites, null, this);

	//don't keep moving the player unless they are still holding the button down
	this.player.body.velocity.x = 0;

    if (game.input.activePointer.isDown) {
            fire(this.player);
    }

    if (restartButton.isDown) {
            game.state.start('boot');
    }

   if (cursors.left.isDown || altLeft.isDown)
    {
        this.player.body.velocity.x = -150;

        if (facing != 'left')
        {
            this.player.animations.play('left');
            facing = 'left';
        }
    }
	else if (cursors.right.isDown || altRight.isDown || altaltRight.isDown)
    {
        this.player.body.velocity.x = 150;

        if (facing != 'right')
        {
            this.player.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
        if (facing != 'idle')
        {
            this.player.animations.stop();

            if (facing == 'left')
            {
                this.player.frame = 0;
            }
            else
            {
                this.player.frame = 5;
            }
        	this.player.frame = 4;
            facing = 'idle';
        }
    }

	if ((jumpButton.isDown || altJump.isDown || cursors.up.isDown || altaltJump.isDown) && this.player.body.onFloor() && game.time.now > jumpTimer)
    {
        this.player.body.velocity.y = -250;
        jumpTimer = game.time.now + 750;
    } 


},

}

function loseGame() {

	game.state.start('lose');

}

function createBug(){

    for (i = 0; i < bugCount; i++) {
        var s = bugs.create(game.rnd.integerInRange(100,700), game.rnd.integerInRange(32, 200), 'bug');
        s.animations.add('spin', [0, 1, 2, 3]);
        s.play('spin', 20, true);
        s.body.velocity.set(game.rnd.integerInRange(-200, 200), game.rnd.integerInRange(-200, 200));
    }
    bugCount++;
}

function killSprites(bullet, bug) {

bullet.kill();
bug.kill();
score++;
scoreText.setText("Score: " + score);
}

function fire(player) {

    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;
        var bullet = bullets.getFirstDead();
        bullet.reset(player.x + 16 , player.y );
        bullet.body.allowGravity = false;
        game.physics.arcade.moveToPointer(bullet, 300);
    }

}

