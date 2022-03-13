import { Button, Flex, Heading, Stack } from '@chakra-ui/react';
import {
  CalDavAccount,
  CalDavCalendar,
  ReduxState,
} from '../../types/interface';
import { fontSizeNormal } from '../../types/constants';
import { getAccountCalendars } from '../../utils/tsdavHelper';
import { getBaseUrl } from '../../utils/parser';
import { useSelector } from 'react-redux';
import BottomSheet from 'bottom-sheet-react';
import React from 'react';
import Separator from '../separator/Separator';

interface BottomSheetCalendarsProps {
  isBottomSheetOpen: boolean;
  onClose: any;
  selectCalendar: any;
}
const BottomSheetCalendars = (props: BottomSheetCalendarsProps) => {
  const { isBottomSheetOpen, onClose, selectCalendar } = props;

  const calDavAccounts: CalDavAccount[] = useSelector(
    (state: ReduxState) => state.calDavAccounts
  );
  const calDavCalendars: CalDavCalendar[] = useSelector(
    (state: ReduxState) => state.calDavCalendars
  );

  const handleSelect = (calendar: CalDavCalendar) => {
    selectCalendar(calendar);
    onClose();
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
            {calDavAccounts.map((calDavAccount) => {
              const accountCalendars = getAccountCalendars(
                calDavAccount,
                calDavCalendars
              );
              return (
                <Flex direction={'column'} key={calDavAccount.id}>
                  <Heading
                    size={'md'}
                    paddingTop={4}
                    paddingLeft={4}
                    color={'gray.600'}
                  >
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
                          onClick={() => handleSelect(item)}
                          _focus={{ boxShadow: 'none' }}
                          variant={'ghost'}
                          justifyContent={'flex-start'}
                          fontSize={fontSizeNormal}
                          minHeight={45}
                        >
                          {item.displayName}
                        </Button>
                      );
                    })}
                  </Stack>
                </Flex>
              );
            })}
          </div>
        </BottomSheet>
      ) : null}
    </>
  );
};
export default BottomSheetCalendars;
