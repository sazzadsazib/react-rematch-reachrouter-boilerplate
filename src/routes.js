import React from 'react';
import { Router } from '@reach/router';
import HomePage from './Pages/HomePage/HomePage';
import store from './store';
import { Provider } from 'react-redux';
import { getPersistor } from '@rematch/persist';
import { PersistGate } from 'redux-persist/es/integration/react';


const Routes = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={getPersistor()}>
        <Router>
          <HomePage path='/' />
          <HomePage default />
        </Router>
      </PersistGate>
    </Provider>
  );
};

export default Routes;
