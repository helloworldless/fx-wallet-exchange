import React from 'react';
import PropTypes from 'prop-types';

import { formatCurrency } from '../../utils/numberUtil';

const Wallet = ({ currencyCode, currencyName, amount }) => {
  return (
    <div>
      <h1>{formatCurrency({ currencyCode, amount })}</h1>
      <h2>
        {currencyCode} {currencyName}
      </h2>
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
