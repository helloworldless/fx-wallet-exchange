import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import WalletsBrowser from './WalletsBrowser';
import { walletPropTypes } from './Wallet';
import { loadWallets } from '../../actions/walletsActions';
import { loadExchangeHistory } from '../../actions/exchangeHistoryActions';
import { formatCurrency } from '../../utils/util';
import { mockUserId } from '../../data/mockData';

class WalletsContainer extends PureComponent {
  state = { userId: mockUserId, selectedWalletIndex: 0 };

  componentDidMount() {
    const { userId } = this.state;
    this.props.loadWallets({ userId });
    this.props.loadExchangeHistory({ userId });
  }

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
    const { wallets, error, exchangeHistory } = this.props;
    const { selectedWalletIndex } = this.state;

    return (
      <div className="page">
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
        {exchangeHistory.length > 0 && (
          <div>
            <h3>History</h3>
            {exchangeHistory.map((hist, i) => (
              <div>
                Sell{' '}
                {formatCurrency({
                  currencyCode: hist.from.code,
                  amount: hist.from.amount
                })}{' '}
                / Buy{' '}
                {formatCurrency({
                  currencyCode: hist.to.code,
                  amount: hist.to.amount
                })}{' '}
                @ {hist.rate} {hist.from.code}/{hist.to.code}
              </div>
            ))}
          </div>
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
  error: PropTypes.string,
  exchangeHistory: PropTypes.array.isRequired,
  loadWallets: PropTypes.func.isRequired,
  loadExchangeHistory: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    wallets: state.wallets,
    error: state.walletsError,
    exchangeHistory: state.exchangeHistory
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadWallets: ({ userId }) => dispatch(loadWallets({ userId })),
    loadExchangeHistory: ({ userId }) =>
      dispatch(loadExchangeHistory({ userId }))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WalletsContainer);
