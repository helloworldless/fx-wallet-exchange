import { combineReducers } from 'redux';
import wallets from './walletsReducer';
import walletsError from './walletsErrorReducer';
import rates from './ratesReducer';
import exchange from './exchangeReducer';

export default combineReducers({
  wallets,
  walletsError,
  rates,
  exchange
});
