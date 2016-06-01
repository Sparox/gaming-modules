/*globals define:false, $:false */
'use strict';

define([
  'phaser'
], function(Phaser) {

  function Player(game, x, y, isMainPlayer, color, username) {
    this.game = game;
    this.isMainPlayer = isMainPlayer;
    this.position = {
      x: x,
      y: y
    };
    this.setupSprite(this.position, color, username);
  }

  Player.prototype = {
    constructor: Player,
    init: function() {},
    preload: function() {},
    create: function() {

    },
    setupSprite: function(position, color, username) {
      this.sprite = this.game.add.sprite(position.x, position.y, 'player');
      this.game.add.existing(this.sprite);
      this.sprite.update = this.update;
      this.sprite.isMainPlayer = this.isMainPlayer;
      this.sprite.username = username;
      this.sprite.sprite = this.sprite;
      this.sprite.game = this.game;
      this.game.characters.add(this.sprite);
      this.sprite.tint = color.replace('#', '0x');
    },
    move: function(position) {
      this.sprite.x = position.x;
      this.sprite.y = position.y;
    },
    update: function() {
      if (!$('.usernameInput').is(':focus') && !$('.inputMessage').is(':focus') && this.isMainPlayer) {
        var hasMoved = false;
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || this.game.input.keyboard.isDown(Phaser.Keyboard.Q)) {
          this.sprite.x--;
          hasMoved = true;
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
          this.sprite.x++;
          hasMoved = true;
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP) || this.game.input.keyboard.isDown(Phaser.Keyboard.Z)) {
          this.sprite.y--;
          hasMoved = true;
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN) || this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
          this.sprite.y++;
          hasMoved = true;
        }
        if (hasMoved) {
          this.game.socket.emit('user move', { position: this.position, player: this.game.username });
        }
      }
    }
  };

  return Player;
});