import React from 'react';
import PropTypes from 'prop-types';
import WalletsPage from './wallet/WalletsPage';
import { Provider } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import ExchangePage from './exchange/ExchangePage';
import { paths } from '../utils/constants';

const Root = ({ store }) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path={paths.wallets} component={WalletsPage} />
          <Route exact path={paths.exchange} component={ExchangePage} />
          <Route path={paths.root} component={WalletsPage} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
};

Root.propTypes = {
  store: PropTypes.object.isRequired
};

export default Root;
