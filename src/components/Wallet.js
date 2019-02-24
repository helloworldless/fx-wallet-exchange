import React from 'react';
import PropTypes from 'prop-types';

import { formatCurrency } from '../utils/numberUtil';

const Wallet = ({ currencyCode, currencyName, amount }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h2>{formatCurrency({ currencyCode, amount })}</h2>
      <h4>
        {currencyCode} {currencyName}
      </h4>
    </div>
  );
};

Wallet.propTypes = {
  currencyCode: PropTypes.string.isRequired,
  currencyName: PropTypes.string.isRequired,
  currencySymbol: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired
};

export default Wallet;
