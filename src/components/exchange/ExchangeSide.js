import React from 'react';
import PropTypes from 'prop-types';
import Swipeable from '../common/Swipeable';
import NavForSwipeable from '../common/NavForSwipeable';
import { formatCurrency } from '../../utils/util';
import { Side } from '../../constants/constants';

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
            <h1>{ccy}</h1>
            <div>
              {formatCurrency({
                currencyCode: code,
                amount: amount
              })}
            </div>
            <div>
              <input
                className="input-nostyle exchange-amount-input"
                type="text"
                value={inputAmount}
                placeholder={placeholder}
                data-from-to={fromOrTo}
                onChange={handleChangeAmount}
              />
              <div style={{ height: '1rem' }}>
                {!isAmountValid && <div>{error}</div>}
              </div>
            </div>
          </div>
        ))}
      </Swipeable>
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
  handleChangeToIndex: PropTypes.func.isRequired,
  handleChangeFromIndex: PropTypes.func.isRequired,
  handleChangeAmount: PropTypes.func.isRequired,
  handleChangeSelectedToCurrency: PropTypes.func.isRequired,
  handleChangeSelectedFromCurrency: PropTypes.func.isRequired
};

export default ExchangeSide;
