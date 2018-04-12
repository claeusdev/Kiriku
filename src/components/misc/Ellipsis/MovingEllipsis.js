import React, { Component } from 'react';
import './style.css';

class MovingEllipsis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfDots: 3
    };

    this.updateDots = this.updateDots.bind(this);
  }

  updateDots() {
    const { numberOfDots } = this.state;
    const updateNumberOfDots = numberOfDots < 3 ? numberOfDots + 1 : 0;
    this.setState({ numberOfDots: updateNumberOfDots});
  }

  componentWillMount() {
    this.interval = window.setInterval(this.updateDots, 500);
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
  }

  render() {
    let dots = [];
    for(var i = 1; i <= this.state.numberOfDots; i++) {
      dots.push('.');
    }
    dots = dots.join('');
    return (
      <span className="MovingEllipsis">{dots}</span>
    );
  }
};

export default MovingEllipsis;
