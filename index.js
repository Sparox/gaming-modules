var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
var ioHandler = function (socket) {
  console.log('Connection to client established');
  console.log(socket);

  socket.on("chat:message", function(msg){
    io.emit("chat:message", msg);
  });
};

io.on("connection", ioHandler);

http.listen(3000, function(){
  console.log('listening on *:3000');
});