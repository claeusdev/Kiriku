import React from 'react';
import { FormControl, ControlLabel } from 'react-bootstrap';
import './style.css';

const TextInput = ({ label, ...rest}) => {
  return (
    <div className="TextInput">
      {label && <ControlLabel>{label}</ControlLabel>}
      <FormControl {...rest} />
    </div>
  );
};

export default TextInput;
