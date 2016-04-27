/*globals $:false, io:false */

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
    'phaser-components/components/player', 
    'chat'], 
    function (Phaser, Init, Player, chat) {
    var game = new Phaser.Game(window.innerWidth,window.innerHeight, Phaser.AUTO, 'game_div');
    
    game.state.add('Init', Init, true);
    game.state.add('Player', Player, false);
  });
});