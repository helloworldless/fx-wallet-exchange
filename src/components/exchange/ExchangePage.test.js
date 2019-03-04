import React from 'react';
import ExchangePage from './ExchangePage';
import {
  render,
  waitForElement,
  cleanup,
  fireEvent
} from 'react-testing-library';
import WalletsApi from '../../api/WalletsApi';
import { mockWalletData, mockUserId } from '../../data/mockData';
import { Provider } from 'react-redux';
import configureStore from '../../store/configureStore';
import { BrowserRouter } from 'react-router-dom';
import { loadRates } from '../../actions/ratesActions';
import { loadWallets } from '../../actions/walletsActions';
import { mockRates, availableCurrencyCodes } from '../../data/mockData';
import FxRatesApi from '../../api/FxRatesApi';
import { getFromAndToDefaults, amountToString } from '../../utils/exchangeUtil';
import { round } from '../../utils/util';

jest.mock('../../api/WalletsApi');
WalletsApi.getWalletsByUserId.mockImplementation(({ userId }) =>
  Promise.resolve({
    wallets: mockWalletData[userId],
    exchangeHistory: {}
  })
);

jest.mock('../../api/FxRatesApi');
FxRatesApi.getRates.mockImplementation(() => ({
  rates: { ...mockRates },
  availableCurrencyCodes
}));

describe('ExchangePage', () => {
  afterEach(cleanup);

  it('renders without crashing', () => {
    // only creat store; no need to dispatch anything for simple render test
    const store = configureStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ExchangePage />
        </BrowserRouter>
      </Provider>
    );
  });

  it('displays loading message', () => {
    // only create store
    // don't dispatch loadWallets and we should get the loading message
    const store = configureStore();

    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <ExchangePage />
        </BrowserRouter>
      </Provider>
    );
    expect(getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays all wallets', async () => {
    const store = configureStore();
    store.dispatch(loadRates());
    store.dispatch(loadWallets({ userId: mockUserId }));

    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <ExchangePage />
        </BrowserRouter>
      </Provider>
    );

    // wait and search for the wallets using the default selected currencies
    const { from, to } = getFromAndToDefaults({ availableCurrencyCodes });
    const defaultWallets = Object.values(mockWalletData[mockUserId]).filter(
      wallet =>
        wallet.currencyCode === from.code || wallet.currencyCode === to.code
    );
    await waitForElement(() =>
      defaultWallets.map(wallet => {
        expect(getByText(new RegExp(wallet.currencyCode))).toBeInTheDocument();
        expect(getByText(new RegExp(wallet.amount))).toBeInTheDocument();
      })
    );
  });

  it('calculates the correct To amount based on From input', async () => {
    const store = configureStore();
    store.dispatch(loadRates());
    store.dispatch(loadWallets({ userId: mockUserId }));

    const { getByTestId } = render(
      <Provider store={store}>
        <BrowserRouter>
          <ExchangePage />
        </BrowserRouter>
      </Provider>
    );

    const fromInput = await waitForElement(() =>
      getByTestId('exchange-input-from')
    );

    const { rates, availableCurrencyCodes } = FxRatesApi.getRates();
    const { from, to } = getFromAndToDefaults({ availableCurrencyCodes });

    const { wallets } = await WalletsApi.getWalletsByUserId({
      userId: mockUserId
    });

    const testFromValue = amountToString(wallets[from.code].amount - 1);
    const parsed = parseFloat(testFromValue);

    const rate = rates[from.code + to.code];

    const expectedToAmountString = amountToString(round(parsed * rate, -2));

    fireEvent.change(fromInput, { target: { value: testFromValue } });

    const toInput = await waitForElement(() =>
      getByTestId('exchange-input-to')
    );
    expect(toInput.value).toBe(expectedToAmountString);
  });

  it('displays an error on overdraft', async () => {
    const store = configureStore();
    store.dispatch(loadRates());
    store.dispatch(loadWallets({ userId: mockUserId }));

    const { getByTestId, getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <ExchangePage />
        </BrowserRouter>
      </Provider>
    );

    const fromInput = await waitForElement(() =>
      getByTestId('exchange-input-from')
    );

    const { availableCurrencyCodes } = FxRatesApi.getRates();
    const { from } = getFromAndToDefaults({ availableCurrencyCodes });

    const { wallets } = await WalletsApi.getWalletsByUserId({
      userId: mockUserId
    });

    const testFromValue = amountToString(wallets[from.code].amount + 1);

    fireEvent.change(fromInput, { target: { value: testFromValue } });

    expect(getByText(new RegExp('exceeds'))).toBeInTheDocument();
  });
});

// TODO
// Add tests for other scenarios and corner cases
// Values should be updated when changing currencies
// Invalid exchanges should be blocked, and an error should be displayed
// A successful exchange should redirect to /wallets and the new exchange should be displaye in history
// etc. etc.
