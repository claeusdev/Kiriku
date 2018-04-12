import React from 'react';
import { ControlLabel } from 'react-bootstrap';
import './style.css';

const ColorPicker = ({ 
  label,
  selected = '#000000',
  uniqueIdentier = Math.random(),
  onChange,
  disabled
}) => {

  const pickerStyle = {
    backgroundColor: selected,
  };

  const handleColorInputValueChange = (evt) => {
    onChange(evt.target.value);
  }

  const openColorPicker = () => {
    if (!disabled) {
      document.querySelector(`#hidden-color-input-${uniqueIdentier}`).click()
    }
  };

  return (
    <div className="ColorPicker">
      {label && <ControlLabel>{label}</ControlLabel>}
      <div className="picker-box">
        <div className="faux-picker" style={pickerStyle} onClick={openColorPicker}></div>
        <div className="current-color-value">{selected}</div>
        <input id={`hidden-color-input-${uniqueIdentier}`} className="hidden-color-input" type="color" name="favcolor" value={selected} onChange={handleColorInputValueChange} />
      </div>
    </div>
  );
};

export default ColorPicker;