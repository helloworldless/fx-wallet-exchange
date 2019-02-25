import { getWalletsByUserId } from '../api/walletsApi';
import { mockUserId } from '../utils/mockData';
import * as types from './actionTypes';

export function loadWalletsSuccess(wallets) {
  debugger;
  return { type: types.LOAD_WALLETS_SUCCESS, wallets };
}

export function loadWallets() {
  return dispatch => {
    return getWalletsByUserId({ userId: mockUserId })
      .then(wallets => dispatch(loadWalletsSuccess(wallets)))
      .catch(e => {
        throw e;
      });
  };
}
