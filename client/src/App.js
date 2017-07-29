import React, { Component } from 'react';
import classnames from 'classnames';
import { Sketch } from './components';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      debug: false
    }
  }

  render() {
    const { debug } = this.state;

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
          <Sketch/>
          <div className="tools">
            TOOLS
          </div>
        </div>
      </div>
    );
  }
}

export default App;
