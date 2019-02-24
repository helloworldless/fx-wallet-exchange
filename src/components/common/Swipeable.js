import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { bindKeyboard } from 'react-swipeable-views-utils';

const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews);

const Swipeable = ({ children, index, handleChangeIndex }) => {
  return (
    <BindKeyboardSwipeableViews
      index={index}
      onChangeIndex={handleChangeIndex}
      style={{ cursor: 'pointer' }}
      enableMouseEvents
    >
      {children}
    </BindKeyboardSwipeableViews>
  );
};

Swipeable.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  index: PropTypes.number.isRequired,
  handleChangeIndex: PropTypes.func.isRequired
};

export default bindKeyboard(Swipeable);
