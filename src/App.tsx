import React from 'react';

import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';
import AppRouter from './pages/Router';
import AuthProvider from './layers/AuthProvider';
import BrowserProvider from './layers/BrowserProvider';
import ContextProvider from 'layers/ContextProvider';
import ReduxProvider from './layers/ReduxProvider';
import SocketioProvider from './layers/SocketioProvider';
import StorageProvider from 'layers/StorageProvider';
import StoreProvider from './context/store';
import ThemeWrapper from './components/themeWrapper/ThemeWrapper';

const breakpoints = createBreakpoints({
  sm: '749px',
  lg: '751px',
  md: '99999px',
  xl: '999999px',
});

const theme = extendTheme({
  breakpoints,
  colors: {
    primary: {
      200: '#EC407AB2',
      400: '#ec407a',
    },
  },
});

const App = () => (
  <ChakraProvider theme={theme}>
    <ThemeWrapper>
      <StoreProvider>
        <StorageProvider>
          <ContextProvider>
            <ReduxProvider>
              <BrowserProvider>
                <AuthProvider>
                  <SocketioProvider>
                    <AppRouter />
                  </SocketioProvider>
                </AuthProvider>
              </BrowserProvider>
            </ReduxProvider>
          </ContextProvider>
        </StorageProvider>
      </StoreProvider>
    </ThemeWrapper>
  </ChakraProvider>
);

export default App;
