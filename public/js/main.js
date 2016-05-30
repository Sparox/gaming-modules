/* globals $:false, requirejs:false */

'use strict';
$(function() {
  requirejs.config({
    baseUrl: 'js/',
    paths: {
      phaser: '/node_modules/phaser/phaser.min'
    },
    shim: {
      phaser: {
        exports: 'Phaser'
      }
    }
  });
  requirejs([
      'phaser',
      'phaser-components/utils/init',
      'phaser-components/utils/play',
      'chat',
    ],
    function(Phaser, Init, Play, Chat) {
      var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'game_div');

      game.state.add('Init', Init);
      game.state.add('Chat', Chat);
      game.state.add('Play', Play);

      game.state.start('Init');
    });
});