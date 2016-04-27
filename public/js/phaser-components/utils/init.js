/*globals define:false */
'use strict';
define([
    'phaser'
], function (Phaser) {

  function Init(game) {
    this.game = game;
  }

  Init.prototype = {
    constructor: Init,
    init: function () {
    },
    preload: function () {
      this.game.stage.backgroundColor = '#FFFFFF';
    },  
    create: function() {
      this.state.start('Player');
    }
  };

  return Init;
});