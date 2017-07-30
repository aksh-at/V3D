import React, { Component } from 'react';

export class Button extends Component {
  click() {
    this.refs.button.click();
  }

  focus() {
    this.refs.button.focus();
  }

  render() {
    var classes = "btn";
    if (this.props.selected) {
      classes += " btn-info active"
    }

    if (this.props.flashy) {
      classes += " flashy";
    }

    return (
      <div className="option-button">
        <button type="button"
                className={classes}
                ref="button"
                onClick={()=>{this.props.onSelect(this.props.text);}}
          >
          { this.props.text }
        </button>
      </div>
    );
  }
}
