import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { paths } from '../../constants/constants';
import { ArrowBack } from '@material-ui/icons';
import IconLabelLink from '../common/IconLink';
import { connect } from 'react-redux';
import ExchangeSide from './ExchangeSide';
import { Side } from '../../constants/constants';
import { getIndex, formatCurrency } from '../../utils/util';
import {
  exchange,
  updateExchangeParameters
} from '../../actions/exchangeActions';
import { mockUserId } from '../../data/mockData';
import {
  validateExchange,
  checkOverdraft,
  overdraftMessage,
  getOtherSide,
  isValidMoneyFormat,
  getUpdatedFollowerSide,
  roundTwoDecimals
} from '../../utils/exchangeUtil';
import { toast } from 'react-toastify';
import { loadWallets } from '../../actions/walletsActions';

// Enforce both length and amount limits
const MAX_INPUT_LENGTH = 10;
export const MAX_AMOUNT = 1000000; // 1 million
const MAX_AMOUNT_FORMATTED = '1,000,000'; // 1 million

class ExchangePage extends PureComponent {
  state = {
    userId: mockUserId,
    exchangePending: false
  };

  componentDidMount() {
    this.props.loadWallets({ userId: this.state.userId });
  }

  handleChangeCcy = event => {
    const fromOrTo = event.target.getAttribute('data-from-to');
    const value = event.target.value;

    const fromOrToState = { ...this.props.exchange[fromOrTo] };
    fromOrToState.code = value;

    this.props.updateExchangeParameters({ [fromOrTo]: fromOrToState });
  };

  handleChangeAmount = event => {
    const fromOrTo = event.target.getAttribute('data-from-to');
    let inputAmount = event.target.value;

    const fromOrToState = { ...this.props.exchange[fromOrTo] };
    const otherSide = getOtherSide(fromOrTo);
    const otherSideState = { ...this.props.exchange[otherSide] };

    const { wallets } = this.props;

    const { valid, message: validMoneyFormatMessage } = isValidMoneyFormat({
      amountAsString: inputAmount
    });

    let updatedOtherSideState;
    if (valid) {
      const parsedValue = parseFloat(inputAmount);
      if (parsedValue > MAX_AMOUNT) {
        // Don't update the inputAmount or amount
        fromOrToState.isAmountValid = false;
        fromOrToState.error = `Maximum amount is ${MAX_AMOUNT_FORMATTED}`;
      } else {
        fromOrToState.inputAmount = inputAmount;
        const isOverdraft = checkOverdraft({
          fromOrTo,
          amount: parsedValue,
          currencyCode: fromOrToState.code,
          wallets
        });
        fromOrToState.isAmountValid = !isOverdraft;
        fromOrToState.error = isOverdraft ? overdraftMessage : '';
        fromOrToState.amount = inputAmount === '' ? 0 : parsedValue;

        updatedOtherSideState = getUpdatedFollowerSide({
          driver: fromOrTo,
          driverSideParams: fromOrToState,
          followerSideParams: otherSideState,
          wallets,
          rates: this.props.rates
        });
      }
    } else {
      fromOrToState.inputAmount =
        inputAmount.length > MAX_INPUT_LENGTH
          ? fromOrToState.inputAmount
          : inputAmount;
      fromOrToState.isAmountValid = false;
      fromOrToState.error = validMoneyFormatMessage;
    }

    this.props.updateExchangeParameters({
      [fromOrTo]: fromOrToState,
      [otherSide]: updatedOtherSideState
        ? updatedOtherSideState
        : otherSideState
    });
  };

  handleChangeSelectedCurrency = ({ fromOrTo, index }) => {
    const fromOrToState = { ...this.props.exchange[fromOrTo] };
    const { wallets } = this.props;
    fromOrToState.selectedIndex = index;
    const newCurrencyCode = this.props.availableCurrencyCodes[index];
    fromOrToState.code = newCurrencyCode;
    // if from, need to do overdraft check
    if (fromOrTo === Side.From) {
      const isOverdraft = checkOverdraft({
        fromOrTo,
        amount: fromOrToState.amount,
        currencyCode: newCurrencyCode,
        wallets
      });

      fromOrToState.isAmountValid = !isOverdraft;
      fromOrToState.error = isOverdraft ? overdraftMessage : '';
    }

    const otherSide = getOtherSide(fromOrTo);
    const otherSideState = { ...this.props.exchange[otherSide] };

    // for currency changes via swipe or nav buttons
    // we always want From to be the driver
    // otherwise swiping the To currency would trigger the From amount to change
    // however, by hard coding the driver to From here
    // we can enforce the To side being updated
    const updatedSide = getUpdatedFollowerSide({
      driver: Side.From,
      driverSideParams: fromOrTo === Side.From ? fromOrToState : otherSideState,
      followerSideParams:
        fromOrTo === Side.From ? otherSideState : fromOrToState,
      wallets,
      rates: this.props.rates
    });

    this.props.updateExchangeParameters({
      [fromOrTo]: fromOrTo === Side.From ? fromOrToState : updatedSide,
      [otherSide]: fromOrTo === Side.From ? updatedSide : otherSideState
    });
  };

  handleChangeCurrencySwipeTo = index => {
    this.handleChangeSelectedCurrency({ fromOrTo: Side.To, index });
  };

  handleChangeCurrencySwipeFrom = index => {
    this.handleChangeSelectedCurrency({ fromOrTo: Side.From, index });
  };

  handleChangeCurrencyButtonTo = event => {
    this.handleChangeSelectedCurrency({
      fromOrTo: Side.To,
      index: getIndex(event)
    });
  };

  handleChangeCurrencyButtonFrom = event => {
    this.handleChangeSelectedCurrency({
      fromOrTo: Side.From,
      index: getIndex(event)
    });
  };

  initiateExchange = async e => {
    const { userId } = this.state;
    const { from, to } = this.props.exchange;
    const { wallets } = this.props;
    const { valid, error } = validateExchange({ from, to, wallets });
    if (!valid) {
      toast.info(error);
      return;
    }
    const rate = this.props.rates[from.code + to.code];
    this.setState({ exchangePending: true });
    await this.props.doExchange({ userId, from, to, rate });
    this.setState({ exchangePending: false });
    this.props.history.push(paths.wallets);
  };

  render() {
    const { from, to } = this.props.exchange;
    const { availableCurrencyCodes, wallets } = this.props;

    const { error: exchangeError } = this.props.exchange;

    const rate = this.props.rates[from.code + to.code];

    return (
      <div className={this.state.exchangePending ? 'page blur' : 'page'}>
        {(!availableCurrencyCodes.length > 0 ||
          !Object.keys(wallets).length) && <div>Loading wallets...</div>}
        <div className="exchange-sides-container">
          {availableCurrencyCodes.length > 0 &&
            Object.keys(wallets).length > 0 && (
              <div>
                <button
                  className="button-nostyle exchange-button"
                  onClick={this.initiateExchange}
                >
                  Exchange
                </button>
                <div className="rate-display">
                  {rate && (
                    <div>
                      {formatCurrency({ currencyCode: from.code, amount: 1 })} ={' '}
                      {formatCurrency({
                        currencyCode: to.code,
                        amount: roundTwoDecimals({ amount: 1 * rate })
                      })}
                    </div>
                  )}
                </div>
                {exchangeError && <div>{exchangeError}</div>}

                <ExchangeSide
                  availableCurrencyCodes={availableCurrencyCodes}
                  {...from}
                  placeholder="Amount to sell"
                  wallets={wallets}
                  fromOrTo={Side.From}
                  exchangePending={this.state.exchangePending}
                  handleChangeCurrencySwipeTo={this.handleChangeCurrencySwipeTo}
                  handleChangeCurrencySwipeFrom={
                    this.handleChangeCurrencySwipeFrom
                  }
                  handleChangeAmount={this.handleChangeAmount}
                  handleChangeCurrencyButtonTo={
                    this.handleChangeCurrencyButtonTo
                  }
                  handleChangeCurrencyButtonFrom={
                    this.handleChangeCurrencyButtonFrom
                  }
                />
                <ExchangeSide
                  availableCurrencyCodes={availableCurrencyCodes}
                  {...to}
                  placeholder="Amount to buy"
                  wallets={wallets}
                  fromOrTo={Side.To}
                  exchangePending={this.state.exchangePending}
                  handleChangeCurrencySwipeTo={this.handleChangeCurrencySwipeTo}
                  handleChangeCurrencySwipeFrom={
                    this.handleChangeCurrencySwipeFrom
                  }
                  handleChangeAmount={this.handleChangeAmount}
                  handleChangeCurrencyButtonTo={
                    this.handleChangeCurrencyButtonTo
                  }
                  handleChangeCurrencyButtonFrom={
                    this.handleChangeCurrencyButtonFrom
                  }
                />
              </div>
            )}
        </div>
        {availableCurrencyCodes.length > 0 &&
          Object.keys(wallets).length > 0 && (
            <IconLabelLink to={paths.wallets} Icon={ArrowBack} label="Back" />
          )}
      </div>
    );
  }
}

ExchangePage.propTypes = {
  rates: PropTypes.object.isRequired,
  availableCurrencyCodes: PropTypes.array.isRequired,
  wallets: PropTypes.object.isRequired,
  doExchange: PropTypes.func.isRequired,
  exchange: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired, // React Router
  loadWallets: PropTypes.func.isRequired,
  updateExchangeParameters: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    rates: state.rates.rates,
    availableCurrencyCodes: state.rates.currencies,
    wallets: state.wallets,
    exchange: state.exchange
  };
};

const mapDispatchToProps = dispatch => {
  return {
    doExchange: ({ userId, from, to, rate }) =>
      dispatch(
        exchange({
          userId,
          from,
          to,
          rate
        })
      ),
    loadWallets: ({ userId }) => dispatch(loadWallets({ userId })),
    updateExchangeParameters: payload =>
      dispatch(updateExchangeParameters(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExchangePage);
