/*globals define:false */
'use strict';
define([
  'phaser'
], function(Phaser) {

  function Init(game) {
    this.game = game;
  }

  Init.prototype = {
    constructor: Init,
    init: function() {},
    preload: function() {
      this.game.stage.backgroundColor = '#FFFFFF';

      this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
      this.loadAssets();

    },
    create: function() {
      //this.state.start('Player');
    },
    loadAssets: function() {
      this.game.load.image('player', 'img/point.png');
    },
    onLoadComplete: function() {
      this.game.state.start('Chat');
    }
  };

  return Init;
});