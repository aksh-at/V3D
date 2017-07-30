import math from './math';

const server = require('http').createServer();
const io = require('socket.io')(server);

var polygons = [];
var spheres = [];
var currentMode = 'draw_polygon';

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

	getMarkers() {
		return [this.curSphere["centre"]];
	}

	getAidSpheres() {
		return [this.curSphere];
	}

	getLines() { return []; }

	submit(point) {
		if ("centre" in curSphere) {
			this.curSphere["radius"] = math.dist(point, curSphere["centre"]);
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

	getMarkers() {
		return this.curShape;
	}

	getAidSpheres() { return []; }

	getLines() {
		const lines = [];
		for (let i = 0; i < (this.curShape.length-1); i++) {
			lines.push([this.curShape[i], this.curShape[i+1]]);
		}
		return lines;
	}

	submit(point) {
		polygons.push(this.curShape);
		reset();
	}
}

const modes = {
  draw_polygon: new DrawPolygon(),
  draw_sphere: new DrawSphere()
};

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
	return {
		x: main.lastPoint.x,
		y: main.lastPoint.y,
		z: side.lastPoint.x,
	}
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
  io.sockets.emit('polygons', polygons);
  io.sockets.emit('spheres', spheres);
  io.sockets.emit('markers', modes[currentMode].getMarkers());
  io.sockets.emit('lines', modes[currentMode].getLines());
  io.sockets.emit('aid_spheres', modes[currentMode].getAidSpheres());
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
    update();
  });
});

const port = 3001;
console.log('Server listening on port', port);
server.listen(port);
