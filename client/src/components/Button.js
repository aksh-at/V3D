import React, { Component } from 'react';

export class Button extends Component {
  	render() {
  		var classes = "btn";
  		if (this.props.selected) {
  			classes += " btn-info active"
  		}

  		return (
  			<div className="option-button">
  				<button type="button" 
            className={classes} 
            onClick={()=>{this.props.onSelect(this.props.text);}}
          >
  					{ this.props.text }
  				</button>
  			</div>
  		);
  	}
}
