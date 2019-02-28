import * as types from '../actions/actionTypes';

export default function ratesReducer(
  state = { rates: {}, currencies: [] },
  action
) {
  switch (action.type) {
    case types.LOAD_RATES_SUCCESS:
      console.info('Updated rates received');
      const { rates, currencies } = action.rates;
      return {
        rates,
        currencies
      };
    default:
      return state;
  }
}
