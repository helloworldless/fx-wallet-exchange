import React from 'react';
import PropTypes from 'prop-types';

export const KeyItemPropType = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.string
]);

const NavButton = ({ index, itemKey, children, handleClick }) => {
  return (
    <button
      className="button-nostyle"
      value={itemKey}
      data-index={index}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

NavButton.propTypes = {
  index: PropTypes.number.isRequired,
  itemKey: KeyItemPropType.isRequired,
  children: PropTypes.node.isRequired,
  handleClick: PropTypes.func.isRequired
};

export default NavButton;
