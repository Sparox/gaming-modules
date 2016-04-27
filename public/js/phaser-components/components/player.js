/*globals define:false, $:false */
  'use strict';

define([
    'phaser'
], function (Phaser) {

  function Player(game) {
    this.game = game;
  }

  Player.prototype = {
    constructor: Player,
    init: function () {
    },
    preload: function () {
      this.game.load.image('player', 'img/point.png');
    },  
    create: function() {
      this.sprite = this.game.add.sprite(window.innerWidth/2,window.innerHeight/2,'player');
      this.group = this.game.add.group();
      this.group.add(this.sprite);

    },
    update: function() {
      if (!$('.usernameInput').is(':focus') && !$('.inputMessage').is(':focus') ) {
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || this.game.input.keyboard.isDown(Phaser.Keyboard.Q)) {
          this.sprite.x--;
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
          this.sprite.x++;
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP) || this.game.input.keyboard.isDown(Phaser.Keyboard.Z)) {
          this.sprite.y--;
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN) || this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
          this.sprite.y++;
        }
      }
    }
  };

  return Player;
});