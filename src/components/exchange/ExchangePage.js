import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { paths } from '../../constants/constants';
import { ArrowBack } from '@material-ui/icons';
import IconLabelLink from '../common/IconLink';
import { connect } from 'react-redux';
import ExchangeSide from './ExchangeSide';
import { Side } from '../../constants/constants';
import { getIndex, formatCurrency, round } from '../../utils/util';
import { walletPropTypes } from '../wallet/Wallet';
import { exchange } from '../../actions/exchangeActions';
import { mockUserId } from '../../data/mockData';

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
    // rates: [],
    userId: mockUserId,
    driver: null,
    exchangePending: false,
    exchangeError: '',
    from: {
      code: null,
      amount: null,
      inputAmount: '',
      isAmountValid: true,
      error: '',
      selectedIndex: null
    },
    to: {
      code: null,
      amount: null,
      inputAmount: '',
      isAmountValid: true,
      error: '',
      selectedIndex: null
    }
  };

  componentDidUpdate() {
    // from/to details haven't been intialized
    // and we've received rates details
    const { availableCurrencyCodes } = this.props;
    if (!this.state.from.code && availableCurrencyCodes.length) {
      const from = { ...this.state.from };
      from.code = availableCurrencyCodes[0];
      from.amount = 0;
      from.selectedIndex = 0;
      const to = { ...this.state.to };
      to.code = availableCurrencyCodes[1];
      to.amount = 0;
      to.selectedIndex = 1;
      this.setState({ from, to });
    }
  }

  handleChangeCcy = event => {
    const fromOrTo = event.target.getAttribute('data-from-to');
    const value = event.target.value;

    const fromOrToState = { ...this.state[fromOrTo] };
    fromOrToState.code = value;

    this.setState({ [fromOrTo]: fromOrToState });
  };

  getOtherSide = fromOrTo => {
    return fromOrTo === Side.From ? Side.To : Side.From;
  };

  handleChangeAmount = event => {
    const fromOrTo = event.target.getAttribute('data-from-to');
    let value = event.target.value;
    // Strip leading '-' or '+'
    const firstChar = value.charAt(0);
    if (firstChar === '-' || firstChar === '+') {
      value = value.substring(1);
    }
    const inputAmount = value; // value.length ? value.substring(1) : value;

    const fromOrToState = { ...this.state[fromOrTo] };
    const otherSide = this.getOtherSide(fromOrTo);
    const otherSideState = { ...this.state[otherSide] };

    if (regexMoney.test(inputAmount)) {
      const parsedValue = parseFloat(inputAmount);
      if (parsedValue > MAX_AMOUNT) {
        // Don't update the inputAmount or amount
        fromOrToState.isAmountValid = false;
        fromOrToState.error = `Maximum amount is ${MAX_AMOUNT_FORMATTED}`;
      } else {
        fromOrToState.inputAmount = inputAmount;
        fromOrToState.isAmountValid = true;
        fromOrToState.error = '';
        fromOrToState.amount = inputAmount === '' ? 0 : parsedValue;

        const fromCode =
          fromOrTo === Side.From ? fromOrToState.code : otherSideState.code;
        const toCode =
          fromOrTo === Side.From ? otherSideState.code : fromOrToState.code;
        const rate = this.props.rates[fromCode + toCode];

        if (fromOrTo === Side.From) {
          otherSideState.amount = round(fromOrToState.amount * rate, -2);
          otherSideState.inputAmount = String(otherSideState.amount);
        } else {
          otherSideState.amount = round(fromOrToState.amount * (1 / rate), -2);
          otherSideState.inputAmount = String(otherSideState.amount);
        }
      }
    } else {
      fromOrToState.inputAmount =
        inputAmount.length > MAX_INPUT_LENGTH
          ? fromOrToState.inputAmount
          : inputAmount;
      fromOrToState.isAmountValid = false;
      fromOrToState.error = validFormatMessage;
    }

    this.setState({
      [fromOrTo]: fromOrToState,
      [otherSide]: otherSideState,
      driver: fromOrTo
    });
  };

  handleChangeIndex = (fromOrTo, index) => {
    const fromOrToState = { ...this.state[fromOrTo] };
    fromOrToState.selectedIndex = index;
    this.setState({ [fromOrTo]: fromOrToState });
  };

  handleChangeToIndex = index => {
    this.handleChangeIndex(Side.To, index);
  };

  handleChangeFromIndex = index => {
    this.handleChangeIndex(Side.From, index);
  };

  handleChangeSelectedCurrency(fromOrTo, index) {
    const fromOrToState = { ...this.state[fromOrTo] };
    fromOrToState.selectedIndex = index;
    this.setState({ [fromOrTo]: fromOrToState });
  }

  handleChangeSelectedToCurrency = event => {
    this.handleChangeSelectedCurrency(Side.To, getIndex(event));
  };

  handleChangeSelectedFromCurrency = event => {
    this.handleChangeSelectedCurrency(Side.From, getIndex(event));
  };

  validatedExchange = (from, to, wallets) => {
    if (from.amount > wallets[from.code]) {
      return { valid: false, message: `Insufficient funds` };
    }
  };

  initiateExchange = async e => {
    const { from, to, userId } = this.state;
    const rate = this.props.rates[from.code + to.code];
    this.setState({ exchangePending: true });
    const result = await this.props.doExchange({ userId, from, to, rate });
    this.setState({ exchangePending: false, exchangeError: result.error });
  };

  render() {
    const { from, to } = this.state;
    const { availableCurrencyCodes } = this.props;

    return (
      <div className={this.state.exchangePending ? 'page blur' : 'page'}>
        {availableCurrencyCodes.length > 0 && from.code && (
          <div>
            <button onClick={this.initiateExchange}>Exchange</button>
            <ExchangeSide
              availableCurrencyCodes={availableCurrencyCodes}
              {...from}
              placeholder="Amount to sell"
              wallets={this.props.wallets}
              fromOrTo={Side.From}
              handleChangeToIndex={this.handleChangeToIndex}
              handleChangeFromIndex={this.handleChangeFromIndex}
              handleChangeAmount={this.handleChangeAmount}
              handleChangeSelectedToCurrency={
                this.handleChangeSelectedToCurrency
              }
              handleChangeSelectedFromCurrency={
                this.handleChangeSelectedFromCurrency
              }
            />
          </div>
        )}

        {availableCurrencyCodes.length > 0 && to.code && (
          <ExchangeSide
            availableCurrencyCodes={availableCurrencyCodes}
            {...to}
            placeholder="Amount to buy"
            wallets={this.props.wallets}
            fromOrTo={Side.To}
            handleChangeToIndex={this.handleChangeToIndex}
            handleChangeFromIndex={this.handleChangeFromIndex}
            handleChangeAmount={this.handleChangeAmount}
            handleChangeSelectedToCurrency={this.handleChangeSelectedToCurrency}
            handleChangeSelectedFromCurrency={
              this.handleChangeSelectedFromCurrency
            }
          />
        )}
        <IconLabelLink to={paths.wallets} Icon={ArrowBack} label="Back" />
      </div>
    );
  }
}

ExchangePage.propTypes = {
  rates: PropTypes.object.isRequired,
  availableCurrencyCodes: PropTypes.array.isRequired,
  wallets: PropTypes.object.isRequired,
  doExchange: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    rates: state.rates.rates,
    availableCurrencyCodes: state.rates.currencies,
    wallets: state.wallets.reduce((walletsObj, wallet) => {
      walletsObj[wallet.currencyCode] = wallet;
      return walletsObj;
    }, {})
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
      )
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExchangePage);
