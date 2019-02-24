import { mockWalletData } from '../utils/mockData';

// Default delay to simulate API call
const DELAY = 1000;

const getWalletsByUserId = ({ userId }) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockWalletData[userId]);
    }, DELAY);
  });
};

export { getWalletsByUserId };
