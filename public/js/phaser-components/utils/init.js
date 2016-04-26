define([
    'phaser'
], function (Phaser) {
  'use strict';

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

    }
  };

  return Init;
});