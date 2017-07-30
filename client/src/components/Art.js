import React, { Component } from 'react';
import {project} from '../geometry';


import { Canvas } from './Canvas';

function minus(A, B) {
  return {x: A.x - B.x, y: A.y - B.y, z: A.z - B.z};
}

function length(A) {
  return Math.sqrt(A.x*A.x + A.y*A.y + A.z*A.z);
}

function dist(A, B) {
  return length(minus(A,B));
}

export class Art extends Component {
  constructor() {
    super();
    this.state = {
      items: [], // items = [{type: 'sphere', center: { x, y, z }, { type: 'polyhedron', complete: false }]
      currentItem: null,
    };
  }

  componentWillReceiveProps(props) {
    if (props.mode !== this.props.mode) {
      // discard everything
      this.onCancel();
    }
  }

  // In theory, these state transitions could be done in redux
  // let's pretend we're doing that
  // and write these to be as reducer-like as possible

  onClick(point) {
    const { currentItem } = this.state;
    const { mode } = this.props;
    let newItem;
    if (mode === 'sphere') {
      newItem = {
        type: 'Sphere',
        center: point,
        radius: 0,
      }
    } else if (mode === 'extrusion') {
      const { basePoints = [], phase = 'base' } = currentItem || {};
      if (phase === 'base') {
        newItem = {
          type: 'Extrusion',
          phase: 'base',
          basePoints: basePoints.concat([point]),
          basePointsPreview: basePoints.concat([point]),
        };
      } else if (phase === 'up') {
        // no op
        newItem = currentItem;
      }
    } else if (mode === 'trace') {
      const { points = [] } = currentItem || {};
      newItem = {
        type: 'Trace',
        points: points.concat([point]),
        pointsPreview: points.concat([point]),
      };
    }

    this.setState({
      currentItem: newItem
    });
  }

  onHover(point) {
    const { currentItem } = this.state;
    const { mode } = this.props;
    this.setState({
      cursor: point
    });
    if (!currentItem) {
      return;
    }

    let newItem;
    if (mode === 'sphere') {
      const { center } = currentItem;
      newItem = {
        ...currentItem,
        radius: dist(point, center),
      }
    } else if (mode === 'extrusion') {
      // TODO: the state transitions here are kind of tricky
      // eventually, the basePoints should be 2D points...
      const { basePoints = [], phase = 'base' } = currentItem;
      if (phase === 'base') {
        if (basePoints.length >= 3) {
          point = project(point, basePoints[0], basePoints[1], basePoints[2]);
        }
        newItem = {
          ...currentItem,
          basePointsPreview: basePoints.concat([point]),
        };
      } else if (phase === 'up') {
        newItem = {
          ...currentItem,
          phase: 'up',
          height: dist(point, basePoints[0]),
        }
      }
    } else if (mode === 'trace') {
      const { points = [] } = currentItem;
      newItem = {
        ...currentItem,
        pointsPreview: points.concat([point]),
      };
    } else {
      console.warn('onHover: unknown mode: ' + mode);
    }

    this.setState({
      currentItem: newItem
    });
  }

  onCancel() {
    this.setState({ currentItem: null });
  }

  onCommit() {
    const { items, currentItem } = this.state;
    const { mode } = this.props;
    if (!currentItem) return;
    if (mode === 'sphere') {
      this.setState({
        items: items.concat(currentItem),
        currentItem: null
      });
    } else if (mode === 'extrusion') {
      const { phase, type, basePoints = [] } = currentItem;
      if (phase === 'base') {
        let newItem;
        if (basePoints.length >= 3) { // must be at least 3
          newItem = {
            type: type,
            phase: 'up',
            basePoints: basePoints,
            height: 0,
          };
        } else {
          newItem = currentItem;
        }
        this.setState({
          currentItem: newItem
        });
      } else if (phase === 'up') {
        this.setState({
          items: items.concat(currentItem),
          currentItem: null
        });
      }
    } else if (mode === 'trace') {
      this.setState({
        items: items.concat(currentItem),
        currentItem: null,
      });
    }
  }

  zoom(delta) {
    this.refs.canvas.zoom(delta);
  }

  rotateCamera(delta) {
    this.refs.canvas.rotateCamera(delta);
  }

  render() {
    const { items, currentItem, cursor } = this.state;
    return (
      <div className="art">
        <Canvas width={500} height={500} items={items} currentItem={currentItem} cursor={cursor} ref="canvas"/>
        <div className="items">
          <h4>Items</h4>
          {items.map(item => (
            <pre>
              {JSON.stringify(item)}
            </pre>
          ))}
          <h4>Cursor</h4>
          {
            <pre>
              {JSON.stringify(cursor)}
            </pre>
          }
          <h4>Current Item</h4>
          {
            <pre>
              {JSON.stringify(currentItem)}
            </pre>
          }

        </div>
      </div>
    );
  }
};

