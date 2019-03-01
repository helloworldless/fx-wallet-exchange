import WalletsApi from '../api/WalletsApi';
import * as types from './actionTypes';

export function initiateExchange() {
  return { type: types.INITIATE_EXCHANGE };
}
export function exchangeSuccess(wallets) {
  return { type: types.EXCHANGE_SUCCESS, wallets };
}

export function exchangeFailure(error) {
  return { type: types.EXCHANGE_FAILURE, error };
}

export function updateExchangeParameters(payload) {
  return { type: types.UPDATE_EXCHANGE_PARAMETERS, payload };
}

export function exchange({ userId, from, to, rate }) {
  return async dispatch => {
    dispatch(initiateExchange());
    try {
      const wallets = await WalletsApi.exchange({
        userId,
        from,
        to,
        rate
      });
      dispatch(exchangeSuccess(wallets));
      return { wallets };
    } catch (e) {
      dispatch(exchangeFailure(e));
      return { error: e.message };
    }
  };
}
