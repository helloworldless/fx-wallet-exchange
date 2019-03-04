import WalletsApi from '../api/WalletsApi';
import * as types from './actionTypes';

export function loadWalletsSuccess({ wallets, exchangeHistory }) {
  return {
    type: types.LOAD_WALLETS_SUCCESS,
    payload: { wallets, exchangeHistory }
  };
}

export function loadWalletsFailure(error) {
  return { type: types.LOAD_WALLETS_FAILURE, error };
}

export function loadWallets({ userId }) {
  return async dispatch => {
    try {
      const { wallets, exchangeHistory } = await WalletsApi.getWalletsByUserId({
        userId
      });
      dispatch(loadWalletsSuccess({ wallets, exchangeHistory }));
    } catch (e) {
      dispatch(loadWalletsFailure(e));
    }
  };
}
