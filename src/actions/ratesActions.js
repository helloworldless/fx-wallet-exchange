import * as types from './actionTypes';
import FxRatesApi from '../api/FxRatesApi';
import { updateExchangeParameters } from './exchangeActions';
import { getFromAndToDefaults } from '../utils/exchangeUtil';

export function loadRatesSuccess(rates) {
  return { type: types.LOAD_RATES_SUCCESS, rates };
}

export function loadRatesFailure(error) {
  return { type: types.LOAD_RATES_FAILURE, error };
}

export function loadRates() {
  return async dispatch => {
    try {
      const { rates, availableCurrencyCodes } = await FxRatesApi.getRates();
      debugger;
      dispatch(
        loadRatesSuccess({
          rates,
          currencies: availableCurrencyCodes
        })
      );

      const { from, to } = getFromAndToDefaults({ availableCurrencyCodes });
      debugger;

      dispatch(updateExchangeParameters({ from, to }));
    } catch (e) {
      dispatch(loadRatesFailure(e));
    }
  };
}
