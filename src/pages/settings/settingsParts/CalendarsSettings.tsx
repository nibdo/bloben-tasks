/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Tag,
  Text,
  useToast,
} from '@chakra-ui/react';

import {
  CalDavAccount,
  CalDavCalendar,
  ReduxState,
} from '../../../types/interface';
import { getAccountCalendars } from '../../../utils/tsdavHelper';
import { getBaseUrl } from '../../../utils/parser';
import { useSelector } from 'react-redux';
import AddCalendarModal from '../../../components/addCalenarModal/AddCalendarModal';

import { TOAST_STATUS } from '../../../types/enums';
import { createToast } from '../../../utils/common';

import CalDavCalendarApi from '../../../api/CalDavCalendarApi';
import React, { useState } from 'react';
import Separator from '../../../components/separator/Separator';

const renderAccountCalendars = (
  calDavCalendars: CalDavCalendar[],
  handleEdit: any,
  openPreDeleteModal: any
) => {
  return calDavCalendars.map((calDavCalendar) => {
    return (
      <Flex
        key={calDavCalendar.id}
        direction={'row'}
        marginBottom={3}
        alignItems={'center'}
      >
        <Flex width={150}>
          <Text>{calDavCalendar.displayName}</Text>
        </Flex>
        <Flex direction={'row'} justifyContent={'flex-start'}>
          {calDavCalendar.components.map((component: string) => (
            <Tag
              key={component}
              borderRadius={10}
              padding={1}
              size={'xs'}
              marginRight={2}
            >
              {component}
            </Tag>
          ))}
        </Flex>
        <Spacer />
        <Menu>
          <MenuButton as={Button} _focus={{ boxShadow: 'none' }}>
            Actions
          </MenuButton>
          <MenuList>
            {/*<MenuItem onClick={() => handleEdit(calDavCalendar)}>Edit</MenuItem>*/}
            <MenuItem onClick={() => openPreDeleteModal(calDavCalendar)}>
              Delete
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    );
  });
};

const renderCalDavAccountCalendars = (
  calDavAccounts: CalDavAccount[],
  calDavCalendars: CalDavCalendar[],
  handleAddCalendar: any,
  handleEdit: any,
  openPreDeleteModal: any
) => {
  return calDavAccounts.map((calDavAccount) => {
    // find all account calendars
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const accountCalendars = getAccountCalendars(
      calDavAccount,
      calDavCalendars
    );

    const renderedCalendars = renderAccountCalendars(
      accountCalendars,
      handleEdit,
      openPreDeleteModal
    );

    return (
      <Flex direction={'column'} key={calDavAccount.id}>
        <Flex direction={'row'} alignItems={'center'}>
          <Heading size={'md'}>
            {getBaseUrl(
              calDavAccount.principalUrl || calDavAccount.username || ''
            )}
          </Heading>
          <Spacer />
          <Button
            _focus={{ boxShadow: 'none' }}
            colorScheme={'pink'}
            onClick={() => {
              handleAddCalendar(calDavAccount);
            }}
          >
            Add
          </Button>
        </Flex>
        <Separator height={16} />
        {renderedCalendars}
      </Flex>
    );
  });
};

const CalendarsSettings = () => {
  const toast = useToast();

  const calDavAccounts: CalDavAccount[] = useSelector(
    (state: ReduxState) => state.calDavAccounts
  );
  const calDavCalendars: CalDavCalendar[] = useSelector(
    (state: ReduxState) => state.calDavCalendars
  );

  const [calendarInFocus, setCalendarInFocus] = useState<CalDavCalendar | null>(
    null
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<CalDavAccount | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const handleEdit = (item: CalDavCalendar) => {
    setEditModalVisible(true);
    setCalendarInFocus(item);
  };

  const openPreDeleteModal = (item: CalDavCalendar) => {
    setCalendarInFocus(item);
    setDeleteModalVisible(true);
  };

  const onModalClose = () => {
    if (isLoading) {
      return;
    }
    setCalendarInFocus(null);
    setDeleteModalVisible(false);
    setEditModalVisible(false);
  };

  const renderedCalendars = renderCalDavAccountCalendars(
    calDavAccounts,
    calDavCalendars,
    setIsModalOpen,
    handleEdit,
    openPreDeleteModal
  );

  const handleDeleteCalendar = async () => {
    try {
      if (!calendarInFocus) {
        return;
      }
      setIsLoading(true);

      const response: any = await CalDavCalendarApi.deleteCalendar(
        calendarInFocus.id
      );

      toast(createToast(response?.data?.message));
      setCalendarInFocus(null);
      setDeleteModalVisible(false);
      setIsLoading(false);
    } catch (e: any) {
      toast(createToast(e.response?.data?.message, TOAST_STATUS.ERROR));
      setIsLoading(false);
    }
  };

  return (
    <>
      <Separator height={24} />
      <Flex direction={'column'}>{renderedCalendars}</Flex>
      {isModalOpen ? (
        <AddCalendarModal
          handleClose={() => setIsModalOpen(null)}
          account={isModalOpen}
        />
      ) : null}

      <AlertDialog
        isOpen={deleteModalVisible}
        onClose={onModalClose}
        leastDestructiveRef={undefined}
        isCentered={true}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Calendar
            </AlertDialogHeader>

            <AlertDialogBody>Do you want to delete calendar?</AlertDialogBody>

            <AlertDialogFooter>
              <Button _focus={{ boxShadow: 'none' }} onClick={onModalClose}>
                Cancel
              </Button>
              <Button
                _focus={{ boxShadow: 'none' }}
                isLoading={isLoading}
                colorScheme="red"
                onClick={handleDeleteCalendar}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/*{editModalVisible && calendarInFocus ? (*/}
      {/*  <AddCalendarModal*/}
      {/*    handleClose={() => setEditModalVisible(false)}*/}
      {/*    calendar={calendarInFocus}*/}
      {/*  />*/}
      {/*) : null}*/}
    </>
  );
};

export default CalendarsSettings;
