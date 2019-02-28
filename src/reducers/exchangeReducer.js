import * as types from '../actions/actionTypes';

const initialState = { fetchesInProgress: 0, error: null, wallets: [] };

export default function exchangeReducer(state = initialState, action) {
  switch (action.type) {
    case types.INITIATE_EXCHANGE:
      return { error: '', fetchesInProgress: state.fetchesInProgress + 1 };
    case types.EXCHANGE_SUCCESS:
      return {
        error: '',
        fetchesInProgress: state.fetchesInProgress - 1,
        wallets: action.wallets
      };
    case types.EXCHANGE_FAILURE:
      return {
        error: action.error,
        fetchesInProgress: state.fetchesInProgress - 1
      };
    default:
      return state;
  }
}
