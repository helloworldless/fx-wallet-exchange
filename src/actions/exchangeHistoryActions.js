import WalletsApi from '../api/WalletsApi';
import * as types from './actionTypes';

export function loadExchangeHistorySuccess(exchangeHistory) {
  return { type: types.LOAD_EXCHANGE_HISTORY_SUCCESS, exchangeHistory };
}

export function loadExchangeHistoryFailure(error) {
  return { type: types.LOAD_EXCHANGE_HISTORY_FAILURE, error };
}

export function loadExchangeHistory({ userId }) {
  return async dispatch => {
    try {
      const exchangeHistory = await WalletsApi.getExchangeHistory({
        userId
      });
      dispatch(loadExchangeHistorySuccess(exchangeHistory));
    } catch (e) {
      dispatch(loadExchangeHistoryFailure(e.message));
      return { error: e.message };
    }
  };
}
