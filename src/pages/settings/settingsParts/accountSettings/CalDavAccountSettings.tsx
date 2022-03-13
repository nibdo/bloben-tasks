import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import {
  CalDavAccount,
  CalDavCalendar,
  ReduxState,
} from '../../../../types/interface';
import { CalDavTask } from '../../../../bloben-interface/calDavTask/calDavTask';
import { TOAST_STATUS } from 'types/enums';
import { createToast } from '../../../../utils/common';
import {
  deleteCaldavAccount,
  setCalDavTasks,
  setCaldavCalendars,
} from '../../../../redux/actions';
import { forEach } from 'lodash';
import { getAccountCalendars } from '../../../../utils/tsdavHelper';
import { getBaseUrl } from '../../../../utils/parser';
import { useDispatch, useSelector } from 'react-redux';
import CalDavAccountApi from '../../../../api/CalDavAccountApi';
import CalDavAccountModal from 'components/accountSelectionModal/calDavAccountModal/CalDavAccountModal';
import React, { useState } from 'react';
import Separator from '../../../../components/separator/Separator';

const renderCalDavAccounts = (
  calDavAccounts: CalDavAccount[],
  handleEdit: any,
  openPreDeleteModal: any
) => {
  return calDavAccounts.map((item) => {
    return (
      <Tbody key={item.principalUrl}>
        <Tr>
          <Td>{item.username}</Td>
          <Td>{getBaseUrl(item.principalUrl || '')}</Td>
          <Td>
            <Menu>
              <MenuButton as={Button} _focus={{ boxShadow: 'none' }}>
                Actions
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => handleEdit(item)}>Edit</MenuItem>
                <MenuItem onClick={() => openPreDeleteModal(item)}>
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          </Td>
        </Tr>
      </Tbody>
    );
  });
};

const CalDavAccountSettings = () => {
  const [editModalVisible, setEditModalVisible] = useState(false);

  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [accountInFocus, setAccountInFocus] = useState<CalDavAccount | null>(
    null
  );
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const dispatch = useDispatch();
  const calDavAccounts: CalDavAccount[] = useSelector(
    (state: ReduxState) => state.calDavAccounts
  );
  const calDavCalendars: CalDavCalendar[] = useSelector(
    (state: ReduxState) => state.calDavCalendars
  );
  const calDavTasks: CalDavTask[] = useSelector(
    (state: ReduxState) => state.calDavTasks
  );

  const handleEdit = (item: CalDavAccount) => {
    setEditModalVisible(true);
    setAccountInFocus(item);
  };

  const openPreDeleteModal = (item: CalDavAccount) => {
    setAccountInFocus(item);
    setDeleteModalVisible(true);
  };
  const onModalClose = () => {
    if (isLoading) {
      return;
    }
    setAccountInFocus(null);
    setDeleteModalVisible(false);
    setEditModalVisible(false);
  };

  const calDavAccountsRendered = renderCalDavAccounts(
    calDavAccounts,
    handleEdit,
    openPreDeleteModal
  );

  const handleDeleteAccount = async () => {
    try {
      if (!accountInFocus) {
        return;
      }
      setIsLoading(true);

      const response: any = await CalDavAccountApi.deleteCalDavAccount(
        accountInFocus.id
      );

      if (response.status === 200) {
        const accountCalendars = getAccountCalendars(
          accountInFocus,
          calDavCalendars
        );

        let tasks = [...calDavTasks];

        // delete tasks
        forEach(accountCalendars, (calendar) => {
          tasks = tasks.filter((item) => item.calendarID !== calendar.id);
        });

        dispatch(setCalDavTasks(tasks));

        // delete calendars
        let calendars = [...calDavCalendars];
        calendars = calendars.filter(
          (item) => item.calDavAccountID !== accountInFocus.id
        );
        dispatch(setCaldavCalendars(calendars));

        // delete account
        dispatch(deleteCaldavAccount(accountInFocus));

        toast(createToast('CalDav account deleted'));
        setAccountInFocus(null);
        setDeleteModalVisible(false);
        setIsLoading(false);
      }
    } catch (e: any) {
      toast(createToast(e.response?.data?.message, TOAST_STATUS.ERROR));
      setIsLoading(false);
    }
  };

  return calDavAccounts.length ? (
    <>
      <Heading size={'md'} paddingLeft={6}>
        CalDAV
      </Heading>
      <Separator height={8} />
      <Table variant="simple" size={'md'}>
        <Thead>
          <Tr>
            <Th>Username</Th>
            <Th>Domain</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        {calDavAccountsRendered}
      </Table>
      <AlertDialog
        isOpen={deleteModalVisible}
        onClose={onModalClose}
        leastDestructiveRef={undefined}
        isCentered={true}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Account
            </AlertDialogHeader>

            <AlertDialogBody>
              Do you want to delete your account?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button _focus={{ boxShadow: 'none' }} onClick={onModalClose}>
                Cancel
              </Button>
              <Button
                _focus={{ boxShadow: 'none' }}
                isLoading={isLoading}
                colorScheme="red"
                onClick={handleDeleteAccount}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      {editModalVisible ? (
        <CalDavAccountModal
          handleClose={onModalClose}
          account={accountInFocus || undefined}
        />
      ) : null}
    </>
  ) : null;
};

export default CalDavAccountSettings;
