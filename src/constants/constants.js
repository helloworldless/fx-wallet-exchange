export const ApiState = {
  Init: 'Init',
  Fetching: 'Fetching',
  Failed: 'Failed',
  Suceeded: 'Succeeded'
};

export const paths = { root: '/', wallets: '/wallets', exchange: '/exchange' };

export const Currency = { USD: 'USD', GBP: 'GBP', EUR: 'EUR' };
export const CurrencyMetadata = {
  [Currency.USD]: { name: 'American Dollar' },
  [Currency.GBP]: { name: 'British Pound' },
  [Currency.EUR]: { name: 'Euro' }
};

export const Side = { From: 'from', To: 'to' };

export const Driver = { From: Side.From, To: Side.To };
