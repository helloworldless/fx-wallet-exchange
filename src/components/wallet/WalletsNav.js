import React from 'react';
import PropTypes from 'prop-types';
import NavButton from '../common/NavButton';
import { walletPropTypes } from './Wallet';
import { FiberManualRecord } from '@material-ui/icons';

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

const WalletsNav = ({
  selectedWalletIndex,
  wallets,
  handleChangeSelectedWalletButton
}) => {
  return (
    <div style={styles.container}>
      {wallets.map((wallet, i) => (
        <NavButton
          key={wallet.currencyCode}
          index={i}
          handleClick={handleChangeSelectedWalletButton}
        >
          {i === selectedWalletIndex ? ActiveIcon : InactiveIcon}
        </NavButton>
      ))}
    </div>
  );
};

WalletsNav.propTypes = {
  selectedWalletIndex: PropTypes.number.isRequired,
  wallets: PropTypes.arrayOf(
    PropTypes.shape({
      ...walletPropTypes
    })
  ).isRequired,
  handleChangeSelectedWalletButton: PropTypes.func.isRequired
};

export default WalletsNav;
