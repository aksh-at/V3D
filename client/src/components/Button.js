import React, { Component } from 'react';

export class Button extends Component {
  	constructor(props) {
	    super();
	    this.state = {
	    	selected: props.selected,
	    };
  	}

  	render() {
  		var classes = "btn";
  		if (this.state.selected) {
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

  	selectButton() {
  		this.setState({
  			selected: true,
  		})
  	}

  	deselectButton() {
  		this.setState({
  			selected: false,
  		})
  	}
}