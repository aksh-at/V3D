import React, { Component } from 'react';
import { drawGrid, drawCircle } from '../canvas-utils';
import React3 from 'react-three-renderer';
import * as THREE from 'three';

import './Canvas.css';

export class Canvas extends Component {
  static propTypes = {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    items: React.PropTypes.object.isRequired,
  };

  constructor(props, context) { 
    super(props, context);

    this.cameraPosition = new THREE.Vector3(0, 0, 1000);

    // construct the position vector here, because if we use 'new' within render,
    // React will think that things have changed when they have not.

    this.state = {
      cubeRotation: new THREE.Euler(),
    };

    this._onAnimate = () => {
      // we will get this callback every frame

      // pretend cubeRotation is immutable.
      // this helps with updates and pure rendering.
      // React will be sure that the rotation has now updated.
      this.setState({
        cubeRotation: new THREE.Euler(
          this.state.cubeRotation.x + 0.1,
          this.state.cubeRotation.y + 0.1,
          0
        ),
      });
    };

    this.lightPosition = new THREE.Vector3(0, 500, 2000);
    this.lightTarget = new THREE.Vector3(0, 0, 0);
  }

  renderPointLight() {
    return (
      <spotLight
            color={0xffffff}
            intensity={1.5}
            position={this.lightPosition}
            lookAt={this.lightTarget}

            castShadow
            shadowCameraNear={200}
            shadowCameraFar={10000}
            shadowCameraFov={50}

            shadowBias={-0.00022}

            shadowMapWidth={2048}
            shadowMapHeight={2048}
          />
    );
  }

  renderRotatingCube(offset) {
    return (
      <mesh rotation={this.state.cubeRotation}>
        <boxGeometry
          vertices={[THREE.Vector3]}
          width={1 - offset}
          height={1 + offset}
          depth={1 + 2 * offset}
        />
        <meshBasicMaterial
          color={0x00ff00}
        />
      </mesh>
    );
  }

  renderSphere() {
    return (
      <mesh rotation={this.state.cubeRotation}>
        <sphereGeometry
          radius={70}
        />
        <meshBasicMaterial
          color={0x0000ff}
        />
      </mesh>
    );
  }

  render() {
    const {
      width,
      height,
      items,
    } = this.props;

    // or you can use:
    // width = window.innerWidth
    // height = window.innerHeight

    return (<React3
      mainCamera="camera" // this points to the perspectiveCamera below
      width={width}
      height={height}

      onAnimate={this._onAnimate}
    >
      <scene>
        <perspectiveCamera
          name="camera"
          fov={75}
          aspect={width / height}
          near={0.1}
          far={1000}

          position={this.cameraPosition}
        />
        <ambientLight
            color={0x505050}
          />
        { this.renderPointLight() }
        { this.renderSphere() }
      </scene>
    </React3>);
  }
}
