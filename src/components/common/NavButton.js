import React from 'react';
import PropTypes from 'prop-types';

const NavButton = ({ index, children, handleClick }) => {
  return (
    <button className="button-nostyle" data-index={index} onClick={handleClick}>
      {children}
    </button>
  );
};

NavButton.propTypes = {
  index: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  handleClick: PropTypes.func.isRequired
};

export default NavButton;
