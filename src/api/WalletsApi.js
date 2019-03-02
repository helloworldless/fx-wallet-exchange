import { mockWalletData } from '../data/mockData';

// Default delay to simulate API call
const DELAY = 1000;

const isValid = ({ userId, from, to, rate, wallets }) => {
  const rateValid = true; // Do some validation to make sure the rate is valid

  const fromWallet = wallets.find(wallet => wallet.currencyCode === from.code);
  const fromValid = fromWallet && from.amount <= fromWallet.amount;

  const toWallet = wallets.find(wallet => wallet.currencyCode === to.code);
  const toValid = toWallet !== null && toWallet !== undefined;

  return rateValid && fromValid && toValid;
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
        const wallets = [...getLatestWallets({ userId })];

        const valid = isValid({ userId, from, to, rate, wallets });
        if (!valid) {
          reject('Invalid exchange');
        }

        const newWallets = wallets.map(wallet => {
          const newWallet = { ...wallet };
          if (wallet.currencyCode === from.code) {
            newWallet.amount = wallet.amount - from.amount;
          }
          if (wallet.currencyCode === to.code) {
            newWallet.amount = wallet.amount + to.amount;
          }

          return newWallet;
        });

        addWalletsHistory({ userId, wallets: newWallets });
        addExchangeHistory({ userId, from, to, rate });
        debugger;
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
