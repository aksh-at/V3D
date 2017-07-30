import { Vector3 } from 'three';

function sub(a, b) {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
    z: a.z - b.z
  }
}

function add(a, b) {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
    z: a.z + b.z
  }
}


function cross(a, b) {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
    z: a.z + b.z
  }
}

// project({x:1,y:2,z:3},...) works
// project(new THREE.Vector3(1, 2, 3), ...) works too
export function project(point, a, b, c) {
  point = new Vector3(point.x, point.y, point.z);
  a = new Vector3(a.x, a.y, a.z);
  b = new Vector3(b.x, b.y, b.z);
  c = new Vector3(c.x, c.y, c.z);

  point.sub(a);
  b.sub(a);
  c.sub(a);
  b.cross(c).normalize();
  point.projectOnPlane(b);
  point.add(a);
  return point;
}

