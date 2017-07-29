const server = require('http').createServer();
const io = require('socket.io')(server);

function makeView() {
  return {
    online: false,
    lastTime: null,
    points: {
      x: 0,
      y: 0,
    },
  };
}

const views = {
  main: makeView(),
  side: makeView(),
};

function update() {
  const points = [];
  const { main, side } = views;
  const numPoints = Math.min(main.points.length, side.points.length);
  for(var i = 0; i < numPoints; i += 1) {
    points.push({
      x: main.points[i].x,
      y: main.points[i].y,
      z: side.points[i].z,
    });
  }
  io.sockets.emit('points', points);
}

io.on('connection', function(client){
  let view = undefined;
  console.log('connection');
  client.on('setpoints', function(points){
    console.log('setpoints', points);
    if (view) {
      view.points = points;
      view.lastTime = +(new Date());
    }
    update();
  });

  client.on('setview', function(viewStr){
    console.log('setview', viewStr);
    if (view) view.online = false;
    view = views[viewStr];
    if (view) view.online = true;
    update();
  });

  client.on('disconnect', function(){
    console.log('disconnect');
    if (view) view.online = false;
    update();
  });
});

const port = 3001;
console.log('Server listening on port', port);
server.listen(port);
