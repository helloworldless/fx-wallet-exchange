import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { paths } from '../../constants/constants';
import { ArrowBack } from '@material-ui/icons';
import IconLabelLink from '../common/IconLink';
import { connect } from 'react-redux';
import ExchangeSide from './ExchangeSide';
import { Side } from '../../constants/constants';
import { getIndex, round, walletsArrToObj } from '../../utils/util';
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
  amountToString
} from '../../utils/exchangeUtil';
import { toast } from 'react-toastify';
import { loadWallets } from '../../actions/walletsActions';

// zero or more numeric digits, e.g. '', '100'
// or one or more numeric digits followed by a point plus exactly two more numeric digits, e.g. 123.45
// we allow zero digits (a blank string) as this will be interpreted as zero (0)
const regexMoney = /^(-?\d*|-?\d+\.\d{2})$/;
const validFormatMessage = 'Amount should be of the format 123.45';

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
    // console.log(Object.keys(this.props));
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
    let value = event.target.value;
    // Strip leading '-' or '+'
    const firstChar = value.charAt(0);
    if (firstChar === '-' || firstChar === '+') {
      value = value.substring(1);
    }
    const inputAmount = value;

    const fromOrToState = { ...this.props.exchange[fromOrTo] };
    const otherSide = getOtherSide(fromOrTo);
    const otherSideState = { ...this.props.exchange[otherSide] };

    const { wallets } = this.props;

    if (regexMoney.test(inputAmount)) {
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

        this.updateFollowerSide({
          driver: fromOrTo,
          driverSideParams: fromOrToState,
          followerSideParams: otherSideState,
          wallets
        });
      }
    } else {
      fromOrToState.inputAmount =
        inputAmount.length > MAX_INPUT_LENGTH
          ? fromOrToState.inputAmount
          : inputAmount;
      fromOrToState.isAmountValid = false;
      fromOrToState.error = validFormatMessage;
    }

    this.props.updateExchangeParameters({
      [fromOrTo]: fromOrToState,
      [otherSide]: otherSideState
    });
  };

  updateFollowerSide = ({
    driver,
    driverSideParams,
    followerSideParams,
    wallets
  }) => {
    const fromCode =
      driver === Side.From ? driverSideParams.code : followerSideParams.code;
    const toCode =
      driver === Side.From ? followerSideParams.code : driverSideParams.code;
    const rate = this.props.rates[fromCode + toCode] || 1;

    if (driver === Side.From) {
      followerSideParams.amount = round(driverSideParams.amount * rate, -2);
      followerSideParams.inputAmount = amountToString(
        followerSideParams.amount
      );
    } else {
      // driver is To
      followerSideParams.amount = round(
        driverSideParams.amount * (1 / rate),
        -2
      );
      followerSideParams.inputAmount = amountToString(
        followerSideParams.amount
      );

      // if the driver is to, then other side is from; need to do overdraft check
      const isOverdraft = checkOverdraft({
        fromOrTo: Side.From,
        amount: followerSideParams.amount,
        currencyCode: followerSideParams.code,
        wallets
      });

      followerSideParams.isAmountValid = !isOverdraft;
      followerSideParams.error = isOverdraft ? overdraftMessage : '';
    }
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
    // however, by hard coding
    this.updateFollowerSide({
      driver: Side.From,
      driverSideParams: fromOrTo === Side.From ? fromOrToState : otherSideState,
      followerSideParams:
        fromOrTo === Side.From ? otherSideState : fromOrToState,
      wallets
    });
    // this.updateOtherSide({
    //   driver: fromOrTo,
    //   fromOrToState,
    //   otherSideState,
    //   wallets
    // });

    this.props.updateExchangeParameters({
      [fromOrTo]: fromOrToState,
      [otherSide]: otherSideState
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

    return (
      <div className={this.state.exchangePending ? 'page blur' : 'page'}>
        {(!availableCurrencyCodes.length > 0 ||
          !Object.keys(wallets).length) && <div>Loading wallets...</div>}

        {availableCurrencyCodes.length > 0 && Object.keys(wallets).length > 0 && (
          <div>
            <button onClick={this.initiateExchange}>Exchange</button>
            {exchangeError && <div>{exchangeError}</div>}
            <ExchangeSide
              availableCurrencyCodes={availableCurrencyCodes}
              {...from}
              placeholder="Amount to sell"
              wallets={wallets}
              fromOrTo={Side.From}
              handleChangeCurrencySwipeTo={this.handleChangeCurrencySwipeTo}
              handleChangeCurrencySwipeFrom={this.handleChangeCurrencySwipeFrom}
              handleChangeAmount={this.handleChangeAmount}
              handleChangeCurrencyButtonTo={this.handleChangeCurrencyButtonTo}
              handleChangeCurrencyButtonFrom={
                this.handleChangeCurrencyButtonFrom
              }
            />
          </div>
        )}

        {availableCurrencyCodes.length > 0 &&
          Object.keys(wallets).length > 0 && (
            <ExchangeSide
              availableCurrencyCodes={availableCurrencyCodes}
              {...to}
              placeholder="Amount to buy"
              wallets={wallets}
              fromOrTo={Side.To}
              handleChangeCurrencySwipeTo={this.handleChangeCurrencySwipeTo}
              handleChangeCurrencySwipeFrom={this.handleChangeCurrencySwipeFrom}
              handleChangeAmount={this.handleChangeAmount}
              handleChangeCurrencyButtonTo={this.handleChangeCurrencyButtonTo}
              handleChangeCurrencyButtonFrom={
                this.handleChangeCurrencyButtonFrom
              }
            />
          )}
        {availableCurrencyCodes.length > 0 &&
          Object.keys(wallets).length > 0 && (
            <IconLabelLink to={paths.wallets} Icon={ArrowBack} lawabel="Back" />
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
    wallets: walletsArrToObj(state.wallets),
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
