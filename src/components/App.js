// import React, { Component } from 'react';
import React from 'react';

// import { getWalletsByUserId } from '../api/walletsApi';
// import { mockUserId } from '../utils/mockData';
import WalletsContainer from './wallet/WalletsContainer';

// import { connect } from 'react-redux';

const App = () => {
  return <WalletsContainer />;
};

// class App extends Component {
// state = {
// userId: mockUserId, // Hard-coded for demo app
// wallets: []
// walletApiState: ApiState.Init,
// walletApiError: null
// };

// async componentDidMount() {
//   this.setState({ walletApiState: ApiState.Fetching, walletApiError: null });
//   try {
//     const wallets = await getWalletsByUserId({
//       userId: this.state.userId
//     });
//     this.setState({ wallets, walletApiState: ApiState.Suceeded });
//   } catch (e) {
//     console.error(e);
//     this.setState({ walletApiState: ApiState.Failed, walletApiError: e });
//   }
// }

// render() {
//   debugger;
//   const { wallets } = this.props;
//   return (
//     <div style={{ margin: '1rem', textAlign: 'center' }}>
//       {wallets.length > 0 ? (
//         <WalletsContainer wallets={wallets} />
//       ) : (
//         'Loading wallets...'
//       )}
//     </div>
//   );
// const { walletApiState, wallets } = this.state;
// return (
//   <div style={{ margin: '1rem', textAlign: 'center' }}>
//     {walletApiState === ApiState.Fetching && <div>Loading wallets...</div>}
//     {walletApiState === ApiState.Failed && <div>An error occurred...</div>}
//     {wallets.length > 0 && (
//       <WalletsContainer wallets={this.props.wallets} />
//     )}
//   </div>
// );
// }

// }

// const mapStateToProps = state => {
//   debugger;
//   return { wallets: state.wallets };
// };

// export default connect(mapStateToProps)(App);
export default App;
