export function drawCircle(cnv, cx, cy, rad) {
  console.log('draw circle', cx, cy, rad);
  var ctx = cnv.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(cx, cy, rad, 0, 2 * Math.PI, false);
  ctx.fill();
  ctx.closePath();
}

