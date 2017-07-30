import React, { Component } from 'react';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import { project, convert } from '../geometry';

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
export class Canvas extends Component {
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

	this.polygons = [];
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

  componentDidMount() {
	console.log(this.polygons);
	for(let i = 0; i<this.polygons.length; i++) {
		console.log("normals wehee");
		this.polygons[i].computeFaceNormals();
	}
  }

  renderPointLight() {
    const d = 200;
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

  renderPolygon(item) {
    item['color'] = 0x00ff00;

	var vertices = [];
	var faces = [];

	function shift(i, j) {
		return (i + j) % item.points.length;
	}

	for (let i = 0; i < item.points.length; i++) {
		vertices.push(item.points[i]);
		faces.push(new THREE.Face3(i, shift(i,1), shift(i,2)));
		faces.push(new THREE.Face3(i, shift(i,2), shift(i,1)));
	}

    return (
	<group>
      <mesh 
        castShadow
      >
        <geometry
		  ref = { (r) => this.polygons.push(r) }
		  vertices={vertices}
		  faces={faces}
        />
        <meshPhongMaterial
          color={0x0000ff}
		  wireframe={true}
        />
      </mesh>
      <mesh 
        castShadow
      >
        <geometry
		  vertices={vertices}
		  faces={faces}
        />
        <meshPhongMaterial
          color={item["color"]}
        />
      </mesh> 
		</group>
    );
  }

  renderSphere(item) {
    item['opacity'] = 0.7;
    return this.renderSphereInternal(item);
  }

  renderCursor(cursor) {
    var sphere = {
      color: 0x0000ff,
      opacity: 1,
      center: cursor,
      radius: 0.1,
    }
    return this.renderSphereInternal(sphere);
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

  renderObject(item) {
    item['color'] = 0x00ff00;
    item['opacity'] = 1;
    return this['render' + item.type](item);
  }

  renderCurrentItem(item) {
    if(item) {
      item['color'] = 0xff0000;
      item['opacity'] = 0.5;
      return this['render' + item.type](item);
    }
  }

  renderExtrusion(extrusion) {
    var {
      phase, // either 'base' or 'up'
      basePoints,
      heightVector
    } = extrusion;

	if (phase == "base") {
	  return basePoints.map(point => this.renderCursor(point));
	} else {
		basePoints = basePoints.map(point => convert(point));
		var transPoints = basePoints.map(point => convert(point).add(heightVector));
		var vertices = basePoints.concat(transPoints);
		var olen = basePoints.length;

		function next(i) {
			return (i + 1) % olen;
		}

		const getPolygon = (verts) => {
			return this.renderPolygon({ points: verts.map(vert=>vertices[vert])});
		}

		var ret = []
		for(let i = 0; i < olen; i++) {
		ret.push(getPolygon([i, next(i), next(i) + olen, i + olen]));
		}

		ret.push(this.renderPolygon({ points: basePoints}));
		ret.push(this.renderPolygon({ points: transPoints}));

		return ret;
	}
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
        { this.renderCursor(cursor) }
        { this.renderCurrentItem(currentItem) }
		{ this.renderExtrusion( {
			basePoints: [ 
				{x: 0, y: 1, z: 0},
				{x: 2, y: 1, z: 0},
				{x: 1, y: 2, z: 3}, ],
			heightVector: {x: 0, y: 2, z: 0},
	    }) }
      </scene>
    </React3>
    );
  }
}
