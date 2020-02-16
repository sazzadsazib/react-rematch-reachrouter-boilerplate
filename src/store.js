import { init } from '@rematch/core';
import createRematchPersist from '@rematch/persist';
import createLoadingPlugin from '@rematch/loading';
import createEncryptor from 'redux-persist-transform-encrypt';
import { homePage } from './Pages/HomePage/models/index';

const encryptor = createEncryptor({
  secretKey: process.env.REACT_APP_SECRET_KEY,
  onError: function(error) {
    console.log(error);
  },
});

const loading = createLoadingPlugin({});

const persistPlugin = createRematchPersist({
  key: 'boilerPlate',
  whitelist: [
    'homePage',
  ],
  throttle: 500,
  version: 1,
  transforms: [encryptor],
});

const models = {
  homePage // ...rest
};

const store = init({
  models,
  plugins: [persistPlugin, loading],
});

export default store;
