import * as types from '../actions/actionTypes';
import { buildEmptySide, getUpdatedFollowerSide } from '../utils/exchangeUtil';
import { getFromAndToDefaults } from '../utils/exchangeUtil';
import { Side } from '../constants/constants';

const initialState = {
  from: buildEmptySide(),
  to: buildEmptySide(),
  error: null,
  initialized: false
};

export default function exchangeReducer(state = initialState, action) {
  switch (action.type) {
    case types.LOAD_RATES_SUCCESS:
      const { rates, currencies } = action.payload;
      if (!state.initialized) {
        const { from, to } = getFromAndToDefaults({
          availableCurrencyCodes: currencies
        });
        return { ...state, from, to, initialized: true };
      }

      const to = getUpdatedFollowerSide({
        driver: Side.From,
        driverSideParams: state.from,
        followerSideParams: state.to,
        wallets: null,
        rates
      });

      return { ...state, to };

    case types.UPDATE_EXCHANGE_PARAMETERS:
      return { ...state, ...action.payload };
    case types.INITIATE_EXCHANGE:
      return { ...state, error: '' };
    case types.EXCHANGE_SUCCESS:
      return {
        ...state,
        error: ''
      };
    case types.EXCHANGE_FAILURE:
      return {
        ...state,
        error: action.error
      };
    default:
      return state;
  }
}
