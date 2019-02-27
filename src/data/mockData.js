import { createPair } from '../utils/util';
import { Currency, CurrencyMetadata } from '../constants/constants';

const mockUserId = 101;

const mockWalletData = {
  [mockUserId]: [
    {
      currencyCode: Currency.USD,
      currencyName: CurrencyMetadata[Currency.USD].name,
      amount: 87.12
    },
    {
      currencyCode: Currency.GBP,
      currencyName: CurrencyMetadata[Currency.GBP].name,
      amount: 33.9
    },
    {
      currencyCode: Currency.EUR,
      currencyName: CurrencyMetadata[Currency.EUR].name,
      amount: 9.61
    }
  ]
};

// Based on data from https://openexchangerates.org
// TODO - Extract this into a function which transforms the data from the API call
const availableCurrencies = [Currency.USD, Currency.GBP, Currency.EUR];
const mockRatesDataMap = new Map();
mockRatesDataMap.set(createPair(Currency.USD, Currency.EUR), 0.877693);
mockRatesDataMap.set(createPair(Currency.USD, Currency.GBP), 0.754209);
mockRatesDataMap.set(createPair(Currency.EUR, Currency.GBP), 1.163726);
mockRatesDataMap.set(createPair(Currency.EUR, Currency.USD), 1.13935);
mockRatesDataMap.set(createPair(Currency.GBP, Currency.USD), 1.325892);
mockRatesDataMap.set(createPair(Currency.GBP, Currency.EUR), 0.859308);

export { mockWalletData, mockUserId, mockRatesDataMap, availableCurrencies };
