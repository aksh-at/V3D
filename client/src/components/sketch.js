import React, { Component } from 'react';
import { drawGrid } from '../canvas-utils';


export class Sketch extends Component {
  componentDidMount() {
    this.initializeCanvas();
  }
  initializeCanvas() {
    const canvas = this.refs.canvas;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.fillRect(0,0, 100, 100);
  }

  render() {
    return (
      <div className="sketch">
        <canvas
          width="500"
          height="500"
          ref="canvas"
        />
      </div>
    );
  }
}
