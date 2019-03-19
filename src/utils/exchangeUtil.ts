import { round } from './util';

// zero or more numeric digits, e.g. '', '100'
// or one or more numeric digits followed by a point plus exactly two more numeric digits, e.g. 123.45
// we allow zero digits (a blank string) as this will be interpreted as zero (0)
const regexMoney = /^(-?\d*|-?\d+\.\d{2})$/;
const validFormatMessage = 'Amount should be of the format 123.45';

export const isValidMoneyFormat = ({ amountAsString }: {amountAsString: string}) => {
  const valid = regexMoney.test(amountAsString);
  if (!valid) {
    return { valid: false, message: validFormatMessage };
  }

  return { valid: true };
};

enum Side {
  From = 'from', 
  To = 'to'
}

type SideParams = {
  code: string,
  amount: number,
  inputAmount: string,
  isAmountValid: boolean,
  error: string,
  selectedIndex: number
}

type SideParamsDefaults = {
  code: string | null,
  amount: number | null,
  inputAmount: string | null,
  isAmountValid: boolean | null,
  error: string | null,
  selectedIndex: number | null
}

type Wallet = {
  currencyCode: string,
  currencyName: string,
  amount: number
}

type Wallets = {
  [currencyCode: string]: Wallet
}

type ValidationResult = {
  valid: boolean, 
  error?: string
}

type ExchangeValidationParameters = {
  from: SideParams,
  to: SideParams,
  wallets: Wallets
}

type ExchangeValidator = (obj: ExchangeValidationParameters) => ValidationResult;

const runValidations = ({ from, to, wallets }: ExchangeValidationParameters, fns: Array<ExchangeValidator>) => {
  for (let fn of fns) {
    const { valid, error } = fn({ from, to, wallets });
    if (!valid) return { valid, error };
  }
  return { valid: true };
};

const sidesValid = ({ from, to }: {from: SideParams, to: SideParams}) => {
  if (from.code === to.code) {
    return {
      valid: false,
      error: 'Please select two different currencies'
    };
  }
  return { valid: true };
};

const amountValid = ({ from, to }: {from: SideParams, to: SideParams}) => {
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

const overdraftValid = ({ from, to, wallets }: ExchangeValidationParameters) => {
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

const moneyFormatValid = ({ from, to, wallets }: ExchangeValidationParameters) => {
  const { valid, message } = isValidMoneyFormat({
    amountAsString: from.inputAmount
  });

  if (!valid) {
    return { valid: false, error: message };
  }

  return { valid: true };
};

const validationFns: Array<ExchangeValidator> = [
  sidesValid,
  amountValid,
  overdraftValid,
  moneyFormatValid
];

export const validateExchange = ({ from, to, wallets }: ExchangeValidationParameters) => {
  return runValidations({ from, to, wallets }, validationFns);
};

export const checkOverdraft = ({ fromOrTo, amount, currencyCode, wallets }: {fromOrTo: Side, amount: number, currencyCode: string, wallets: Wallets}) => {
  if (fromOrTo === Side.To) {
    return false;
  }
  return amount > wallets[currencyCode].amount;
};

export const overdraftMessage = 'Value exceeds amount in wallet';

export const buildEmptySide = (): SideParamsDefaults => ({
  code: null,
  amount: 0,
  inputAmount: '',
  isAmountValid: true,
  error: '',
  selectedIndex: null
});

type Sides = {
  from: SideParams,
  to: SideParams
}

export const getFromAndToDefaults = ({ availableCurrencyCodes }: {availableCurrencyCodes: Array<string>}): Sides => {
  const from: SideParamsDefaults = buildEmptySide();
  from.code = availableCurrencyCodes[0];
  from.selectedIndex = 0;
  const to: SideParamsDefaults = buildEmptySide();
  to.code = availableCurrencyCodes[1];
  to.selectedIndex = 1;
  return { from, to } as Sides;
};

export const getOtherSide = (fromOrTo: Side): Side => {
  return fromOrTo === Side.From ? Side.To : Side.From;
};

export const amountToString = (amount: number): string => {
  return amount === 0 ? '' : String(amount.toFixed(2));
};

export const convert = ({ shouldInvert, amount, rate }: {shouldInvert: boolean, amount: number, rate: number}): number => {
  return shouldInvert ? amount * (1 / rate) : amount * rate;
};

export const roundTwoDecimals = ({ amount }: {amount: number}) => {
  return round(amount, -2);
};

type Rates = {
  [pair: string]: number
}

export const getUpdatedFollowerSide = ({
  driver,
  driverSideParams,
  followerSideParams,
  wallets,
  rates
}: {
  driver: Side,
  driverSideParams: SideParams,
  followerSideParams: SideParams,
  wallets: Wallets,
  rates: Rates
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
      // if the driver is To, then other side is From and we need to do overdraft check
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
