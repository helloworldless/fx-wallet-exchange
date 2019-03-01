import * as types from '../actions/actionTypes';
import { buildEmptySide } from '../utils/exchangeUtil';

const initialState = {
  from: buildEmptySide(),
  to: buildEmptySide(),
  error: null
};

export default function exchangeReducer(state = initialState, action) {
  switch (action.type) {
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
