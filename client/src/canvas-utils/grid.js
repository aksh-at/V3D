export function drawGrid(cnv) {
  var gridOptions = {
    minorLines: {
      separation: 10,
      color: '#222222'
    },
    majorLines: {
      separation: 50,
      color: '#444444'
    },
    background: {
      color: '#000000',
    }
  };


  fillBackground(cnv, gridOptions.background);
  drawGridLines(cnv, gridOptions.minorLines);
  drawGridLines(cnv, gridOptions.majorLines);

  return;
}

function fillBackground(cnv, { color = 'black' } = {}) {

  var iWidth = cnv.width;
  var iHeight = cnv.height;
  var ctx = cnv.getContext('2d');

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, iWidth, iHeight);

}

function drawGridLines(cnv, lineOptions) {
  var iWidth = cnv.width;
  var iHeight = cnv.height;

  var ctx = cnv.getContext('2d');

  ctx.strokeStyle = lineOptions.color;
  ctx.strokeWidth = 1;

  ctx.beginPath();

  var iCount = null;
  var i = null;
  var x = null;
  var y = null;

  iCount = Math.floor(iWidth / lineOptions.separation);

  for (i = 1; i <= iCount; i++) {
    x = (i * lineOptions.separation);
    ctx.moveTo(x, 0);
    ctx.lineTo(x, iHeight);
    ctx.stroke();
  }


  iCount = Math.floor(iHeight / lineOptions.separation);

  for (i = 1; i <= iCount; i++) {
    y = (i * lineOptions.separation);
    ctx.moveTo(0, y);
    ctx.lineTo(iWidth, y);
    ctx.stroke();
  }

  ctx.closePath();

  return;
}


