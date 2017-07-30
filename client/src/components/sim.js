import React, { Component } from 'react';
import debounce from 'debounce';
import classnames from 'classnames';
import './sim.css';

function getAbsoluteOffset(el) {
  let left = 0, top = 0;
  while (el) {
    left += el.offsetLeft;
    top += el.offsetTop;
    el = el.offsetParent;
  }

  return { left, top };
}

export class Sim extends Component {
  constructor() {
    super();
    this.state = {
      color: 'purple',
      points: [],
    };
    this._onMouseMove = this.onMouseMove.bind(this);
    this._onMouseClick = this.onMouseClick.bind(this);

    this.lastX = 0;
    this.lastY = 0;
    this.buffer = [];
  }

  hover({x, y}) {
    const { width, height } = this.props;
    const pt = this.refs.pt;
    if (!pt) return;
    pt.style.left = x * width + 'px';
    pt.style.top = y * height + 'px';

    this.lastX = x;
    this.lastY = y;
  }

  onMouseMove(e) {
    e.stopPropagation();
    const { width, height } = this.props;
    let x = e.pageX,
      y = e.pageY;
    const t = this.refs.box;
    const offsets = getAbsoluteOffset(t);
    x -= offsets.left;
    y -= offsets.top;
    x /= width;
    y /= height;
    this.hover({ x, y });
  }

  onMouseClick(e) {
    e.stopPropagation();
    this.props.onSend({ x: this.lastX, y: this.lastY });
  }

  render() {
    const { width, height } = this.props;
    const { color, hover, points } = this.state;

    return (
      <div className="sim">
        <div
          ref='box'
          className="box"
          style={{
            width: width,
            height: height,
          }}
          onClick={this._onMouseClick}
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

