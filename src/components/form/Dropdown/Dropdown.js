import React from 'react';
import { FormControl, ControlLabel } from 'react-bootstrap';
import './style.css';

const Dropdown = ({ label, placeholder, options, ...rest}) => {
  const selectProps = {
    componentClass: 'select',
    ...rest
  };

  const optionsList = options.map((option, index) => {
    return (
      <option key={index} value={option.value}>{option.label}</option>
    );
  });

  return (
    <div className="Dropdown">
      {label && <ControlLabel>{label}</ControlLabel>}

      <FormControl {...selectProps}>
        {placeholder && <option value="">{placeholder}</option>}
        {optionsList}
      </FormControl>
    </div>
  );
};

export default Dropdown;
