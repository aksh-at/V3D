import React, { Component } from 'react';
import classnames from 'classnames';
import { Sketch } from './components';
import io from 'socket.io-client';
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

  render() {
    const { debug, items } = this.state;

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
          <div className="webcam">
            <span>WEBCAM</span>
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
