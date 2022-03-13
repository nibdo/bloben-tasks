import { ACCOUNT_TYPE } from 'types/enums';
import { Button, Center } from '@chakra-ui/react';

import AccountSelectionModal from 'components/accountSelectionModal/AccountSelectionModal';
import CalDavAccountModal from '../../../components/accountSelectionModal/calDavAccountModal/CalDavAccountModal';
import CalDavAccountSettings from './accountSettings/CalDavAccountSettings';
import React, { useState } from 'react';
import Separator from '../../../components/separator/Separator';

const AccountSettings = () => {
  const [newAccountModalOpen, openNewAccountModal] =
    useState<ACCOUNT_TYPE | null>(null);

  const [isSelectionModalOpen, openSelectionModal] = useState(false);

  const handleOpenNewAccountModal = (type: ACCOUNT_TYPE) => {
    openSelectionModal(false);
    openNewAccountModal(type);
  };
  const handleCloseAccountTypeModal = () => {
    openNewAccountModal(null);
  };

  return (
    <>
      <Center>
        <Button
          _focus={{ boxShadow: 'none' }}
          onClick={() => openSelectionModal(true)}
          fontSize={14}
        >
          Add account
        </Button>
      </Center>
      <Separator height={20} />
      <CalDavAccountSettings />
      <Separator height={20} />

      {isSelectionModalOpen ? (
        <AccountSelectionModal
          isOpen={isSelectionModalOpen}
          handleClose={() => openSelectionModal(false)}
          handleOpenNewAccountModal={handleOpenNewAccountModal}
        />
      ) : null}

      {newAccountModalOpen && newAccountModalOpen === ACCOUNT_TYPE.CAL_DAV ? (
        <CalDavAccountModal handleClose={handleCloseAccountTypeModal} />
      ) : null}
    </>
  );
};

export default AccountSettings;
