import { Button } from '@chakra-ui/react';
import { Context } from '../../context/store';
import { fontSizeNormal } from '../../types/constants';
import { initialReduxState } from '../../redux/reducers';
import { replace } from '../../redux/actions';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import BottomSheet from 'bottom-sheet-react';
import React, { useContext } from 'react';
import Separator from '../separator/Separator';
import UserApi from '../../api/UserApi';

interface BottomSheetCalendarsProps {
  isBottomSheetOpen: boolean;
  onClose: any;
}
const BottomSheetSettings = (props: BottomSheetCalendarsProps) => {
  const history = useHistory();
  const { isBottomSheetOpen, onClose } = props;

  const dispatch = useDispatch();
  const [, dispatchContext] = useContext(Context);
  const setContext = (type: string, payload: any) => {
    dispatchContext({ type, payload });
  };
  //
  // const handleOpenSettings = () => {
  //   setContext('settingsOpen', true);
  // };

  const handleLogout = async () => {
    await UserApi.logout();

    dispatch(replace(initialReduxState));
    history.push('/tasks');
    setContext('isLogged', false);
  };

  return (
    <>
      {isBottomSheetOpen ? (
        <BottomSheet
          {...props}
          customHeight={350}
          isExpandable={true}
          onClose={onClose}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: 16,
            }}
          >
            {/*<Separator height={6} />*/}
            {/*<Button*/}
            {/*  _focus={{ boxShadow: 'none' }}*/}
            {/*  justifyContent={'flex-start'}*/}
            {/*  variant={'ghost'}*/}
            {/*  fontSize={fontSizeNormal}*/}
            {/*  minHeight={45}*/}
            {/*  onClick={handleOpenSettings}*/}
            {/*>*/}
            {/*  Settings*/}
            {/*</Button>*/}
            <Separator height={6} />
            <Button
              _focus={{ boxShadow: 'none' }}
              justifyContent={'flex-start'}
              variant={'ghost'}
              fontSize={fontSizeNormal}
              minHeight={45}
              onClick={handleLogout}
            >
              Logout
            </Button>
            <Separator height={16} />
          </div>
        </BottomSheet>
      ) : null}
    </>
  );
};
export default BottomSheetSettings;
