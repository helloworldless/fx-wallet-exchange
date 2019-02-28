import React from 'react';
import PropTypes from 'prop-types';
import Swipeable from '../common/Swipeable';
import NavForSwipeable from '../common/NavForSwipeable';
import { formatCurrency } from '../../utils/util';
import { Side } from '../../constants/constants';
import { MAX_AMOUNT } from './ExchangePage';

// const formatInputAmount = (fromOrTo, inputAmount) => {
//   if (inputAmount === '') return inputAmount;
//   return fromOrTo === Side.From ? `-${inputAmount}` : `+${inputAmount}`;
// };

// const formatAmount = (fromOrTo, amount, code) => {
//   const newAmount = fromOrTo === Side.From ? amount * -1 : amount;
//   return formatCurrency({ currencyCode: code, amount: newAmount });
// };

const ExchangeSide = ({
  availableCurrencyCodes,
  fromOrTo,
  code,
  amount,
  inputAmount,
  isAmountValid,
  error,
  selectedIndex,
  placeholder,
  wallets,
  handleChangeToIndex,
  handleChangeFromIndex,
  handleChangeAmount,
  handleChangeSelectedToCurrency,
  handleChangeSelectedFromCurrency
}) => {
  return (
    <div>
      <Swipeable
        keyboardEnabled={false}
        index={selectedIndex}
        handleChangeIndex={
          fromOrTo === Side.To ? handleChangeToIndex : handleChangeFromIndex
        }
      >
        {availableCurrencyCodes.map(ccy => (
          <div key={ccy} className="exchange-group">
            <div>
              <h1>{ccy}</h1>
              {wallets[ccy] && (
                <div>
                  You have{' '}
                  {formatCurrency({
                    currencyCode: ccy,
                    amount: wallets[ccy].amount
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
      </Swipeable>
      <div>
        <input
          className="input-nostyle exchange-amount-input"
          type="number"
          step="0.01"
          min="0"
          max={MAX_AMOUNT}
          value={inputAmount}
          // value={formatInputAmount(fromOrTo, inputAmount)}
          // value={formatAmount(fromOrTo, amount, code)}
          placeholder={placeholder}
          data-from-to={fromOrTo}
          onChange={handleChangeAmount}
        />
        <div style={{ height: '1rem' }}>
          {!isAmountValid && <div>{error}</div>}
        </div>
      </div>
      <NavForSwipeable
        selectedIndex={selectedIndex}
        itemKeys={availableCurrencyCodes}
        handleChangeSelected={
          fromOrTo === Side.To
            ? handleChangeSelectedToCurrency
            : handleChangeSelectedFromCurrency
        }
      />
    </div>
  );
};

ExchangeSide.propTypes = {
  availableCurrencyCodes: PropTypes.arrayOf(PropTypes.string.isRequired),
  fromOrTo: PropTypes.oneOf([Side.From, Side.To]),
  code: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  inputAmount: PropTypes.string.isRequired,
  isAmountValid: PropTypes.bool.isRequired,
  error: PropTypes.string,
  selectedIndex: PropTypes.number.isRequired,
  placeholder: PropTypes.string.isRequired,
  wallets: PropTypes.object.isRequired,
  handleChangeToIndex: PropTypes.func.isRequired,
  handleChangeFromIndex: PropTypes.func.isRequired,
  handleChangeAmount: PropTypes.func.isRequired,
  handleChangeSelectedToCurrency: PropTypes.func.isRequired,
  handleChangeSelectedFromCurrency: PropTypes.func.isRequired
};

export default ExchangeSide;
