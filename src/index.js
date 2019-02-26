import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import configureStore from './store/configureStore';
import { loadWallets } from './actions/walletsActions';
import Root from './components//Root';

const store = configureStore();
store.dispatch(loadWallets());

ReactDOM.render(<Root store={store} />, document.getElementById('root'));
