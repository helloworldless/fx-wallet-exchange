import { mockWalletData } from '../data/mockData';

// Default delay to simulate API call
const DELAY = 1000;

const WalletsApi = {
  getWalletsByUserId({ userId }) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockWalletData[userId]);
      }, DELAY);
    });
  }
};

export default WalletsApi;
