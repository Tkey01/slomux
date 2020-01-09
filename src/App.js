import React from 'react';
import { createStore, reducer, Provider } from './store';
import { Timer } from './components/Timer';

export const App = () => (
  <Provider store={createStore(reducer, 1)}>
    <Timer />
  </Provider>
);

