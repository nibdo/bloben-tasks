import { Button, Flex, Heading, Stack } from '@chakra-ui/react';
import {
  CalDavAccount,
  CalDavCalendar,
  ReduxState,
} from '../../types/interface';
import { HEADER_HEIGHT, PADDING_APP } from '../../types/constants';
import { getAccountCalendars } from '../../utils/tsdavHelper';
import { getBaseUrl } from '../../utils/parser';
import { useSelector } from 'react-redux';
import React from 'react';
import Separator from '../separator/Separator';

interface DrawerProps {
  selectCalendar: any;
}
const Drawer = (props: DrawerProps) => {
  const { selectCalendar } = props;

  const calDavAccounts: CalDavAccount[] = useSelector(
    (state: ReduxState) => state.calDavAccounts
  );
  const calDavCalendars: CalDavCalendar[] = useSelector(
    (state: ReduxState) => state.calDavCalendars
  );

  return (
    <Flex
      direction={'column'}
      width={200}
      padding={8}
      style={{
        overflowY: 'auto',
        overflowX: 'hidden',
        height: window.innerHeight - HEADER_HEIGHT - PADDING_APP,
      }}
    >
      {calDavAccounts.map((calDavAccount) => {
        const accountCalendars = getAccountCalendars(
          calDavAccount,
          calDavCalendars
        );
        return (
          <Flex direction={'column'} key={calDavAccount.id}>
            <Heading size={'md'} paddingLeft={2}>
              {getBaseUrl(
                calDavAccount.principalUrl || calDavAccount.username || ''
              )}
            </Heading>
            <Separator height={10} />
            <Stack direction={'column'} spacing={2}>
              {accountCalendars.map((item) => {
                return (
                  <Button
                    key={item.id}
                    onClick={() => selectCalendar(item)}
                    _focus={{ boxShadow: 'none' }}
                  >
                    {item.displayName}
                  </Button>
                );
              })}
            </Stack>
          </Flex>
        );
      })}
    </Flex>
  );
};

export default Drawer;
