import React, { PureComponent } from 'react';
import { formatCurrency } from '../../utils/numberUtil';
import { paths } from '../../utils/constants';
import { ArrowBack } from '@material-ui/icons';
import IconLabelLink from '../common/IconLink';

// const Driver = { From: 'From', To: 'To' };

class ExchangePage extends PureComponent {
  state = {
    rates: [],
    from: { code: 'USD', amount: 123.1 },
    to: { code: 'GBP', amount: 100.11 },
    driver: null
  };

  render() {
    const { from, to } = this.state;
    return (
      <div className="page">
        <h1>
          Sell{' '}
          {formatCurrency({
            currencyCode: from.code,
            amount: -1 * from.amount
          })}
        </h1>
        <h1>
          Buy{' '}
          {formatCurrency({
            currencyCode: to.code,
            amount: to.amount
          })}
        </h1>
        <IconLabelLink to={paths.wallets} Icon={ArrowBack} label="Back" />
      </div>
    );
  }
}

ExchangePage.propTypes = {};

export default ExchangePage;
