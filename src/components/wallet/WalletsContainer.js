import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import WalletsBrowser from './WalletsBrowser';
import { walletPropTypes } from './Wallet';

const margin = '1rem';
const styles = { container: { margin, height: `calc(100vh - 2 * ${margin})` } };

class WalletsContainer extends PureComponent {
  state = { selectedWalletIndex: 0, wallets: [] };

  handleChangeSelectedWalletSwipeable = selectedWalletIndex => {
    this.setState({
      selectedWalletIndex
    });
  };

  handleChangeSelectedWalletButton = event => {
    const selectedWalletIndex = event.currentTarget.getAttribute('data-index');
    const parsedIndex = parseInt(selectedWalletIndex, 10);
    this.setState({
      selectedWalletIndex: parsedIndex
    });
  };

  render() {
    const { wallets, error } = this.props;
    const { selectedWalletIndex } = this.state;

    return (
      <div style={styles.container}>
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
        ) : error ? (
          <div>An error occurred.</div>
        ) : (
          <div>Loading wallets...</div>
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
  ).isRequired,
  error: PropTypes.string
};

const mapStateToProps = state => {
  return { wallets: state.wallets, error: state.walletsError };
};

export default connect(mapStateToProps)(WalletsContainer);
