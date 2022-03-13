import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Text,
} from '@chakra-ui/react';
import { initialReduxState } from '../../../redux/reducers';
import { replace } from '../../../redux/actions';
import { useDispatch } from 'react-redux';
import React, { useState } from 'react';
import Separator from '../../../components/separator/Separator';
import SettingsCard from '../settingsCard/SettingsCard';

const ResetSettings = () => {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const dispatch = useDispatch();

  const openPreDeleteModal = () => {
    setDeleteModalVisible(true);
  };
  const onDeleteModalClose = () => {
    setDeleteModalVisible(false);
  };

  const handleDeleteAccount = async () => {
    dispatch(replace(initialReduxState));
    window.location.replace('/');
  };

  return (
    <>
      <SettingsCard title={'Reset storage'}>
        <Text fontSize="md">
          Resetting storage will remove all your saved credentials, downloaded
          accounts, calendars and events. This action cannot be reversed.
        </Text>
        <Separator />
        <Button
          _focus={{ boxShadow: 'none' }}
          colorScheme="red"
          onClick={openPreDeleteModal}
          ml={3}
          isFullWidth={false}
          width={150}
        >
          Reset storage
        </Button>
      </SettingsCard>

      <AlertDialog
        isOpen={deleteModalVisible}
        onClose={onDeleteModalClose}
        leastDestructiveRef={undefined}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Reset storage
            </AlertDialogHeader>

            <AlertDialogBody>
              Do you want to reset storage and remove all your data?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                _focus={{ boxShadow: 'none' }}
                onClick={onDeleteModalClose}
              >
                Cancel
              </Button>
              <Button
                _focus={{ boxShadow: 'none' }}
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
    </>
  );
};

export default ResetSettings;
