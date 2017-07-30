import React, { Component } from 'react';
import classnames from 'classnames';
import { Sketch } from './components/Sketch';
import { Button } from './components/Button';
import io from 'socket.io-client';
import logo from './logo.svg';
import './App.css';

const socket = io('http://localhost:3001');
socket.emit('frame', [1, 2, 'hello']);
class App extends Component {
  constructor() {
    super();
    this.state = {
      debug: false,
      items: [{
        type: 'circle',
        cx: 20,
        cy: 20,
        radius: 20,
      }],
    }
  }

  selectButton() {
    return;
  }

  renderOptions() {
    return (
      <div>
        <h4>Screen</h4>
        <Button text="Main" selected={true} onSelect={this.selectButton}/>
        <Button text="Side" selected={false} onSelect={this.selectButton}/>
        <br />
        <h4>Mode</h4>
        <Button text="Trace" selected={false} onSelect={this.selectButton}/>
        <Button text="Polyhedron" selected={true} onSelect={this.selectButton}/>
        <Button text="Sphere" selected={false} onSelect={this.selectButton}/>
      </div>
    );
  }

  renderWebcam() {
    return (
      <span>
        Lol webcam goes here
      </span>
    );
  }

  renderCanvas(items) {
    return (
      <Sketch items={items}/>
    );
  }

  render() {
    const { debug, items } = this.state;

    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-2 column">
            <h3>Options</h3>
            { this.renderOptions() }
          </div>
          <div className="col-sm-4 column">
            <h3>Webcam</h3>
            { this.renderWebcam() }
          </div>
          <div className="col-sm-4 end-column">
            <h3>Your Sketch</h3> 
            { this.renderCanvas(items) }
          </div>
        </div>
      </div>
    );

    // return (
    //   <div
    //     className={classnames({
    //       "App": 1,
    //       "dbg": debug,
    //     })}>
    //     <a
    //       className={classnames({
    //         'debug-link': 1,
    //         'on': debug,
    //       })}
    //       onClick={() => {
    //         this.setState({
    //           debug: !debug
    //         })
    //       }} >
    //       debug: { debug ? 'ON' : 'OFF'}
    //     </a>
    //     <div className="main">
    //       <div className="webcam">
    //         <span>WEBCAM</span>
    //       </div>
    //       <Sketch items={items}/>
    //       <div className="tools">
    //         TOOLS
    //       </div>
    //     </div>
    //   </div>
    // );
  }
}

export default App;
