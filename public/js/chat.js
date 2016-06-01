/*globals $:false, io:false, define:false */
'use strict';
define([
  'phaser'
], function(Phaser) {

  function Chat(game) {
    this.game = game;
  }

  Chat.prototype = {
    constructor: Chat,
    create: function() {
      var me = this;
      this.FADE_TIME = 150; // ms
      this.TYPING_TIMER_LENGTH = 400; // ms
      this.COLORS = [
        '#e21400', '#91580f', '#f8a700', '#f78b00',
        '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
        '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
      ];

      // Initialize variables
      this.$window = $(window);
      this.$usernameInput = $('.usernameInput'); // Input for username
      this.$messages = $('.messages'); // Messages area
      this.$inputMessage = $('.inputMessage'); // Input message input box

      this.$loginui = $('.login.ui'); // The login ui
      this.$chatui = $('.chat.ui'); // The chatroom ui
      this.$userui = $('.user.ui');

      // Prompt for setting a username
      this.username;
      this.connected = false;
      this.typing = false;
      this.lastTypingTime;
      //this.$currentInput = $usernameInput.focus();

      this.socket = io(':3001');

      this.game.socket = this.socket;
      // Keyboard events

      this.$window.keydown(function(event) {
        // Auto-focus the current input when a key is typed
        // if (!(event.ctrlKey || event.metaKey || event.altKey)) {
        //   $currentInput.focus();
        // }
        // When the client hits ENTER on their keyboard
        if (event.which === 13) {
          if (me.username) {
            me.sendMessage();
            me.socket.emit('stop typing');
            me.typing = false;
          } else {
            me.setUsername();
          }
        }
      });

      this.$inputMessage.on('input', function() {
        me.updateTyping();
      });

      // Click events

      // Focus input when clicking anywhere on login ui
      // $loginui.click(function() {
      //   $currentInput.focus();
      // });

      // // Focus input when clicking on the message input's border
      // $inputMessage.click(function() {
      //   $inputMessage.focus();
      // });

      // Socket events

      // Whenever the server emits 'login', log the login message
      this.socket.on('login', function(data) {
        me.connected = true;
        // Display the welcome message
        var message = "Welcome to Gaming modules Chat";
        me.log(message, {
          prepend: true
        });
        me.addParticipantsMessage(data);
      });

      // Whenever the server emits 'new message', update the chat body
      this.socket.on('new message', function(data) {
        me.addChatMessage(data);
      });

      // Whenever the server emits 'user joined', log it in the chat body
      this.socket.on('user joined', function(data) {
        me.log(data.username + ' joined');
        me.addParticipantsMessage(data);
      });

      // Whenever the server emits 'user left', log it in the chat body
      this.socket.on('user left', function(data) {
        me.log(data.username + ' left');
        me.addParticipantsMessage(data);
        me.removeChatTyping(data);
      });

      // Whenever the server emits 'typing', show the typing message
      this.socket.on('typing', function(data) {
        me.addChatTyping(data);
      });

      // Whenever the server emits 'stop typing', kill the typing message
      this.socket.on('stop typing', function(data) {
        me.removeChatTyping(data);
      });


    },
    addParticipantsMessage: function(data) {
      var message = '';
      if (data.numUsers === 1) {
        message += "there's 1 participant";
      } else {
        message += "there are " + data.numUsers + " participants";
      }
      this.log(message);
    },

    // Sets the client's username
    setUsername: function() {
      this.username = this.cleanInput(this.$usernameInput.val().trim());

      // If the username is valid
      if (this.username) {
        this.$loginui.fadeOut();
        this.$chatui.show();
        this.$loginui.off('click');
        //$currentInput = $inputMessage.focus();
        $('#userlogin').text(this.username);
        this.$userui.show();
        // Tell the server your username
        this.socket.emit('add user', this.username);
        this.game.username = this.username;
        this.game.usercolor = this.getUsernameColor(this.username);
        this.game.state.start('Play');
      }
    },

    // Sends a chat message
    sendMessage: function() {
      var message = this.$inputMessage.val();
      // Prevent markup from being injected into the message
      message = this.cleanInput(message);
      // if there is a non-empty message and a socket connection
      if (message && this.connected) {
        this.$inputMessage.val('');
        this.addChatMessage({
          username: this.username,
          message: message
        });
        // tell server to execute 'new message' and send along one parameter
        this.socket.emit('new message', message);
      }
    },

    // Log a message
    log: function(message, options) {
      var $el = $('<li>').addClass('log').text(message);
      this.addMessageElement($el, options);
    },

    // Adds the visual chat message to the message list
    addChatMessage: function(data, options) {
      // Don't fade the message in if there is an 'X was typing'
      var $typingMessages = this.getTypingMessages(data);
      options = options || {};
      if ($typingMessages.length !== 0) {
        options.fade = false;
        $typingMessages.remove();
      }

      var $usernameDiv = $('<span class="username"/>')
        .text(data.username)
        .css('color', this.getUsernameColor(data.username));
      var $messageBodyDiv = $('<span class="messageBody">')
        .text(data.message);

      var typingClass = data.typing ? 'typing' : '';
      var $messageDiv = $('<li class="message"/>')
        .data('username', data.username)
        .addClass(typingClass)
        .append($usernameDiv, $messageBodyDiv);

      this.addMessageElement($messageDiv, options);
    },

    // Adds the visual chat typing message
    addChatTyping: function(data) {
      data.typing = true;
      data.message = 'is typing';
      this.addChatMessage(data);
    },

    // Removes the visual chat typing message
    removeChatTyping: function(data) {
      this.getTypingMessages(data).fadeOut(function() {
        $(this).remove();
      });
    },

    // Adds a message element to the messages and scrolls to the bottom
    // el - The element to add as a message
    // options.fade - If the element should fade-in (default = true)
    // options.prepend - If the element should prepend
    //   all other messages (default = false)
    addMessageElement: function(el, options) {
      var $el = $(el);

      // Setup default options
      if (!options) {
        options = {};
      }
      if (typeof options.fade === 'undefined') {
        options.fade = true;
      }
      if (typeof options.prepend === 'undefined') {
        options.prepend = false;
      }

      // Apply options
      if (options.fade) {
        $el.hide().fadeIn(this.FADE_TIME);
      }
      if (options.prepend) {
        this.$messages.prepend($el);
      } else {
        this.$messages.append($el);
      }
      this.$messages[0].scrollTop = this.$messages[0].scrollHeight;
    },

    // Prevents input from having injected markup
    cleanInput: function(input) {
      return $('<div/>').text(input).text();
    },

    // Updates the typing event
    updateTyping: function() {
      if (this.connected) {
        if (!this.typing) {
          this.typing = true;
          this.socket.emit('typing');
        }
        this.lastTypingTime = (new Date()).getTime();

        setTimeout(function() {
          var typingTimer = (new Date()).getTime();
          var timeDiff = typingTimer - this.lastTypingTime;
          if (timeDiff >= this.TYPING_TIMER_LENGTH && this.typing) {
            this.socket.emit('stop typing');
            this.typing = false;
          }
        }, this.TYPING_TIMER_LENGTH);
      }
    },

    // Gets the 'X is typing' messages of a user
    getTypingMessages: function(data) {
      return $('.typing.message').filter(function(i) {
        return $(this).data('username') === data.username;
      });
    },

    // Gets the color of a username through our hash function
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

  return Chat;

});