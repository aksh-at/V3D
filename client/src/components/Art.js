import React, { Component } from 'react';

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
      mode: 'sphere',
      currentItem: null,
    };
  }

  onClick(point) {
    const { currentItem, mode } = this.state;
    let newItem;
    if (mode === 'sphere') {
      newItem = {
        type: 'Sphere',
        center: point,
        radius: 0
      }
    }
    this.setState({
      currentItem: newItem
    });
  }

  onHover(point) {
    const { currentItem, mode } = this.state;
    if (!currentItem) {
      this.setState({
        cursor: point
      });
      return;
    }

    let newItem;
    if (mode === 'sphere') {
      newItem = {
        ...currentItem,
        radius: dist(point, currentItem.center),
      }
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
    if (!currentItem) return;
    this.setState({
      items: items.concat(currentItem),
      currentItem: null
    });
  }

  onSetMode(mode) {
    this.setState({ mode });
  }

  render() {
    const { items, currentItem, cursor } = this.state;
    return (
      <div className="art">
        <Canvas width={500} height={500} items={items} currentItem={currentItem} cursor={cursor}/>
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

