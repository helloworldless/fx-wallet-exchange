import * as types from './actionTypes';
import FxRatesApi from '../api/FxRatesApi';

export function loadRatesSuccess(rates) {
  return { type: types.LOAD_RATES_SUCCESS, rates };
}

export function loadRatesFailure(error) {
  return { type: types.LOAD_RATES_FAILURE, error };
}

export function loadRates() {
  return async dispatch => {
    try {
      const { ratesMap, availableCurrencies } = await FxRatesApi.getRates();
      dispatch(
        loadRatesSuccess({
          map: ratesMap,
          currencies: availableCurrencies
        })
      );
    } catch (e) {
      dispatch(loadRatesFailure(e));
    }
  };
}
