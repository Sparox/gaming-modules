/*globals define:false, $:false */
'use strict';

define([
  'phaser'
], function(Phaser) {

  function Player(game, x, y, isMainPlayer) {
    this.game = game;
    this.isMainPlayer = isMainPlayer;
    this.position = {
      x: x,
      y: y
    };
    this.setupSprite(this.position);
  }

  Player.prototype = {
    constructor: Player,
    init: function() {},
    preload: function() {},
    create: function() {

    },
    setupSprite: function(position) {
      this.sprite = this.game.add.sprite(position.x, position.y, 'player');
      this.game.add.existing(this.sprite);
      this.sprite.update = this.update;
      this.sprite.isMainPlayer = this.isMainPlayer;
      this.sprite.sprite = this.sprite;
      this.sprite.game = this.game;
      this.game.characters.add(this.sprite);
    },
    move: function(position) {
      this.sprite.x = position.x;
      this.sprite.y = position.y;
    },
    update: function() {
      if (!$('.usernameInput').is(':focus') && !$('.inputMessage').is(':focus') && this.isMainPlayer) {
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