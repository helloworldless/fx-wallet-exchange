import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Wallet, { walletPropTypes } from './Wallet';
import Swipeable from '../common/Swipeable';
import NavigationalButton from '../common/NavigationalButton';

class WalletsContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { index: 0 };
  }

  handleChangeIndexSwipeable = index => {
    this.setState({
      index
    });
  };

  handleChangeIndexSwipeable = index => {
    this.setState({
      index
    });
  };
  handleChangeIndexButton = event => {
    const index = event.currentTarget.getAttribute('data-index');
    console.log('index', index);
    const parsedIndex = parseInt(index, 10);
    console.log('parsedIndex', parsedIndex);
    this.setState({
      index: parsedIndex
    });
  };

  render() {
    return (
      <div>
        <Swipeable
          index={this.state.index}
          handleChangeIndex={this.handleChangeIndexSwipeable}
        >
          {this.props.wallets.map(wallet => (
            <Wallet
              key={wallet.currencyCode}
              currencyCode={wallet.currencyCode}
              currencyName={wallet.currencyName}
              amount={wallet.amount}
            />
          ))}
        </Swipeable>
        <div>
          {this.props.wallets.map((wallet, i) => (
            <NavigationalButton
              key={wallet.currencyCode}
              isActive={this.state.index === i}
              index={i}
              handleClick={this.handleChangeIndexButton}
            />
          ))}
        </div>
      </div>
    );
  }
}

WalletsContainer.propTypes = {
  wallets: PropTypes.arrayOf(
    PropTypes.shape({
      ...walletPropTypes
    })
  ).isRequired
};

export default WalletsContainer;
