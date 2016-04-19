

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var chat = function( socket) {
	this.add({})
}

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});