import React, { Component } from 'react';

import { getWalletsByUserId } from '../api/walletApi';
import { mockUserId } from '../utils/mockData';
import WalletsContainer from './WalletsContainer';

const ApiState = {
  Init: 'Init',
  Fetching: 'Fetching',
  Failed: 'Failed',
  Suceeded: 'Succeeded'
};

class App extends Component {
  state = {
    userId: mockUserId, // Hard-coded for demo app
    wallets: [],
    walletApiState: ApiState.Init,
    walletApiError: null
  };

  async componentDidMount() {
    this.setState({ walletApiState: ApiState.Fetching, walletApiError: null });
    try {
      const wallets = await getWalletsByUserId({
        userId: this.state.userId
      });
      this.setState({ wallets, walletApiState: ApiState.Suceeded });
    } catch (e) {
      console.error(e);
      this.setState({ walletApiState: ApiState.Failed, walletApiError: e });
    }
  }

  render() {
    const { walletApiState, wallets } = this.state;
    return (
      <div style={{ margin: '1rem', textAlign: 'center' }}>
        {walletApiState === ApiState.Fetching && <div>Loading wallets...</div>}
        {walletApiState === ApiState.Failed && <div>An error occurred...</div>}
        {wallets.length > 0 && (
          <WalletsContainer wallets={this.state.wallets} />
        )}
      </div>
    );
  }
}

export default App;
