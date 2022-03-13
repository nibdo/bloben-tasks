import './Header.scss';
import {
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
} from '@chakra-ui/react';
import { Context } from '../../context/store';
import { initialReduxState } from '../../redux/reducers';
import { replace } from '../../redux/actions';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import CalDavTaskApi from '../../api/CalDavTaskApi';
import PersonIcon from '../eva-icons/person';
import React, { useContext } from 'react';
import RefreshIcon from '../eva-icons/refresh';
import Separator from '../separator/Separator';
import SettingsIcon from '../eva-icons/settings';
import UserApi from '../../api/UserApi';

const Header = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [store, dispatchContext] = useContext(Context);
  const setContext = (type: string, payload: any) => {
    dispatchContext({ type, payload });
  };
  const { isSyncing, isMobile } = store;

  const handleOpenSettings = () => {
    setContext('settingsOpen', true);
  };

  const handleLogout = async () => {
    await UserApi.logout();

    dispatch(replace(initialReduxState));
    history.push('/tasks');
    setContext('isLogged', false);
  };

  const handleRefresh = async () => {
    setContext('isSyncing', true);
    await CalDavTaskApi.sync();
    setContext('isSyncing', false);
  };

  return (
    <Flex
      direction={'column'}
      paddingLeft={isMobile ? 16 : 8}
      paddingRight={isMobile ? 6 : 14}
    >
      {!isMobile ? (
        <Flex
          direction={'row'}
          justifyContent={'flex-end'}
          alignItems={'center'}
        >
          <Flex>
            {isSyncing ? (
              <Spinner color="red.500" className={'HeaderIcon'} />
            ) : (
              <IconButton
                _focus={{ boxShadow: 'none' }}
                variant={'ghost'}
                aria-label="Refresh"
                icon={<RefreshIcon className={'HeaderIcon'} />}
                isRound
                // size={"sm"}
                autoFocus={false}
                onClick={handleRefresh}
              />
            )}
            <Separator width={20} height={0} />
            <Menu closeOnSelect={true}>
              <MenuButton
                as={IconButton}
                _focus={{ boxShadow: 'none' }}
                variant={'ghost'}
                aria-label="Settings"
                isRound
                icon={<SettingsIcon className={'HeaderIcon'} />}
                fontSize={14}
              />
              <MenuList zIndex={9991}>
                <MenuItem
                  as={Button}
                  _focus={{ boxShadow: 'none' }}
                  leftIcon={<SettingsIcon className={'SettingsMenu__icon'} />}
                  variant={'ghost'}
                  onClick={handleOpenSettings}
                  isFullWidth={true}
                  justifyContent={'flex-start'}
                  fontSize={14}
                >
                  Settings
                </MenuItem>
                <MenuItem
                  as={Button}
                  _focus={{ boxShadow: 'none' }}
                  leftIcon={<PersonIcon className={'SettingsMenu__icon'} />}
                  variant={'ghost'}
                  onClick={handleLogout}
                  isFullWidth={true}
                  justifyContent={'flex-start'}
                  fontSize={14}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      ) : null}
      <Flex
        direction={'row'}
        paddingLeft={isMobile ? 0 : 8}
        flex={1}
        // paddingRight={14}
      >
        {isMobile ? (
          <>
            <Flex flex="1" justifyContent={'flex-end '}>
              {isSyncing ? (
                <Spinner color="red.500" />
              ) : (
                <IconButton
                  _focus={{ boxShadow: 'none' }}
                  variant={'ghost'}
                  aria-label="Refresh"
                  icon={<RefreshIcon className={'HeaderModal__icon'} />}
                  isRound
                  // size={"sm"}
                  autoFocus={false}
                  onClick={handleRefresh}
                />
              )}
            </Flex>
          </>
        ) : null}
      </Flex>
    </Flex>
  );
};

export default Header;
