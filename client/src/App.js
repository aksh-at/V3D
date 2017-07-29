import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="webcam">
          <span>WEBCAM</span>
        </div>
        <div className="sketch">
          SKETCH
        </div>
        <div className="tools">
          TOOLS
        </div>
      </div>
    );
  }
}

export default App;
