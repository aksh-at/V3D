export function minus(A, B) {
	return {x: A.x - B.x, y: A.y - B.y};
}

export function length(A) {
	return Math.sqrt(A.x*A.x + A.y*A.y);
}

export function dist(A, B) {
	return length(minus(A,B));
}
