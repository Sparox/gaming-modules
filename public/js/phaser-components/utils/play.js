/*globals define:false */
'use strict';
define([
  'phaser',
  'phaser-components/components/player'
], function(Phaser, Player) {

  function Play(game) {
    this.game = game;
  }

  Play.prototype = {
    constructor: Play,
    preload: function() {},
    create: function() {
      this.setupSpriteGroups();
      this.addMainPlayer();
    },
    setupSpriteGroups: function() {
      this.game.characters = this.game.add.group();
    },

    addMainPlayer: function() {
      var startX = window.innerWidth / 2;
      var startY = window.innerHeight / 2;

      this.mainPlayer = new Player(this.game, startX, startY, true);
      //this.game.camera.follow(this.mainPlayer.sprite);

      this.mainPlayer.nickname = this.game.username;
    },
    update: function() {
      
    }
  };

  return Play;
});