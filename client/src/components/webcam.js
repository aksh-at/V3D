import React, { Component } from 'react';
import 'tracking';

import './webcam.css';

const tracking = window.tracking;

const threshold = 10;

export class Webcam extends Component {
  constructor(props) {
    super(props);

    this.constraints = {
      yellow: getColorConstraints('yellow'),
      purple: getColorConstraints('purple'),
    };

    this.interval = null;
  }

  normalize(point) {
    const canvas = this.refs.canvas;
    return {
      x: point.x / canvas.width,
      y: point.y / canvas.height,
    };
  }

  componentDidMount() {
    const canvas = this.refs.canvas;
    const context = canvas.getContext('2d');

    const colors = ['purple', 'yellow'];
    colors.forEach(color => {
      tracking.ColorTracker.registerColor(color, (r, g, b) => {
        const hsl = rgbToHsl([r, g, b]);
        const constraints = this.constraints[color];

        for (let i = 0; i < 3; i++) {
          const low = constraints[i][0];
          const high = constraints[i][1];
          const colorPart = hsl[i];
          const margin = (i === 2) ? 0.05 : 0.02;

          if (low - margin > colorPart || high + margin < colorPart)
            return false;
        }

        return true;
      });
    });


    const tracker = new tracking.ColorTracker(colors);

    tracking.track('#webcam-video', tracker, { camera: true });

    const prevPoints = {};
    tracker.on('track', event => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      const selectedPoints = {};
      event.data.forEach(rect => {
        const x = rect.x + rect.width / 2;
        const y = rect.y + rect.height / 2;
        const color = rect.color;
        const point = {x, y, color};
        if (!selectedPoints[color] || dist(point, prevPoints[color]) < dist(selectedPoints[color], prevPoints[color]))
          selectedPoints[color] = point;
      });

      // check the travel distance and interpret action differently based on that
      Object.keys(selectedPoints).forEach(color => {
        const point = selectedPoints[color];
        const prevPoint = prevPoints[color];

        // moving too fast doesn't count as moving eh
        if (point && prevPoint && dist(point, prevPoint) < threshold * threshold) {
          const { onMove } = this.props;
          onMove && onMove({ x: point.x - prevPoint.x, y: point.y - prevPoint.y, color: point.color });
        }
      });

      Object.keys(selectedPoints).forEach(color => {
        prevPoints[color] = selectedPoints[color];
      });

      Object.keys(prevPoints).forEach(color => {
        const radius = 5;
        const { x, y } = prevPoints[color];

        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI, false);
        context.fillStyle = color;
        context.fill();
      });
    });

    this.interval = setInterval(() => {
      const point = prevPoints.purple;
      if (!point) return;
      const pointToSend = this.normalize(point)
      this.props.onSend && this.props.onSend(pointToSend);
    });
  }

  componentWillUnmount() {
    this.interval && clearInterval(this.interval);
    this.interval = null;
  }

  render() {
    return (
      <div className="demo-container">
        <video id="webcam-video" height="300" width="400" preload autoPlay loop muted></video>
        <canvas ref="canvas" height="300" width="400"></canvas>
      </div>
    );
  }
}

var colorSamples = {
  orange: `
208 77 60
187 57 41
191 83 72
225 98 81
167 44 31
180 64 52
205 104 94
225 130 121
235 120 105
234 155 149
`,
  purple: `
107 62 125
98 50 119
117 78 130
94 49 111
134 96 146
156 121 165
99 60 111
182 150 184
215 189 216
198 141 177
168 114 149
179 123 159
189 133 169
175 123 154
111 82 100
107 80 96
106 78 97
118 91 104
113 86 102
`,
  yellow: `
205 159 83
215 164 71
161 122 67
141 106 56
179 137 69
234 189 114
185 138 54
196 148 56
240 198 65
250 209 60
211 164 60
`
};

function dist(p1, p2) {
  if (!p1 || !p2) return 99999999;
  var xdiff = p1.x - p2.x;
  var ydiff = p1.y - p2.y;

  return xdiff * xdiff + ydiff * ydiff;
}

function getColorConstraints(color) {
  var xs = colorSamples[color].split('\n').map(s => s.trim()).filter(s => s !== '').map(s => s.split(' ').map(s => parseInt(s, 10)));
  xs = xs.map(rgbToHsl)

  let min = xs[0].slice();
  let max = xs[0].slice();

  xs.forEach(function (hsl) {
    for (var i = 0; i < 3; i++) {
      min[i] = Math.min(min[i], hsl[i]);
      max[i] = Math.max(max[i], hsl[i]);
    }
  })

  return [
    [min[0], max[0]],
    [min[1], max[1]],
    [min[2], max[2]],
  ];
}

function rgbToHsl(ccc) {
  var r = ccc[0];
  var g = ccc[1];
  var b = ccc[2];
  r /= 255; g /= 255; b /= 255;

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: break;
    }

    h /= 6;
  }

  return [ h, s, l ];
}
