export function minus(A, B) {
	return {x: A.x - B.x, y: A.y - B.y, z: A.z - B.z};
}

export function length(A) {
	return Math.sqrt(A.x*A.x + A.y*A.y + A.z*A.z);
}

export function dist(A, B) {
	return length(minus(A,B));
}
