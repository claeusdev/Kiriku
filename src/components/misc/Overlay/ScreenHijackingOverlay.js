import React, { Component } from 'react';
import './style.css';

class ScreenHijackingOverlay extends Component {
  render() {
    return (
      <div className="page-overlay hijack">
        <div className="content">
          {this.props.children}
        </div>
      </div>
    );
  }
};

export default ScreenHijackingOverlay;
