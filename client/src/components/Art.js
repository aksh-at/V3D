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
      items: []
      mode: 'sphere',
      currentItem: null,
    };
  }

  onClick(point) {
    const { currentItem } = this.state;
    let newItem;
    if (mode === 'sphere') {
      newItem = {
        center: point
      }
    }
    this.setState({
      currentItem: newItem
    });
  }

  onHover(point) {
    const { currentItem } = this.state;
    if (!currentItem) {
      this.setState({
        cursor: point
      });
      return;
    }

    let newItem;
    if (mode === 'sphere') {
      newItem = {
        center: currentItem.center,
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
    if (!currentItem) return;
    const { items, currentItem } = this.state;
    this.setState({
      items: items.concat(currentItem),
      currentItem: null
    });
  }

  onSetMode(mode) {
    this.setState({ mode });
  }

  render() {
    const { items, currentItem } = this.state;
    return (
      <Canvas width={500} height={500} items={items} currentItem={currentItem}/>
    );
  }
};

