import React, { Component } from 'react';
import debounce from 'debounce';
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
    this._onMouseClick = this.onMouseClick.bind(this);
    this._sendEvents = debounce(this.sendEvents.bind(this), 500);

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
    x -= t.offsetLeft;
    y -= t.offsetTop;
    x /= width;
    y /= height;
    this.hover({ x, y });
  }

  onMouseClick(e) {
    e.stopPropagation();
    this.buffer.push({ x: this.lastX, y: this.lastY });
    this._sendEvents();
  }

  sendEvents() {
    this.props.onSend(this.buffer);
    this.buffer = [];
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

