const mockUserId = 101;

const mockWalletData = {
  [mockUserId]: [
    {
      currencyCode: 'USD',
      currencyName: 'American Dollar',
      amount: 87.12
    },
    {
      currencyCode: 'GBP',
      currencyName: 'British Pound',
      amount: 33.9
    },
    {
      currencyCode: 'EUR',
      currencyName: 'Euro',
      amount: 9.61
    }
  ]
};

export { mockWalletData, mockUserId };
