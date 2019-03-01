import { combineReducers } from 'redux';
import wallets from './walletsReducer';
import walletsError from './walletsErrorReducer';
import rates from './ratesReducer';
import exchange from './exchangeReducer';
import exchangeHistory from './exchangeHistoryReducer';

export default combineReducers({
  wallets,
  walletsError,
  rates,
  exchange,
  exchangeHistory
});
