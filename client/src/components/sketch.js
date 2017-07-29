import React, { Component } from 'react';
import { drawGrid, drawCircle } from '../canvas-utils';

export class Sketch extends Component {
  constructor() {
    super();
    this.state = {
    };
  }

  componentDidMount() {
    this.initializeCanvas();
    this.updateItems();
  }

  componentDidUpdate() {
    this.updateItems();
  }

  initializeCanvas() {
    const canvas = this.refs.canvas;
    if (!canvas) return;

    drawGrid(canvas);
  }

  drawItem(item) {
    console.log('draw item', item);
    const canvas = this.refs.canvas;
    if (!canvas) return;

    const { type } = item;
    if (type === 'circle') {
      const { cx, cy, radius } = item;
      drawCircle(canvas, cx, cy, radius);
    }
  }

  updateItems() {
    // XXX todo: intelligent redraw
    const { items } = this.props;
    this.initializeCanvas();
    items.forEach(item => this.drawItem(item));
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
