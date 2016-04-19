var express = require('express'),
  router = express.Router(),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server);

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
    res.render('index', {});
});

var ioHandler = function (socket) {
  console.log('Connection to client established');
  socket.on("chat:message", function(msg){
    io.emit("chat:message", msg);
  });
};

io.on("connection", ioHandler);

server.listen(3001, function(){
  console.log('listening on *:3001');
});