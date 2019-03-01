import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import configureStore from './store/configureStore';
import { loadRates } from './actions/ratesActions';
import Root from './components//Root';

const store = configureStore();

const loadRatesAction = loadRates();
store.dispatch(loadRatesAction);
// setInterval(() => store.dispatch(loadRatesAction), 10000);

ReactDOM.render(<Root store={store} />, document.getElementById('root'));
