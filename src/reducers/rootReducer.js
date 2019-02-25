import { combineReducers } from 'redux';
import wallets from './walletsReducer';
import walletsError from './walletsErrorReducer';

export default combineReducers({ wallets, walletsError });
