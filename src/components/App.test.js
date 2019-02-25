import React from 'react';
import App from './App';
import { render, waitForElement, cleanup } from 'react-testing-library';
import { getWalletsByUserId } from '../api/walletsApi';
import { mockWalletData, mockUserId } from '../utils/mockData';

import { Provider } from 'react-redux';
import configureStore from '../store/configureStore';
import { loadWallets } from '../actions/walletsActions';

jest.mock('../api/walletsApi');
getWalletsByUserId.mockImplementation(({ userId }) =>
  Promise.resolve(mockWalletData[userId])
);

describe('App', () => {
  afterEach(cleanup);

  it('renders without crashing', () => {
    // only creat store; no need to dispatch anything for simple render test
    const store = configureStore();
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
  });

  it('displays loading message', () => {
    // only create store
    // don't dispatch loadWallets and we should get the loading message
    const store = configureStore();

    const { getByText } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(getByText(/loading/i)).toBeInTheDocument();
  });

  it('calls the wallet API', () => {
    const store = configureStore();
    store.dispatch(loadWallets());

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(getWalletsByUserId).toHaveBeenCalledWith({
      userId: mockUserId
    });
  });

  it('renders wallet', async () => {
    const store = configureStore();
    store.dispatch(loadWallets());

    const { getByText } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    // wait and search for each currency in the mock wallet data
    await waitForElement(() =>
      mockWalletData[mockUserId].map(wallet =>
        getByText(new RegExp(wallet.currencyCode))
      )
    );
  });

  it('displays an error if the API call fails', async () => {
    getWalletsByUserId.mockImplementation(({ userId }) =>
      Promise.reject('error message for testing')
    );

    const store = configureStore();
    store.dispatch(loadWallets());

    const { getByText } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    await waitForElement(() => getByText(/error/i));
  });
});
