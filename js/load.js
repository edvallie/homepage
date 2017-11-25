var loadState = {

    preload: function() {
        
            var loadingLabel = game.add.text(80, 150, 'loading...', {font: '30px Courier', fill: '#ffffff'});
            
            game.load.spritesheet('eric', 'assets/eric.png', 32, 48);
            game.load.spritesheet('bug', 'assets/buggy1.png', 32, 32);
            game.load.image('bullet', 'assets/purple_ball.png');
            game.load.bitmapFont('arcadeFont', 'fonts/arcade.png', 'fonts/arcade.fnt');

    },

    create: function() {
        game.state.start('menu');
    }

};
