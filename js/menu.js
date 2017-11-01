var menuState = {

    preload: function() {

        game.load.spritesheet('wasd', 'assets/wasd_120.png', 120, 120);
        game.load.spritesheet('mouse', 'assets/mouse.png', 102, 102);
    },

    create: function() {
    
    text = game.add.bitmapText(600, 300, 'arcadeFont', 'Press W to start', 64);
    text.anchor.x = 0.5;
    text.anchor.y = 0.5;
    wasd = game.add.sprite(550, 350, 'wasd');
    wasd.anchor.x = 0.45;
    mouse = game.add.sprite(wasd.x + 100, wasd.y +9, 'mouse');
    var wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    var comma = game.input.keyboard.addKey(Phaser.Keyboard.COMMA);
    //dvorak!

    wKey.onDown.addOnce(this.start, this);
    comma.onDown.addOnce(this.start, this);

    },

    start: function () {
        game.state.start('play');
    },

};
