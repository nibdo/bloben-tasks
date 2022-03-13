import './MobileNavbar.scss';
import { Flex, IconButton, Spacer } from '@chakra-ui/react';
import MenuIcon from '../eva-icons/menu';
import Plus from '../eva-icons/plus';
import React from 'react';
import SettingsIcon from '../eva-icons/settings';

interface MobileNavbarProps {
  openBottomSheetCalendars: any;
  openBottomSheetSettings: any;
  openBottomSheetNewTask: any;
}
const MobileNavbar = (props: MobileNavbarProps) => {
  const {
    openBottomSheetCalendars,
    openBottomSheetSettings,
    openBottomSheetNewTask,
  } = props;

  return (
    <div className={'MobileNavbar__wrapper'}>
      <div className={'MobileNavbar__container'}>
        <Flex
          paddingLeft={8}
          paddingRight={8}
          alignItems={'center'}
          height={'100%'}
          width={'100%'}
          direction={'row'}
        >
          <IconButton
            _focus={{ boxShadow: 'none' }}
            aria-label="Menu"
            variant={'ghost'}
            background={'transparent'}
            icon={<MenuIcon className={'MobileNavbar__icon'} />}
            isRound
            size={'lg'}
            autoFocus={false}
            onClick={openBottomSheetCalendars}
          />
          <Spacer />
          <IconButton
            _focus={{ boxShadow: 'none' }}
            variant={'solid'}
            background={'blackAlpha.800'}
            style={{ marginBottom: 20 }}
            aria-label="Add"
            icon={<Plus className={'MobileNavbar__icon-reversed'} />}
            isRound
            size={'xl'}
            autoFocus={false}
            onClick={openBottomSheetNewTask}
          />
          <Spacer />
          <IconButton
            _focus={{ boxShadow: 'none' }}
            variant={'ghost'}
            background={'transparent'}
            aria-label="Settings"
            icon={<SettingsIcon className={'MobileNavbar__icon'} />}
            isRound
            size={'lg'}
            autoFocus={false}
            onClick={openBottomSheetSettings}
          />
        </Flex>
      </div>
    </div>
  );
};

export default MobileNavbar;
