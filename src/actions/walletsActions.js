import { getWalletsByUserId } from '../api/walletsApi';
import { mockUserId } from '../utils/mockData';
import * as types from './actionTypes';

export function loadWalletsSuccess(wallets) {
  return { type: types.LOAD_WALLETS_SUCCESS, wallets };
}

export function loadWalletsFailure(error) {
  return { type: types.LOAD_WALLETS_FAILURE, error };
}

export function loadWallets() {
  return async dispatch => {
    try {
      const wallets = await getWalletsByUserId({ userId: mockUserId });
      dispatch(loadWalletsSuccess(wallets));
    } catch (e) {
      dispatch(loadWalletsFailure(e));
    }
  };
}
