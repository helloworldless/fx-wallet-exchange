import * as types from '../actions/actionTypes';

export default function ratesReducer(
  state = { map: new Map(), currencies: [] },
  action
) {
  switch (action.type) {
    case types.LOAD_RATES_SUCCESS:
      console.info('Updated rates received');
      const { map, currencies } = action.rates;
      return {
        map,
        currencies
      };
    default:
      return state;
  }
}
