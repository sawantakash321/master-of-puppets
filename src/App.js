import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './utils/store';
import Routes from './routes';
import './App.css';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Routes />
      </Provider>
    );
  }
}

export default App;
