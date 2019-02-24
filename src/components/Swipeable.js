import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';

const Swipeable = ({ children }) => (
  <SwipeableViews style={{ cursor: 'pointer' }} enableMouseEvents>
    {children}
  </SwipeableViews>
);

Swipeable.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

export default Swipeable;
