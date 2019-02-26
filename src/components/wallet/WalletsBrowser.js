import React from 'react';
import PropTypes from 'prop-types';
import Wallet, { walletPropTypes } from './Wallet';
import Swipeable from '../common/Swipeable';
import WalletsNav from './WalletsNav';

const styles = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }
};

const WalletsBrowser = ({
  selectedWalletIndex,
  wallets,
  handleChangeSelectedWalletSwipeable,
  handleChangeSelectedWalletButton
}) => {
  return (
    <div style={styles.container}>
      <Swipeable
        index={selectedWalletIndex}
        handleChangeIndex={handleChangeSelectedWalletSwipeable}
      >
        {wallets.map(wallet => (
          <Wallet
            key={wallet.currencyCode}
            currencyCode={wallet.currencyCode}
            currencyName={wallet.currencyName}
            amount={wallet.amount}
          />
        ))}
      </Swipeable>
      <WalletsNav
        selectedWalletIndex={selectedWalletIndex}
        wallets={wallets}
        handleChangeSelectedWalletButton={handleChangeSelectedWalletButton}
      />
    </div>
  );
};

WalletsBrowser.propTypes = {
  selectedWalletIndex: PropTypes.number.isRequired,
  wallets: PropTypes.arrayOf(
    PropTypes.shape({
      ...walletPropTypes
    })
  ).isRequired,
  handleChangeSelectedWalletSwipeable: PropTypes.func.isRequired,
  handleChangeSelectedWalletButton: PropTypes.func.isRequired
};

export default WalletsBrowser;
