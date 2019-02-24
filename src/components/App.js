import React, { Component } from 'react';
import Wallet from './Wallet';
import Swipeable from './Swipeable';

class App extends Component {
  state = {
    wallets: [
      // Hard code for now; this will populate from API call
      {
        currencyCode: 'USD',
        currencyName: 'American Dollar',
        currencySymbol: '$',
        amount: 87.12
      },
      {
        currencyCode: 'GBP',
        currencyName: 'British Pound',
        currencySymbol: '£',
        amount: 33.9
      },
      {
        currencyCode: 'EUR',
        currencyName: 'Euro',
        currencySymbol: '€',
        amount: 9.61
      }
    ]
  };

  render() {
    return (
      <div style={{ margin: '1rem' }}>
        <Swipeable>
          {this.state.wallets.map(wallet => (
            <Wallet
              key={wallet.currencyCode}
              currencyCode={wallet.currencyCode}
              currencyName={wallet.currencyName}
              currencySymbol={wallet.currencySymbol}
              amount={wallet.amount}
            />
          ))}
        </Swipeable>
      </div>
    );
  }
}

export default App;
