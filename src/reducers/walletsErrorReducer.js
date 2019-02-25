import * as types from '../actions/actionTypes';

export default function walletsErrorReducer(state = null, action) {
  const { type, error } = action;

  if (type === types.LOAD_WALLETS_FAILURE) {
    return error;
  }

  return state;
}
