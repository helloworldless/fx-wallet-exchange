import React from 'react';
import PropTypes from 'prop-types';
import {
  FiberManualRecord,
  FiberManualRecordOutlined
} from '@material-ui/icons';

const NavigationalButton = ({ isActive, index, handleClick }) => {
  return (
    <button className="button-nostyle" data-index={index} onClick={handleClick}>
      {isActive ? <FiberManualRecord /> : <FiberManualRecordOutlined />}
    </button>
  );
};

NavigationalButton.propTypes = {
  isActive: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired
};

export default NavigationalButton;
