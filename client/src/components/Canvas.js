import React, { Component } from 'react';
import { drawGrid, drawCircle } from '../canvas-utils';
import { randomColor, GHOST_COLOR } from '../colorUtils';
import { project, convert } from '../geometry';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import './Canvas.css';

/*
 * testing project:
console.log(
  project(
  {x:1,y:2,z:3},
  {x:1,y:2,z:6},
  {x:1,y:3,z:6},
  {x:2,y:3,z:6},
  )); // {x:1,y:2,z:6}
  */

const initialState = {
  cubeRotation: new THREE.Euler(),
  fov: 30,
  cameraX: 10,
  cameraZ: 0,
  rot: 0,
  distance: 10,
  hardCodedItems: [
    {
      center: new THREE.Vector3(1, 2, 0),
      radius: .5,
      type: 'Sphere',
    }
  ],
};

export class Canvas extends Component {
  constructor(props, context) {
    super(props, context);

    // construct the position vector here, because if we use 'new' within render,
    // React will think that things have changed when they have not.

    this.state = initialState;
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
    this.fog = new THREE.Fog(0x001525, 10, 15);

    this.lightPosition = new THREE.Vector3(0, 500, 2000);
    this.lightTarget = new THREE.Vector3(0, 0, 0);
    this.groundQuaternion = new THREE.Quaternion()
      .setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
    this.spherePosition = new THREE.Vector3(0, 3, 0);
    this.cameraQuaternion = new THREE.Quaternion()
      .setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
  }

  reset() {
    this.setState(initialState);
  }

  zoom(delta) {
    this.setState(({distance}) => ({ distance: distance + delta * 0.05}));
  }

  rotateCamera(delta) {
    delta *= 0.03;

    this.setState(({cameraX, cameraZ, rot, distance}) => ({
      cameraX: Math.cos(rot + delta) * distance,
      cameraZ: Math.sin(rot + delta) * distance,
      rot: rot + delta,
    }));
  }

  renderLight() {
    const d = 20;
    return (
      <group>
        <directionalLight
          color={0xffffff}
          intensity={2.0}

          castShadow

          shadowMapWidth={1024}
          shadowMapHeight={1024}

          shadowCameraLeft={-d}
          shadowCameraRight={d}
          shadowCameraTop={d}
          shadowCameraBottom={-d}

          shadowCameraFar={3 * d}
          shadowCameraNear={d}

          position={new THREE.Vector3(0, 500, 2000)}
          lookAt={new THREE.Vector3(-100, 100, 0)}
        />
        {/*
        <directionalLight
          color={0xffffff}
          intensity={1}

          castShadow

          shadowMapWidth={1024}
          shadowMapHeight={1024}

          shadowCameraLeft={-d}
          shadowCameraRight={d}
          shadowCameraTop={d}
          shadowCameraBottom={-d}

          shadowCameraFar={3 * d}
          shadowCameraNear={d}

          position={new THREE.Vector3(1000, 1000, -100)}
          lookAt={new THREE.Vector3(-100, 100, 0)}
        /> */}
        <ambientLight
          intensity={0.2}
          position={new THREE.Vector3(10, 10, 10)}
          lookAt={new THREE.Vector3(0, 0, 0)}
        />
        <pointLight
          intensity={1.0}
          position={new THREE.Vector3(100, -100, -100)}
        />

      </group>
    );
  }

  renderSphere(item) {
	  item['opacity'] = 0.1;
	  return this.renderSphereInternal(item);
  }

  renderCursor(cursor) {
	  var sphere = {
  		color: 0xdddddd,
  		opacity: .8,
  		center: cursor,
  		radius: 0.1,
	  }
	  return this.renderSphereInternal(sphere);
  }

  renderMarker(item) {
    item['opacity'] = 0.7;
	  return this.renderSphereInternal(item);
  }

  renderSphereInternal(item) {
    return (
      <mesh
        castShadow
        position={item['center']}
      >
        <sphereGeometry
          radius={item['radius']}
          widthSegments = {20}
          heightSegments = {20}
        />
        <meshPhongMaterial
          color={item['color']}
  		    opacity={item['opacity']}
          shininess={20}
        />
      </mesh>
    );
  }

  renderTrace(item) {
    const vertices = item.points.map(({x,y,z}) => new THREE.Vector3(x,y,z));
    return (
        <line>
          <geometry vertices={vertices}/>
          <lineBasicMaterial color={item.color} />
        </line>
    );
  }

  renderObject(item) {
    if (!item['color'] || item['color'] == GHOST_COLOR) {
      item['color'] = randomColor();
    }
	  item['opacity'] = 0.7;
	  return this['render' + item.type](item);
  }

  renderCurrentItem(item) {
	  if(item) {
	    item['color'] = GHOST_COLOR;
  		item['opacity'] = 0.5;
  		return this['render' + item.type](item);
	  }
  }

  renderPolygon(polygon) {
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
        item => (this.renderObject(item))
      )
    );
  }

  render() {
    const {
      width,
      height,
      items,
	    currentItem,
	    cursor
    } = this.props;

    const { cameraX, cameraZ } = this.state;
    this.cameraPosition = new THREE.Vector3(cameraX, 2, cameraZ);

    // or you can use:
    // width = window.innerWidth
    // height = window.innerHeight

    return (
      <React3
        antialias
        mainCamera='camera' // this points to the perspectiveCamera below
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
            name='camera'

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

        { this.renderLight() }
        { this.renderObjects(items) }
        { this.renderCursor(cursor) }
        { this.renderCurrentItem(currentItem) }
      </scene>
    </React3>
    );
  }
}
