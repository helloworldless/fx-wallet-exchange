import { mockWalletData } from '../data/mockData';
import { validateExchange } from '../utils/exchangeUtil';

// Default delay to simulate API call
const DELAY = 1000;

const isValid = ({ userId, from, to, rate, wallets }) => {
  // TODO - Do some validation to make sure the rate is valid
  return validateExchange({ from, to, wallets });
};

const walletsHistory = {};
Object.keys(mockWalletData).forEach(
  userId => (walletsHistory[userId] = [mockWalletData[userId]])
);

const getLatestWallets = ({ userId }) => {
  const history = walletsHistory[userId];
  return history[history.length - 1];
};

const addWalletsHistory = ({ userId, wallets }) => {
  const history = walletsHistory[userId];
  history.push(wallets);
};

// userId: [{from, to, rate}]
const exchangeHistory = {};

const addExchangeHistory = ({ userId, from, to, rate }) => {
  const existingHistory = exchangeHistory[userId];
  const nextHistory = existingHistory ? [...existingHistory] : [];
  nextHistory.push({ userId, from, to, rate });
  exchangeHistory[userId] = nextHistory;
};

class WalletsApi {
  static async getWalletsByUserId({ userId }) {
    return new Promise(resolve => {
      setTimeout(() => {
        const wallets = getLatestWallets({ userId });
        resolve({
          wallets,
          exchangeHistory: exchangeHistory[userId]
        });
      }, DELAY);
    });
  }

  static async exchange({ userId, from, to, rate }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const wallets = { ...getLatestWallets({ userId }) };

        const valid = isValid({ userId, from, to, rate, wallets });
        if (!valid) {
          reject('Invalid exchange');
        }

        const newWallets = Object.values(wallets).reduce(
          (newWallets, wallet) => {
            const newWallet = { ...wallet };
            if (wallet.currencyCode === from.code) {
              newWallet.amount = wallet.amount - from.amount;
            }
            if (wallet.currencyCode === to.code) {
              newWallet.amount = wallet.amount + to.amount;
            }
            newWallets[wallet.currencyCode] = newWallet;
            return newWallets;
          },
          {}
        );

        addWalletsHistory({ userId, wallets: newWallets });
        addExchangeHistory({ userId, from, to, rate });
        resolve({
          wallets: newWallets,
          exchangeHistory: exchangeHistory[userId]
        });
      }, DELAY);
    });
  }

  static async getExchangeHistory({ userId }) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(exchangeHistory[userId]);
      }, DELAY);
    });
  }
}

export default WalletsApi;
