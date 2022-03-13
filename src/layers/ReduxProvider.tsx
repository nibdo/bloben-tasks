import { Provider } from 'react-redux';
import { createStore } from 'redux';
import React, { useEffect, useState } from 'react';

import { saveState } from '../redux/localstorage';
import LocalForage from '../utils/LocalForage';
import rootReducer, { initialReduxState } from 'redux/reducers';

export let reduxStore: any;

interface ReduxProviderProps {
  isStorageLoaded?: boolean;
  state?: any;
  children: any;
}
const ReduxProvider = (props: ReduxProviderProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    reduxStore = createStore(rootReducer, initialReduxState);
  }, []);

  useEffect(() => {
    LocalForage.getItem('rootTodos')
      .then((storage: any) => {
        reduxStore = createStore(rootReducer, storage || initialReduxState);
        setIsLoaded(true);

        reduxStore.subscribe(() => {
          saveState();
        });
      })
      .catch((e: any) => {
        // eslint-disable-next-line no-console
        console.log('Local storage error', e);
      });
  }, []);

  return isLoaded ? (
    <Provider store={reduxStore}>{props.children}</Provider>
  ) : null;
};

export default ReduxProvider;
