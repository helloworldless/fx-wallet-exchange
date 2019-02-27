import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { bindKeyboard } from 'react-swipeable-views-utils';

const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews);

const Swipeable = ({
  keyboardEnabled = true,
  children,
  index,
  handleChangeIndex
}) => {
  return keyboardEnabled ? (
    <BindKeyboardSwipeableViews
      index={index}
      onChangeIndex={handleChangeIndex}
      style={{ cursor: 'pointer' }}
      enableMouseEvents
    >
      {children}
    </BindKeyboardSwipeableViews>
  ) : (
    <SwipeableViews
      index={index}
      onChangeIndex={handleChangeIndex}
      style={{ cursor: 'pointer' }}
      enableMouseEvents
    >
      {children}
    </SwipeableViews>
  );
};

Swipeable.propTypes = {
  keyboardEnabled: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  index: PropTypes.number.isRequired,
  handleChangeIndex: PropTypes.func.isRequired
};

export default bindKeyboard(Swipeable);
