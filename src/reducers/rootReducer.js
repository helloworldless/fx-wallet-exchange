import { combineReducers } from 'redux';
import wallets from './walletsReducer';
import walletsError from './walletsErrorReducer';
import rates from './ratesReducer';

export default combineReducers({ wallets, walletsError, rates });
