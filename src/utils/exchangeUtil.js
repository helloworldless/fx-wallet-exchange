import { Side } from '../constants/constants';
import { round } from './util';

// zero or more numeric digits, e.g. '', '100'
// or one or more numeric digits followed by a point plus exactly two more numeric digits, e.g. 123.45
// we allow zero digits (a blank string) as this will be interpreted as zero (0)
const regexMoney = /^(-?\d*|-?\d+\.\d{2})$/;
const validFormatMessage = 'Amount should be of the format 123.45';

export const isValidMoneyFormat = ({ amountAsString }) => {
  const valid = regexMoney.test(amountAsString);
  if (!valid) {
    return { valid: false, message: validFormatMessage };
  }

  return { valid: true };
};

const runValidations = ({ from, to, wallets }, fns) => {
  for (let fn of fns) {
    const { valid, error } = fn({ from, to, wallets });
    if (!valid) return { valid, error };
  }
  return { valid: true };
};

const sidesValid = ({ from, to }) => {
  if (from.code === to.code) {
    return {
      valid: false,
      error: 'Please select two different currencies'
    };
  }
  return { valid: true };
};

const amountValid = ({ from, to }) => {
  if (from.amount === 0) {
    return {
      valid: false,
      error: 'Please enter non-zero amount'
    };
  }
  if (!from.isAmountValid || !to.isAmountValid) {
    return {
      valid: false,
      error: from.error || to.error
    };
  }
  return { valid: true };
};

const overdraftValid = ({ from, to, wallets }) => {
  if (
    checkOverdraft({
      fromOrTo: Side.From,
      amount: from.amount,
      currencyCode: from.code,
      wallets
    })
  ) {
    return { valid: false, error: 'Insufficient funds' };
  }
  return { valid: true };
};

const moneyFormatValid = ({ from, to, wallets }) => {
  const { valid, message } = isValidMoneyFormat({
    amountAsString: from.inputAmount
  });

  if (!valid) {
    return { valid: false, error: message };
  }

  return { valid: true };
};

const validationFns = [
  sidesValid,
  amountValid,
  overdraftValid,
  moneyFormatValid
];

export const validateExchange = ({ from, to, wallets }) => {
  return runValidations({ from, to, wallets }, validationFns);
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

export const getFromAndToDefaults = ({ availableCurrencyCodes }) => {
  const from = buildEmptySide();
  from.code = availableCurrencyCodes[0];
  from.selectedIndex = 0;
  const to = buildEmptySide();
  to.code = availableCurrencyCodes[1];
  to.selectedIndex = 1;
  return { from, to };
};

export const getOtherSide = fromOrTo => {
  return fromOrTo === Side.From ? Side.To : Side.From;
};

export const amountToString = amount => {
  return amount === 0 ? '' : String(amount.toFixed(2));
};

export const convert = ({ shouldInvert, amount, rate }) => {
  return shouldInvert ? amount * (1 / rate) : amount * rate;
};

export const roundTwoDecimals = ({ amount }) => {
  return round(amount, -2);
};

export const getUpdatedFollowerSide = ({
  driver,
  driverSideParams,
  followerSideParams,
  wallets,
  rates
}) => {
  const updatedFollowerSideParams = { ...followerSideParams };
  const fromCode =
    driver === Side.From ? driverSideParams.code : followerSideParams.code;
  const toCode =
    driver === Side.From ? followerSideParams.code : driverSideParams.code;
  const rate = rates[fromCode + toCode] || 1;

  if (driver === Side.From) {
    updatedFollowerSideParams.amount = roundTwoDecimals({
      amount: driverSideParams.amount * rate
    });
    updatedFollowerSideParams.inputAmount = amountToString(
      updatedFollowerSideParams.amount
    );
    updatedFollowerSideParams.isAmountValid = true;
    updatedFollowerSideParams.error = '';
  } else {
    // driver is To
    updatedFollowerSideParams.amount = roundTwoDecimals({
      amount: driverSideParams.amount * (1 / rate)
    });
    updatedFollowerSideParams.inputAmount = amountToString(
      updatedFollowerSideParams.amount
    );

    if (wallets) {
      // if the driver is to, then other side is from; need to do overdraft check
      const isOverdraft = checkOverdraft({
        fromOrTo: Side.From,
        amount: updatedFollowerSideParams.amount,
        currencyCode: updatedFollowerSideParams.code,
        wallets
      });
      updatedFollowerSideParams.isAmountValid = !isOverdraft;
      updatedFollowerSideParams.error = isOverdraft ? overdraftMessage : '';
    } else {
      console.error(
        'Expected update call with driver = To to supply wallets for overdraft calculation, but wallets were not provided'
      );
    }
  }

  return updatedFollowerSideParams;
};
