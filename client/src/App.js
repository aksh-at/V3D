import React, { Component } from 'react';
import classnames from 'classnames';
import KeyHandler, {KEYDOWN} from 'react-key-handler';
import { Art, ViewSelector, Webcam, Sim, Button } from './components';
import io from 'socket.io-client';
import './App.css';


class App extends Component {
  constructor() {
    super();
    this.state = {
      debug: false,
      view: 'main',
      realWebcam: true,
    }

    this._onSelectView = this.onSelectView.bind(this);
    this._onSendPoint2D = this.onSendPoint2D.bind(this);
    this.socket = io('http://localhost:3001');
    this.socket.on('point', point3D => {
      this.setState({point3D}, () => {
        this.onHover(point3D);
      });
    });
  }

  onClick() {
    const art = this.refs.art;
    if (!art) return;
    const { point3D } = this.state;
    art.onClick(point3D);
  }

  onCancel() {
    const art = this.refs.art;
    const { point3D } = this.state;
    art.onClick(point3D);
  }

  onCommit() {
    const art = this.refs.art;
    art.onCommit();
  }

  onHover() {
    const art = this.refs.art;
    const { point3D } = this.state;
    art.onHover(point3D);
  }

  onSelectView(view) {
    console.log('onSelectView', view);
    this.setState({view});
    this.socket.emit('setview', view);
  }

  onSendPoint2D(point2D) {
    this.socket.emit('setpoints', point2D, new Date(), this.state.view);
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
        <Button text="Click [Q]"  onSelect={() => {this.onClick()}} ref="clickButton" flashy={true}/>
        <Button text="Commit [W]"  onSelect={() => {this.onCommit()}} ref="submitButton" flashy={true}/>
        <Button text="Cancel [E]"  onSelect={() => {this.onCancel()}} ref="cancelButton" flashy={true}/>
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
      ? <Webcam onSend={this._onSendPoint2D}/>
      : <Sim width={400} height={400} onSend={this._onSendPoint2D} />;
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
          <Art ref="art"/>
        </div>
      </div>
    </div>
    );
  }
}

export default App;
