import React, { Component } from 'react';
import classnames from 'classnames';
import './sim.css';

export class Sim extends Component {
  constructor() {
    super();
    this.state = {
      color: 'purple',
      points: [],
    };
    this._onMouseMove = this.onMouseMove.bind(this);
  }

  hover({x, y}) {
    const { width, height } = this.props;
    const pt = this.refs.pt;
    if (!pt) return;
    pt.style.left = x * width + 'px';
    pt.style.top = y * height + 'px';
  }

  onMouseMove(e) {
    e.stopPropagation();
    const { width, height } = this.props;
    let x = e.pageX,
      y = e.pageY;
    const t = this.refs.box;
    x -= t.offsetLeft;
    y -= t.offsetTop;
    x /= width;
    y /= height;
    console.log(x, y);
    this.hover({ x, y });
  }

  render() {
    const { width, height } = this.props;
    const { color, hover, points } = this.state;
    console.log('hover', hover);

    return (
      <div className="sim">
        <div
          ref='box'
          className="box"
          style={{
            width: width,
            height: height,
          }}
          onClick={e => {
          }}
          onMouseMove={this._onMouseMove}
        >
          <div
            ref="pt"
            className="hover"
            style={{
              backgroundColor: color
            }}
          >
          </div>
          {points.map(point => (
            <div
              className="point"
              style={{
                backgroundColor: point.color,
                left: point.x * width,
                top: point.y * height,
              }}
            >
            </div>
          ))}
        </div>
      </div>
    );
  }
}

