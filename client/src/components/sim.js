import React, { Component } from 'react';
import debounce from 'debounce';
import throttle from 'lodash.throttle';
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
  constructor(props) {
    super(props);
    this.state = {
      color: 'purple',
      points: [],
    };
    this._onMouseMove = this.onMouseMove.bind(this);

    this.lastX = 0;
    this.lastY = 0;
    this.buffer = [];

    this.lastPoint = null;
    this.onMove = throttle((point) => {
      if (this.lastPoint)
        this.props.onMove({ x: 400*(point.x - this.lastPoint.x), y: 400 * (point.y - this.lastPoint.y), color: point.color });
      this.lastPoint = Object.assign({}, point);
    }, 100)
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
    const { color } = this.state;
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

    if (color === 'purple') {
      this.props.onSend({ x: this.lastX, y: this.lastY });
    } else {
      this.onMove({ x: this.lastX, y: this.lastY, color });
    }
  }

  render() {
    const { width, height } = this.props;
    const { color, points } = this.state;

    return (
      <div className="sim">
        <div
          ref='box'
          className="box"
          style={{
            width: width,
            height: height,
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
        <a href="#" onClick={() => this.setState({color: this.state.color === 'purple' ? 'yellow' : 'purple'})}>Switch color</a>
      </div>
    );
  }
}

