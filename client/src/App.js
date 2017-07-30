import React, { Component } from 'react';
import classnames from 'classnames';
import { Canvas, ViewSelector, Webcam, Sim, Button } from './components';
import io from 'socket.io-client';
import './App.css';

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
      view: 'main',
      mode: 'polyhedron',
      realWebcam: true,
    }

    this._onSelectView = this.onSelectView.bind(this);
    this._onSendPoint = this.onSendPoint.bind(this);
    this.socket = io('http://localhost:3001'); 

	this.socket.on('items', (items) => {
		console.log('items: ' + items);
		this.setState({items});
	});
  }

  onSelectView(view) {
    console.log('onSelectView', view);
    this.setState({view});
    this.socket.emit('setview', view);
  }

  onSendPoint(point) {
    this.socket.emit('setpoints', point, new Date(), this.state.view);
  }

  selectButton() {
    return;
  }

  renderOptions(view) {
    return (
      <div>
        <h4>View</h4>
        <ViewSelector
          view={view}
          onSelect={this._onSelectView}
        />
        <br />
        <h4>Mode</h4>
        <Button text="Trace" selected={false} onSelect={this.selectButton}/>
        <Button text="Polyhedron" selected={true} onSelect={this.selectButton}/>
        <Button text="Sphere" selected={false} onSelect={this.selectButton}/>
      </div>
    );
  }

  renderWebcam() {
    const { realWebcam } = this.state;
    const camEl = realWebcam
          ? <Webcam onSend={this._onSendPoint}/>
          : <Sim width={400} height={400} onSend={this._onSendPoint} />;
    const change = e => {
      e.preventDefault();
      this.setState({realWebcam: !realWebcam});
    };

    return (
      <div className="main">
        <a href={"#"+realWebcam?'sim':'cam'} onClick={change}>Switch to Simulator vs Webcam</a>
        {camEl}
      </div>
    );
  }

  renderCanvas(items) {
    return (
      <Canvas width={500} height={500} items={items}/>
    );
  }

  render() {
    const { debug, items, view } = this.state;

    return (
      <div className={classnames({
        'dbg': debug
      })}>
      <a
        className={classnames({
          'debug-link': 1,
          'on': debug,
        })}
        onClick={() => {
          this.setState({
            debug: !debug
          })
        }}
      >
        debug: { debug ? 'ON' : 'OFF'}
      </a>

      <div className="row">
        <div className="col-sm-2 early-column">
          <h3>Options</h3>
          { this.renderOptions(view) }
        </div>
        <div className="col-sm-5 early-column">
          <h3>Webcam</h3>
          { this.renderWebcam() }
        </div>
        <div className="col-sm-5 end-column">
          <h3>Your Sketch</h3>
          { this.renderCanvas(items) }
        </div>
      </div>
    </div>
    );
  }
}

export default App;
