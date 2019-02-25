import React from 'react';
import PropTypes from 'prop-types';
import Wallet, { walletPropTypes } from './Wallet';
import Swipeable from '../common/Swipeable';
import NavigationalButton from '../common/NavigationalButton';

const WalletsBrowser = ({
  selectedWalletIndex,
  wallets,
  handleChangeSelectedWalletSwipeable,
  handleChangeSelectedWalletButton
}) => {
  return (
    <div>
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
      <div>
        {wallets.map((wallet, i) => (
          <NavigationalButton
            key={wallet.currencyCode}
            isActive={selectedWalletIndex === i}
            index={i}
            handleClick={handleChangeSelectedWalletButton}
          />
        ))}
      </div>
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
