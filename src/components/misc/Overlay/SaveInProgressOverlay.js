import React from 'react';
import ScreenHijackingOverlay from './ScreenHijackingOverlay';
import { MovingEllipsis } from '../Ellipsis';
import './style.css';

const SaveInProgressOverlay = () => {
  return (
    <ScreenHijackingOverlay>
      <h4>One moment. We're saving your data<MovingEllipsis /></h4>
    </ScreenHijackingOverlay>
  );
};

export default SaveInProgressOverlay;
