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

const getLatestWallets = userId => {
  const history = walletsHistory[userId];
  return history[history.length - 1];
};

const addWalletsHistory = (userId, wallets) => {
  walletsHistory[userId].push(wallets);
};

const WalletsApi = {
  getWalletsByUserId({ userId }) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(getLatestWallets(userId));
      }, DELAY);
    });
  },
  exchange({ userId, from, to, rate }) {
    return new Promise(resolve => {
      setTimeout(() => {
        const wallets = [...getLatestWallets(userId)];

        const valid = isValid({ userId, from, to, rate, wallets });
        if (!valid) {
          throw new Error('Invalid exchange');
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

        addWalletsHistory(userId, newWallets);
        resolve(newWallets);
      }, DELAY);
    });
  }
};

export default WalletsApi;
