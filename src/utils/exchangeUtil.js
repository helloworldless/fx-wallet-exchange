import { Side } from '../constants/constants';

export const validateExchange = ({ from, to, wallets }) => {
  if (from.code === to.code) {
    return {
      valid: false,
      error: 'Please select two different currencies'
    };
  }
  if (
    checkOverdraft({ amount: from.amount, currencyCode: from.code, wallets })
  ) {
    return { valid: false, error: 'Insufficient funds' };
  }

  return { valid: true };
};

export const checkOverdraft = ({ fromOrTo, amount, currencyCode, wallets }) => {
  if (fromOrTo === Side.To) {
    return false;
  }
  return amount > wallets[currencyCode].amount;
};

export const overdraftMessage = 'Value exceeds amount in wallet';

export const buildEmptySide = () => ({
  code: null,
  amount: 0,
  inputAmount: '',
  isAmountValid: true,
  error: '',
  selectedIndex: null
});

export const getOtherSide = fromOrTo => {
  return fromOrTo === Side.From ? Side.To : Side.From;
};
