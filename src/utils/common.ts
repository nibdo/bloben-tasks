import { TOAST_POSITION, TOAST_STATUS } from '../types/enums';

export const createToast = (text?: string, status?: TOAST_STATUS) => {
  if (!text) {
    return {
      title: 'Unknown error',
      status,
      position: TOAST_POSITION.TOP,
      isClosable: true,
    };
  }
  if (status) {
    return {
      title: text,
      status,
      position: TOAST_POSITION.TOP,
      isClosable: true,
    };
  }
  return {
    title: text,
    position: TOAST_POSITION.TOP,
    isClosable: true,
  };
};

export const getApiBaseUrl = (url: string) => url.slice(0, url.indexOf('/api'));

export const generateRandomSimpleString = (stringLength = 32) => {
  const charset = '0123456789abcdefghijklmnopqrstuvwxyz';
  let i = 0;
  let result = '';
  while (i < stringLength) {
    result += charset.charAt(Math.random() * charset.length);
    i += 1;
  }

  return result;
};

export const parseCssDark = (className: string, isDark?: boolean): string =>
  isDark ? `${className}-dark` : className;

export const getHostname = () => {
  if (process.env.REACT_APP_NODE_ENV === 'development') {
    return 'http://localhost:8080';
  } else {
    return `${window.location.protocol}//${window.location.hostname}`;
  }
};
