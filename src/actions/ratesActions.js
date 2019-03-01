import * as types from './actionTypes';
import FxRatesApi from '../api/FxRatesApi';
import { updateExchangeParameters } from './exchangeActions';
import { buildEmptySide } from '../utils/exchangeUtil';

export function loadRatesSuccess(rates) {
  return { type: types.LOAD_RATES_SUCCESS, rates };
}

export function loadRatesFailure(error) {
  return { type: types.LOAD_RATES_FAILURE, error };
}

export function loadRates() {
  return async dispatch => {
    try {
      const { rates, availableCurrencies } = await FxRatesApi.getRates();
      dispatch(
        loadRatesSuccess({
          rates,
          currencies: availableCurrencies
        })
      );
      const from = buildEmptySide();
      from.code = availableCurrencies[0];
      from.selectedIndex = 0;
      const to = buildEmptySide();
      to.code = availableCurrencies[1];
      to.selectedIndex = 1;
      dispatch(updateExchangeParameters({ from, to }));
    } catch (e) {
      dispatch(loadRatesFailure(e));
    }
  };
}
