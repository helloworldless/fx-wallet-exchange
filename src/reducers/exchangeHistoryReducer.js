import * as types from '../actions/actionTypes';

export default function exchangeHistoryReducer(state = [], action) {
  const { type, exchangeHistory } = action;
  switch (type) {
    case types.LOAD_EXCHANGE_HISTORY_SUCCESS:
      return exchangeHistory;
    case types.LOAD_EXCHANGE_HISTORY_FAILURE:
      return state;
    case types.EXCHANGE_SUCCESS:
      return action.payload.exchangeHistory;
    default:
      return state;
  }
}
