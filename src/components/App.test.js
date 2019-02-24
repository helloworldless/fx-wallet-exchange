import React from 'react';
import App from './App';
import { render, waitForElement, cleanup } from 'react-testing-library';
import { getWalletsByUserId } from '../api/walletApi';
import { mockWalletData, mockUserId } from '../utils/mockData';

afterEach(cleanup);

jest.mock('../api/walletApi');
getWalletsByUserId.mockImplementation(({ userId }) =>
  Promise.resolve(mockWalletData[userId])
);

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
  });

  it('displays loading message', () => {
    const { getByText } = render(<App />);
    expect(getByText(/loading/i)).toBeInTheDocument();
  });

  it('calls the wallet API', () => {
    render(<App />);
    expect(getWalletsByUserId).toHaveBeenCalledWith({
      userId: mockUserId
    });
  });

  it('renders wallet', async () => {
    const { getByText } = render(<App />);
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
    const { getByText } = render(<App />);
    await waitForElement(() => getByText(/error/i));
  });
});
