import { Route } from 'react-router-dom';
import Main from './main/Main';
import React from 'react';

import Settings from './settings/Settings';
import SyncLayer from 'layers/SyncLayer';

const AppRouter = () => {
  return (
    <SyncLayer>
      <Route path={'/'} component={() => <Main />} />
      <Settings />
    </SyncLayer>
  );
};

export default AppRouter;
