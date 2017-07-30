import math from 'math';

const server = require('http').createServer();
const io = require('socket.io')(server);

const modes = ["draw_polygon", "draw_sphere"];

var polygons = [];
var spheres = [];
var currentMode = 0;

class DrawSphere  {
	constructor() {
		this.curSphere = {};
	}

	reset(point) {
		this.curSphere = {};
	}

	click(point) {
		this.curSphere["centre"] = point;
	}

	submit(point) {
		if ("centre" in curSphere) {
			curSphere["radius"] = math.dist(point, curSphere["centre"]);
			spheres.push(curSphere);
			reset();
		}
	}
}

class DrawPolygon  {
	constructor() {
		this.curShape = [];
	}

	reset(point) {
		this.curShape = [];
	}

	click(point) {
		this.curShape.push(point);
	}

	submit(point) {
		polygons.push(this.curShape);
		reset();
	}
}

const modes = {
  draw_polygon: new DrawPolygon()
  draw_sphere: new DrawSphere()
};

class ViewState {
	constructor() {
		this.online = false;
		this.lastTime = null;
		this.lastPoint = { x: 0, y: 0};
	}

	registerPoint(points, timestamp) {
		this.lastPoint = points;
		this.lastTime  = timestamp;
	}
}

const views = {
  main: new ViewState(),
  side: new ViewState(),
};

function getLastPoint() {
}

function processCommand(type) {
	switch(type) {
	case 'toggle':
		currentMode = (this.currentMode + 1) % (modes.length);
		modes[currentMode]["reset"]();
		break;
	default:
		modes[currentMode][type](getLastPoint());
	}
}

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
  console.log('connection');
  client.on('setpoints', function(points, timestamp, view){
    console.log('setpoints', points, timestamp, view);
	views[view].registerPoints(points, timestamp);
    update();
  });

  client.on('command', function(type){
    console.log('command', type);
	processCommand(type);
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
