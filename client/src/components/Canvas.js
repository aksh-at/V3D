import React, { Component } from 'react';
import { drawGrid, drawCircle } from '../canvas-utils';
import ReactTHREE from 'react-three';
import { PlaneBufferGeometry, Vector2, Vector3, ShaderMaterial } from 'three';

import './Canvas.css';

var geometry = new PlaneBufferGeometry( 2, 2 );

const { Renderer, Scene, Mesh, Object3d, PerspectiveCamera } = ReactTHREE;

class Wavey extends React.Component {
  constructor(props) {
    super(props)

    this.uniforms = {
      time: { type: "f", value: props.time },
      resolution: { type: "v2", value: new Vector2(props.width, props.height) }
    }; 

    this.material = new ShaderMaterial({
      uniforms: this.uniforms,
    });
  }
  componentWillReceiveProps(nextProps) {
    this.uniforms.time.value = nextProps.time

    if(nextProps.width !== this.props.width)
      this.uniforms.resolution.value.x = nextProps.width;

    if(nextProps.height !== this.props.height)
      this.uniforms.resolution.value.y = nextProps.height;
  }
  render() {
    return <Mesh geometry={geometry} material={this.material} />
  }
}


export class Canvas extends Component {
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
    const width = 300;
    const height = 300;
    var aspectratio = width / height;
    var cameraprops = {fov : 75, aspect : aspectratio, 
      near : 1, far : 5000, 
      position : new Vector3(0,0,600), 
      lookat : new Vector3(0,0,0)};

    return (
      <div className="canvas">
        <Renderer width={width} height={height}>
          <Scene width={width} height={height} camera="maincamera">
            <PerspectiveCamera name="maincamera" {...cameraprops} />

            <Wavey time={1.0} width={width} height={height} />
          </Scene>
        </Renderer>
      </div>
    );
}
}
