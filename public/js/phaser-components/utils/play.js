/*globals define:false */
'use strict';
define([
  'phaser',
  'phaser-components/components/player'
], function(Phaser, Player) {

  function Play(game) {
    var me = this;
    this.game = game;
    this.socket = io(':3001');
    this.socket.on('user joined', function(data) {
      if (data.username != me.game.username) {
        new Player(game, window.innerWidth / 2, window.innerHeight / 2, false, me.getUsernameColor(data.username), data.username);
      }
    });
    this.socket.on('user move', function(data) {
      if (data.player != me.game.username) {
        me.game.characters.children.filter(function(p){return p.username == data.player;})[0].position = data.position;
      }
    });
    this.socket.on('user left', function(data) {
        var character = me.game.characters.children.filter(function(p){return p.username == data.username;})[0];
        me.game.characters.children.splice(character,1);
    });
    this.socket.on('get users', function(data) {
      data.users.forEach(function(e) {
        if (e.username != me.game.username) {
          new Player(game, e.position.x, e.position.y, false, me.getUsernameColor(e.username), e.username);
        }
      });
    });
  }

  Play.prototype = {
    constructor: Play,
    preload: function() {},
    create: function() {
      this.setupSpriteGroups();
      this.addMainPlayer();
      this.COLORS = [
        '#e21400', '#91580f', '#f8a700', '#f78b00',
        '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
        '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
      ];
    },
    setupSpriteGroups: function() {
      this.game.characters = this.game.add.group();
    },

    addMainPlayer: function() {
      var startX = window.innerWidth / 2;
      var startY = window.innerHeight / 2;

      this.mainPlayer = new Player(this.game, startX, startY, true, this.game.usercolor, this.game.username);
      this.socket.emit('get users');
      //this.game.camera.follow(this.mainPlayer.sprite);
    },
    update: function() {

    },
    getUsernameColor: function(username) {
      // Compute hash code
      var hash = 7;
      for (var i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + (hash << 5) - hash;
      }
      // Calculate color
      var index = Math.abs(hash % this.COLORS.length);
      return this.COLORS[index];
    }
  };

  return Play;
});