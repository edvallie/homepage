var loseState = {

    create: function() {


    var wkey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

    wkey.onDown.addOnce(this.restart, this);

    game.world.removeAll();
    text = game.add.bitmapText(600, 300, 'arcadeFont', 'Game Over', 64);
    text2 = game.add.bitmapText(600, 350, 'arcadeFont', "Score: " + score, 32);
    text3 = game.add.bitmapText(600, 375, 'arcadeFont', "Press ENTER to restart", 32);
    text.anchor.x = 0.5;
    text.anchor.y = 0.5;
    text2.anchor.x = 0.5;
    text2.anchor.y = 0.6;
    text3.anchor.x = 0.5;
    text3.anchor.y = 0.65;


    },

    restart: function () {
        game.state.start('boot');
    },
}
