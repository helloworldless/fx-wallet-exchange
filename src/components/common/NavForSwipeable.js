import React from 'react';
import PropTypes from 'prop-types';
import NavButton from '../common/NavButton';
import { FiberManualRecord } from '@material-ui/icons';
import { KeyItemPropType } from './NavButton';

const styles = { container: { margin: '1rem' } };

const ActiveIcon = (
  <FiberManualRecord
    style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 1)' }}
  />
);

const InactiveIcon = (
  <FiberManualRecord
    style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.4)' }}
  />
);

const NavForSwipeable = ({ selectedIndex, itemKeys, handleChangeSelected }) => {
  return (
    <div style={styles.container}>
      {itemKeys.map((itemKey, i) => (
        <NavButton
          key={itemKey}
          index={i}
          itemKey={itemKey}
          handleClick={handleChangeSelected}
        >
          {i === selectedIndex ? ActiveIcon : InactiveIcon}
        </NavButton>
      ))}
    </div>
  );
};

NavForSwipeable.propTypes = {
  selectedIndex: PropTypes.number.isRequired,
  itemKeys: PropTypes.arrayOf(KeyItemPropType).isRequired,
  handleChangeSelected: PropTypes.func.isRequired
};

export default NavForSwipeable;
