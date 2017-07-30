import React, { Component } from 'react';
import { Button } from './Button';
import './ViewSelector.css';

export class ViewSelector extends Component {
  render() {
    const { view, onSelect } = this.props;

    return (
      <div className='view-selector'>
        <div className='buttons'>
          <Button text='main' selected={view === 'main'} onSelect={onSelect} />
          <Button text='side' selected={view === 'side'} onSelect={onSelect} />
        </div>
      </div>
    );
  }
}

