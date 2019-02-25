import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import { loadWallets } from './actions/walletsActions';

const store = configureStore();
store.dispatch(loadWallets());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
