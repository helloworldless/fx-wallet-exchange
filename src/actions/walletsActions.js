import WalletsApi from '../api/WalletsApi';
import * as types from './actionTypes';

export function loadWalletsSuccess(wallets) {
  return { type: types.LOAD_WALLETS_SUCCESS, wallets };
}

export function loadWalletsFailure(error) {
  return { type: types.LOAD_WALLETS_FAILURE, error };
}

export function loadWallets({ userId }) {
  return async dispatch => {
    try {
      const wallets = await WalletsApi.getWalletsByUserId({
        userId
      });
      dispatch(loadWalletsSuccess(wallets));
    } catch (e) {
      dispatch(loadWalletsFailure(e));
    }
  };
}
