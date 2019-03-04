import * as types from './actionTypes';
import FxRatesApi from '../api/FxRatesApi';

export function loadRatesSuccess({ rates, currencies }) {
  return { type: types.LOAD_RATES_SUCCESS, payload: { rates, currencies } };
}

export function loadRatesFailure(error) {
  return { type: types.LOAD_RATES_FAILURE, error };
}

export function loadRates() {
  return async dispatch => {
    try {
      const { rates, availableCurrencyCodes } = await FxRatesApi.getRates();
      dispatch(
        loadRatesSuccess({
          rates,
          currencies: availableCurrencyCodes
        })
      );
    } catch (e) {
      dispatch(loadRatesFailure(e));
    }
  };
}
