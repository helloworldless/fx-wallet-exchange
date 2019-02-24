import React from 'react';
import PropTypes from 'prop-types';

import { formatCurrency } from '../utils/numberUtil';

const Wallet = ({ currencyCode, currencyName, amount }) => {
  return (
    <div>
      <h2>{formatCurrency({ currencyCode, amount })}</h2>
      <h4>
        {currencyCode} {currencyName}
      </h4>
    </div>
  );
};

const walletPropTypes = {
  currencyCode: PropTypes.string.isRequired,
  currencyName: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired
};

Wallet.propTypes = walletPropTypes;

export { walletPropTypes };
export default Wallet;
