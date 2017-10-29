
var game = new Phaser.Game('90', '90', Phaser.CANVAS, 'content', '', 1);

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('lose', loseState);

game.state.start('boot');
