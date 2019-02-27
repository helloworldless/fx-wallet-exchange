import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { paths } from '../../constants/constants';
import { ArrowBack } from '@material-ui/icons';
import IconLabelLink from '../common/IconLink';
import { connect } from 'react-redux';
import ExchangeSide from './ExchangeSide';
import { Side } from '../../constants/constants';
import { getIndex } from '../../utils/util';

// zero or more numeric digits, e.g. '', '100'
// or one or more numeric digits followed by a point plus exactly two more numeric digits, e.g. 123.45
// we allow zero digits (a blank string) as this will be interpreted as zero (0)
const regexMoney = /^(\d*|\d+\.\d{2})$/;
const validFormatMessage = 'Amount should be of the format 123.45';

class ExchangePage extends PureComponent {
  state = {
    rates: [],
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
    },
    driver: null
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

  handleChangeAmount = event => {
    const fromOrTo = event.target.getAttribute('data-from-to');
    const value = event.target.value;

    const fromOrToState = { ...this.state[fromOrTo] };
    fromOrToState.inputAmount = value;

    if (regexMoney.test(value)) {
      fromOrToState.isAmountValid = true;
      fromOrToState.error = '';
      fromOrToState.amount = value === '' ? 0 : parseFloat(value);
    } else {
      fromOrToState.isAmountValid = false;
      fromOrToState.error = validFormatMessage;
    }

    this.setState({ [fromOrTo]: fromOrToState });
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

  render() {
    const { from, to } = this.state;
    const { availableCurrencyCodes } = this.props;

    return (
      <div className="page">
        {availableCurrencyCodes.length > 0 && from.code && (
          <ExchangeSide
            availableCurrencyCodes={availableCurrencyCodes}
            {...from}
            placeholder="Amount to sell"
            fromOrTo={Side.From}
            handleChangeToIndex={this.handleChangeToIndex}
            handleChangeFromIndex={this.handleChangeFromIndex}
            handleChangeAmount={this.handleChangeAmount}
            handleChangeSelectedToCurrency={this.handleChangeSelectedToCurrency}
            handleChangeSelectedFromCurrency={
              this.handleChangeSelectedFromCurrency
            }
          />
        )}

        {availableCurrencyCodes.length > 0 && to.code && (
          <ExchangeSide
            availableCurrencyCodes={availableCurrencyCodes}
            {...to}
            placeholder="Amount to buy"
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
  // custom prop type check for map
  ratesMap: (props, propName) => {
    const m = props[propName];
    if (!m) {
      return new Error(
        `Prop Type validaton failed; Prop [${propName}] not supplied`
      );
    }
    if (!(m instanceof Map)) {
      return new Error(
        `Prop Type validation failed; Prop [${propName}] must be a Map`
      );
    }
  },
  availableCurrencyCodes: PropTypes.array.isRequired
};

const mapStateToProps = state => {
  return {
    ratesMap: state.rates.map,
    availableCurrencyCodes: state.rates.currencies
  };
};

export default connect(mapStateToProps)(ExchangePage);
