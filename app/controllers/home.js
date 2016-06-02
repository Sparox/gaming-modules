/* jshint node: true */
'use strict';

var express = require('express'),
  router = express.Router();
var app = express();
var server = app.listen(3001);
var io = require('socket.io')(server);

module.exports = function(app) {
  app.use('/', router);
};

router.get('/', function(req, res, next) {
  res.render('index', {});
});

// Chatroom

var numUsers = 0;
var usersConnected = [];

io.on('connection', function(socket) {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function(data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function(username) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    usersConnected.push({username: socket.username, position: {}});
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  socket.on('get users', function() {
    socket.emit('get users', {
      users:usersConnected
    });
  });

  socket.on('user move', function(data) {
    var user = usersConnected.filter(function(u) {return u.username == data.player;})[0];
    user.position = data.position;
    socket.broadcast.emit('user move', data);
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function() {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function() {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function() {
    if (addedUser) {
      --numUsers;
      var user = usersConnected.filter(function(u){return u.username == socket.username;})[0];
      usersConnected.splice(user,1);    

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});