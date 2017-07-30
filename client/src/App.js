import React, { Component } from 'react';
import classnames from 'classnames';
import KeyHandler, {KEYDOWN} from 'react-key-handler';
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
  }

  onSelectView(view) {
    console.log('onSelectView', view);
    this.setState({view});
    this.socket.emit('setview', view);
  }

  onSendPoint(point) {
    this.socket.emit('setpoints', point, new Date(), this.state.view);
  }

  changeMode(mode) {
    this.setState({ mode });
  }

  sendClick() {}
  sendSubmit() {}
  sendCancel() {}

  renderOptions(view, mode) {
    return (
      <div>
        <h4>Mode</h4>
        <Button text="Trace [1]" selected={mode === 'trace'} onSelect={() => this.changeMode('trace')}/>
        <Button text="Polyhedron [2]" selected={mode === 'polyhedron'} onSelect={() => this.changeMode('polyhedron')}/>
        <Button text="Sphere [3]" selected={mode === 'sphere'} onSelect={() => this.changeMode('sphere')}/>
        <br />
        <h4>Controls</h4>
        <Button text="Click [Q]"  onSelect={() => {this.sendClick()}} ref="clickButton" flashy={true}/>
        <Button text="Submit [W]"  onSelect={() => {this.sendSubmit()}} ref="submitButton" flashy={true}/>
        <Button text="Cancel [E]"  onSelect={() => {this.sendCancel()}} ref="cancelButton" flashy={true}/>
        <br />
        <h4>View</h4>
        <ViewSelector
          view={this.state.view}
          onSelect={this._onSelectView}
          />
      </div>
    );
  }

  renderKeybindings() {
    return (
      <div>
        <KeyHandler keyEventName={KEYDOWN} keyValue="1" onKeyHandle={() => this.changeMode('trace')} />
        <KeyHandler keyEventName={KEYDOWN} keyValue="2" onKeyHandle={() => this.changeMode('polyhedron')} />
        <KeyHandler keyEventName={KEYDOWN} keyValue="3" onKeyHandle={() => this.changeMode('sphere')} />
          <KeyHandler keyEventName={KEYDOWN} keyValue="q" onKeyHandle={() => this.refs.clickButton.focus() || this.refs.clickButton.click()}/>
            <KeyHandler keyEventName={KEYDOWN} keyValue="w" onKeyHandle={() => this.refs.submitButton.focus() || this.refs.submitButton.click()}/>
              <KeyHandler keyEventName={KEYDOWN} keyValue="e" onKeyHandle={() => this.refs.cancelButton.focus() || this.refs.cancelButton.click()}/>
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

  renderCanvas() {
    return (
      <Canvas width={500} height={500} items={this.state.items}/>
    );
  }

  render() {
    const { debug, items, view, mode } = this.state;

    return (
      <div className={classnames({
        'dbg': debug
      })}>
        { this.renderKeybindings() }
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
          { this.renderOptions(view, mode) }
        </div>
        <div className="col-sm-4 early-column">
          <h3>Webcam</h3>
          { this.renderWebcam() }
        </div>
        <div className="col-sm-6 end-column">
          <h3>Your Sketch</h3>
          { this.renderCanvas() }
        </div>
      </div>
    </div>
    );
  }
}

export default App;
