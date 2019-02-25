import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import WalletsBrowser from './WalletsBrowser';
import { walletPropTypes } from './Wallet';

class WalletsContainer extends PureComponent {
  state = { selectedWalletIndex: 0, wallets: [] };

  handleChangeSelectedWalletSwipeable = selectedWalletIndex => {
    this.setState({
      selectedWalletIndex
    });
  };

  handleChangeSelectedWalletButton = event => {
    const selectedWalletIndex = event.currentTarget.getAttribute('data-index');
    console.log('index', selectedWalletIndex);
    const parsedIndex = parseInt(selectedWalletIndex, 10);
    console.log('parsedIndex', parsedIndex);
    this.setState({
      selectedWalletIndex: parsedIndex
    });
  };

  render() {
    const { wallets } = this.props;
    const { selectedWalletIndex } = this.state;
    return (
      <div style={{ margin: '1rem', textAlign: 'center' }}>
        {wallets.length > 0 ? (
          <WalletsBrowser
            selectedWalletIndex={selectedWalletIndex}
            wallets={wallets}
            handleChangeSelectedWalletSwipeable={
              this.handleChangeSelectedWalletSwipeable
            }
            handleChangeSelectedWalletButton={
              this.handleChangeSelectedWalletButton
            }
          />
        ) : (
          'Loading wallets...'
        )}
      </div>
    );
  }
}

WalletsContainer.propTypes = {
  wallets: PropTypes.arrayOf(
    PropTypes.shape({
      ...walletPropTypes
    })
  ).isRequired
};

const mapStateToProps = state => {
  debugger;
  return { wallets: state.wallets };
};

export default connect(mapStateToProps)(WalletsContainer);
