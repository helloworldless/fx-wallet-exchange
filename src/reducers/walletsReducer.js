import * as types from '../actions/actionTypes';

export default function walletsReducer(state = {}, action) {
  switch (action.type) {
    case types.LOAD_WALLETS_SUCCESS:
      return action.payload.wallets;
    case types.EXCHANGE_SUCCESS:
      return action.payload.wallets;
    default:
      return state;
  }
}
