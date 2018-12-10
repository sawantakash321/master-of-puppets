import { getStore } from 'kea';
import { compose } from 'redux';
import sagaPlugin from 'kea-saga';

const composeFunction = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default getStore({
  plugins: [sagaPlugin],
  paths: ['cw'],
  reducers: {},
  preloadedState: undefined,
  middleware: [],
  compose: composeFunction,
  enhancers: []
});
