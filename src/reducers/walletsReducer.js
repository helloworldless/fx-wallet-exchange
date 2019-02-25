import * as types from '../actions/actionTypes';

export default function walletsReducer(state = [], action) {
  switch (action.type) {
    case types.LOAD_WALLETS_SUCCESS:
      return action.wallets;
    default:
      return state;
  }
}
