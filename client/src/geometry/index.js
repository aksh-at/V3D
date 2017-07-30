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

// project(new THREE.Vector3(1, 2, 3), ...) works
export function project(point, a, b, c) {
  point = point.clone();
  a = a.clone();
  b = b.clone();
  c = c.clone();

  point.sub(a);
  b.sub(a);
  c.sub(a);
  b.cross(c).normalize();
  point.projectOnPlane(b);
  point.add(a);
  return point;
}

