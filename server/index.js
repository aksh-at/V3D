var server = require('http').createServer();
var io = require('socket.io')(server);
io.on('connection', function(client){
  console.log('connection');
  client.on('frame', function(points){
    console.log('frame', points);
  });
  client.on('disconnect', function(){});
});

const port = 3001;
console.log('Server listening on port', port);
server.listen(port);
