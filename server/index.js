import math from './math';

const server = require('http').createServer();
const io = require('socket.io')(server);

class ViewState {
  constructor() {
    this.online = false;
    this.lastTime = null;
    this.lastPoint = { x: 0, y: 0};
  }

  registerPoints(points, timestamp) {
    this.lastPoint = points;
    this.lastTime  = timestamp;
  }
}

const views = {
  main: new ViewState(),
  side: new ViewState(),
};

function getLastPoint() {
  const { main, side } = views;
  var ret = {
    x: side.lastPoint.x * (-6) + 3,
    y: main.lastPoint.y * (- 4.5) + 4.5,
    z: main.lastPoint.x * (-5) + 2.5,
  }
  console.log(main, side, ret);
  return ret;
}

function update() {
  io.sockets.emit('point', getLastPoint());
}

io.on('connection', function(client){
  console.log('connection');
  client.on('setpoints', function(points, timestamp, view){
    console.log('setpoints', points, timestamp, view);
    views[view].registerPoints(points, timestamp);
    update();
  });

  client.on('disconnect', function(){
    console.log('disconnect');
    update();
  });
});

const port = 3001;
console.log('Server listening on port', port);
server.listen(port);
