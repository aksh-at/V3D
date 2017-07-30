import { Vector3 } from 'three';

export function convert(point) {
  return new Vector3(point.x, point.y, point.z);
}


// project({x:1,y:2,z:3},...) works
// project(new THREE.Vector3(1, 2, 3), ...) works too
export function project(point, a, b, c) {
  point = convert(point);
  a = convert(a);
  b = convert(b);
  c = convert(c);

  point.sub(a);
  b.sub(a);
  c.sub(a);
  b.cross(c).normalize();
  point.projectOnPlane(b);
  point.add(a);
  return point;
}


function random(ar) {
  const idx = Math.floor(Math.random() * ar.length);
  return ar[idx];
}

