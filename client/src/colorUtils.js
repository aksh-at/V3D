const niceColors = [0x0099ff, 0x9900ff];

export const GHOST_COLOR = 0x999999;

export function randomColor() {
	"hsl(0, 100%, 50%)"
	const idx = Math.floor(Math.random() * 360);
	const colorString = 'hsl(' + idx + ', 100%, 30%)';
  	return colorString;
}