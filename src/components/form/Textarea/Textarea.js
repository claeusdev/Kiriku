import React from 'react';
import { FormControl, ControlLabel } from 'react-bootstrap';
import './style.css';

const TextInput = ({ label, rows, columns, ...rest}) => {
  const inputProps = {
    ...rest,
    componentClass: 'textarea',
  };

  if (rows) {
    inputProps.rows = rows;
  }

  if (columns) {
    inputProps.columns = columns;
  }

  return (
    <div className="Textarea">
      {label && <ControlLabel>{label}</ControlLabel>}
      <FormControl {...inputProps} />
    </div>
  );
};

export default TextInput;
