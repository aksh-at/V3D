import React, { Component } from 'react';
import classnames from 'classnames';
import { Sketch, ViewSelector, Webcam } from './components';
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
      view: null,
    }

    this._onSelectView = this.onSelectView.bind(this);
    this.socket = io('http://localhost:3001');
  }

  onSelectView(view) {
    this.setState({view});
    this.socket.emit('setview', view);
  }

  render() {
    const { debug, items, view } = this.state;

    return (
      <div
        className={classnames({
          "App": 1,
          "dbg": debug,
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
          }} >
          debug: { debug ? 'ON' : 'OFF'}
        </a>
        <div className="main">
          <ViewSelector
            view={view}
            onSelect={this._onSelectView}
          />
          <div className="webcam">
            <Webcam/>
          </div>
          <Sketch items={items}/>
          <div className="tools">
            TOOLS
          </div>
        </div>
      </div>
    );
  }
}

export default App;
