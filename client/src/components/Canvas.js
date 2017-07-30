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

    // construct the position vector here, because if we use 'new' within render,
    // React will think that things have changed when they have not.

    this.state = {
      cubeRotation: new THREE.Euler(),
      fov: 30,
      cameraX: 10,
      cameraZ: 0,
      rot: 0,
      distance: 10,
      hardCodedItems: {
        polygons: [[0.4, 0, 0, 0, 0, 0.2, 0, 0.3, 0, 0, 0.2, 0.3]],
        spheres: [],
        markers: [],
        lines: [],
        aid_spheres: [],
      }
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

    this._raycaster = new THREE.Raycaster();
    this.fog = new THREE.Fog(0x001525, 10, 20);

    this.lightPosition = new THREE.Vector3(0, 500, 2000);
    this.lightTarget = new THREE.Vector3(0, 0, 0);
    this.groundQuaternion = new THREE.Quaternion()
      .setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
    this.spherePosition = new THREE.Vector3(0, 3, 0);
    this.cameraQuaternion = new THREE.Quaternion()
      .setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
  }

  zoom(delta) {
    this.setState(({distance}) => ({ distance: distance + delta * 0.05}));
  }

  rotateCamera(delta) {
    delta *= 0.05;

    this.setState(({cameraX, cameraZ, rot, distance}) => ({
      cameraX: Math.cos(rot + delta) * distance,
      cameraZ: Math.sin(rot + delta) * distance,
      rot: rot + delta,
    }));
  }

  renderPointLight() {
    const d = 20;
    return (
      <directionalLight
        color={0xffffff}
        intensity={1.75}

        castShadow

        shadowMapWidth={1024}
        shadowMapHeight={1024}

        shadowCameraLeft={-d}
        shadowCameraRight={d}
        shadowCameraTop={d}
        shadowCameraBottom={-d}

        shadowCameraFar={3 * d}
        shadowCameraNear={d}

        position={this.lightPosition}
        lookAt={this.lightTarget}
      />
    );
  }

  renderSphere(item) {
	  item['color'] = 0x00ff00;
	  item['opacity'] = 0.7;
	  return this.renderSphereInternal(item);
  }

  renderCursor(item) {
	  item['color'] = 0x0000ff;
	  item['opacity'] = 1;
	  return this.renderSphereInternal(item);
  }

  renderMarker(item) {
	  item['color'] = 0xff0000;
	  item['opacity'] = 1;
	  return this.renderSphereInternal(item);
  }

  renderSphereInternal(item) {
    return (
      <mesh 
        castShadow
        position={item["center"]}
      >
        <sphereGeometry
          radius={item["radius"]}
          widthSegments = {10}
          heightSegments = {10}
        />
        <meshPhongMaterial
          color={item["color"]}
  		  opacity={item["opacity"]}
        />
      </mesh>
    );
  }


  renderPolygon(polygon) {
    console.log(polygon);
    return (
      <mesh 
        castShadow
        position={this.spherePosition}
        rotation={this.state.cubeRotation}
      >
        <extrudeGeometry
          vertices={polygon}
          // shapes={new THREE.ShapeGeometry(polygon)}
        />
        <meshPhongMaterial
          color={0x00ff00}
        />
      </mesh>
    );
  }

  renderExtrusion(extrusion) {
    const {
      phase, // either 'base' or 'up'
      basePoints,
      basePointsPreview,
      height
    } = extrusion;

    return;
  }


  renderObjects(items) {
    return (
      items.map(
        item => (this['render' + item.type](item))
      )
    );
  }

  render() {
    const {
      width,
      height,
      items,
    } = this.props;

    const { cameraX, cameraZ } = this.state;
    this.cameraPosition = new THREE.Vector3(cameraX, 2, cameraZ);

    // or you can use:
    // width = window.innerWidth
    // height = window.innerHeight

    return (
      <React3
        antialias
        mainCamera="camera" // this points to the perspectiveCamera below
        width={width}
        height={height}

        onAnimate={this._onAnimate}

        clearColor={this.fog.color}

        gammaInput
        gammaOutput
        shadowMapEnabled
      >
        <scene
          fog = {this.fog}
        >
          <perspectiveCamera
            name="camera"

            fov={this.state.fov || 30}
            aspect={width / height}
            near={0.5}
            far={10000}

            position={this.cameraPosition}
            quaternion={this.cameraQuaternion}
            lookAt={new THREE.Vector3(0,2,0)}
          />
          <mesh
            castShadow
            receiveShadow

            quaternion={this.groundQuaternion}
          >
            <planeBufferGeometry
              width={100}
              height={100}
              widthSegments={1}
              heightSegments={1}
            />
            <meshLambertMaterial
              color={0x777777}
            />
          </mesh>
          <ambientLight
            color={0x505050}
          />

        { this.renderPointLight() }
        { this.renderObjects(items) }
      </scene>
      </React3>
    );
  }
}
