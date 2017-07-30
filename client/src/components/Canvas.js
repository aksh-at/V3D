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

    this.cameraPosition = new THREE.Vector3(0, 0, 1);

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

    this._raycaster = new THREE.Raycaster();
    this.fog = new THREE.Fog(0x001525, 10, 20);

    this.lightPosition = new THREE.Vector3(0, 500, 2000);
    this.lightTarget = new THREE.Vector3(0, 0, 0);
    this.groundQuaternion = new THREE.Quaternion()
      .setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
    this.cameraPosition = new THREE.Vector3(10, 2, 0);
    this.spherePosition = new THREE.Vector3(0, 3, 0);
    this.cameraQuaternion = new THREE.Quaternion()
      .setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);

    this.state.items = {
      polygons: [],
      spheres: [],
      markers: [],
      lines: [],
      aid_spheres: [],
    };
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
      <mesh 
    		castShadow
    		position={this.spherePosition}
    		// rotation={this.state.cubeRotation}
      >
        <sphereGeometry
          radius={.5}
    		  widthSegments = {10}
    		  heightSegments = {10}
        />
        <meshPhongMaterial
  		    color={0x00ff00}
  	    />
      </mesh>
    );
  }

  renderPolygon(polygon) {

  }

  renderObjects(items) {
    return (<group>
      {items.polygons.map(
        polygon => (this.renderPolygon(polygon))
      )}
      {items.spheres.map(
        sphere => (this.renderSphere(sphere))
      )}
      {items.markers.map(
        marker => (this.renderMarker(marker))
      )}
      {items.lines.map(
        line => (this.renderLine(line))
      )}
      {items.aid_spheres.map(
        sphere => (this.renderSphere(sphere))
      )}
    </group>);
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

      		  fov={30}
        		aspect={width / height}
        		near={0.5}
        		far={10000}

      		  position={this.cameraPosition}
      		  quaternion={this.cameraQuaternion}
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

          { this.renderObjects(this.state.items) }
          { this.renderPointLight() }
          { this.renderSphere() }

        </scene>
      </React3>
    );
  }
}
