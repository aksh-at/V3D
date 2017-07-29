const server = require('http').createServer();
const io = require('socket.io')(server);

const views = {
  main: {
    online: false,
    lastTime: null,
    lastPoint: {
      x: 0,
      y: 0,
    },
  },
  side: {
    online: false,
    lastTime: null,
    lastPoint: {
      x: 0,
      y: 0,
    },
  },
};

io.on('connection', function(client){
  let view = '';
  console.log('connection');
  client.on('frame', function(points){
    console.log('frame', points);
  });
  client.on('disconnect', function(){});
});

const port = 3001;
console.log('Server listening on port', port);
server.listen(port);
