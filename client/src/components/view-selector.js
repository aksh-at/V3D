import React, { Component } from 'react';
import classnames from 'classnames';
import './view-selector.css';

export class ViewSelector extends Component {
  constructor() {
    super();
  }

  render() {
    const { view, onSelect } = this.props;

    return (
      <div className='view-selector'>
        <span>
          Current View:{' '}
          <b>
            { view || 'None' }
          </b>
        </span>
        <div className='buttons'>
          {['main', 'side'].map((viewStr, i) => (
            <button
              key={i}
              className={classnames({
                selected: viewStr === view
              })}
              onClick={()=>{
                onSelect(viewStr);
              }}
            >
              {viewStr}
            </button>
          ))}
        </div>
      </div>
    );
  }
}

