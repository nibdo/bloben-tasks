import {
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Tag,
  useToast,
} from '@chakra-ui/react';
import { CalDavAccount, CalDavCalendar } from '../../types/interface';
import { TOAST_STATUS } from '../../types/enums';
import { createToast } from '../../utils/common';
import CalDavCalendarApi from '../../api/CalDavCalendarApi';
import ChakraModal from '../chakraCustom/ChakraModal';
import React, { useEffect, useReducer, useState } from 'react';
import Separator from '../separator/Separator';
import StateReducer from '../../utils/state-reducer';
import Utils from './AddCalendarModal.utils';

interface AddCalendarModalProps {
  handleClose: any;
  account?: CalDavAccount;
  calendar?: CalDavCalendar;
}
const AddCalendarModal = (props: AddCalendarModalProps) => {
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const { handleClose, account, calendar } = props;

  const [state, dispatchState] = useReducer(StateReducer, Utils.state);
  const setLocalState = (stateName: string, data: any): void => {
    const payload: any = { stateName, type: 'simple', data };
    // @ts-ignore
    dispatchState({ state, payload });
  };

  const { name, color, components }: any = state;

  const onChange = (e: any): void => {
    const value = e.target.value;

    setLocalState(e.target.name, value);
  };

  const saveCalendar = async () => {
    if (!account) {
      toast(createToast('CalDAV account not found', TOAST_STATUS.ERROR));
      handleClose();
      return;
    }
    setIsLoading(true);
    try {
      const response: any = await CalDavCalendarApi.createCalendar({
        name,
        color,
        components,
        accountID: account.id,
      });

      if (response.data?.message) {
        toast(createToast(response.data.message));
      }

      setIsLoading(false);
      handleClose();
    } catch (e) {
      // @ts-ignore
      toast(createToast(e.response?.data?.message, TOAST_STATUS.ERROR));
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateCalendar = async () => {
    if (!account) {
      toast(createToast('CalDAV account not found', TOAST_STATUS.ERROR));
      handleClose();
      return;
    }
    setIsLoading(true);
    try {
      const response: any = await CalDavCalendarApi.createCalendar({
        name,
        color,
        components,
        accountID: account.id,
      });

      if (response.data?.message) {
        toast(createToast(response.data.message));
      }

      setIsLoading(false);
      handleClose();
    } catch (e) {
      // @ts-ignore
      toast(createToast(e.response?.data?.message, TOAST_STATUS.ERROR));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (calendar) {
      setLocalState('name', calendar.displayName);
      setLocalState('color', calendar.color);
      setLocalState('components', calendar.components);
    }
  }, []);

  const closeFunc = () => {
    if (!isLoading) {
      handleClose();
    }
  };

  const checkComponents = (component: string) => {
    let selectedComponents: string[] = [...components];

    if (selectedComponents.includes(component)) {
      selectedComponents = selectedComponents.filter(
        (item) => item !== component
      );
    } else {
      selectedComponents.push(component);
    }

    setLocalState('components', selectedComponents);
  };

  return (
    <ChakraModal
      isOpen={true}
      handleClose={closeFunc}
      minWidth={350}
      title={'Create calendar'}
    >
      <>
        <FormControl>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input
            size={'lg'}
            id="name"
            type="text"
            name={'name'}
            onChange={onChange}
            value={name}
          />
          <Separator height={18} />
          <Flex direction={'row'}>
            {components.map((component: string) => (
              <Tag
                key={component}
                marginRight={4}
                borderRadius={10}
                padding={1}
                size={'xs'}
              >
                {component}
              </Tag>
            ))}
          </Flex>
          <Separator height={10} />
          <Menu closeOnSelect={false}>
            <MenuButton as={Button} _focus={{ boxShadow: 'none' }}>
              Select components
            </MenuButton>
            <MenuList>
              <Stack spacing={1}>
                <MenuItem onClick={() => checkComponents('VEVENT')}>
                  <Box>
                    <Checkbox
                      colorScheme="teal"
                      value={'VEVENT'}
                      isChecked={components.includes('VEVENT')}
                    >
                      VEVENT
                    </Checkbox>
                  </Box>
                </MenuItem>
                <MenuItem onClick={() => checkComponents('VTODO')}>
                  <Box>
                    <Checkbox
                      colorScheme="teal"
                      value={'VTODO'}
                      isChecked={components.includes('VTODO')}
                    >
                      VTODO
                    </Checkbox>
                  </Box>
                </MenuItem>
                <MenuItem onClick={() => checkComponents('VJOURNAL')}>
                  <Box>
                    <Checkbox
                      colorScheme="teal"
                      value={'VJOURNAL'}
                      isChecked={components.includes('VJOURNAL')}
                    >
                      VJOURNAL
                    </Checkbox>
                  </Box>
                </MenuItem>
              </Stack>
            </MenuList>
          </Menu>

          <Separator height={18} />
          <FormLabel htmlFor="color">Color</FormLabel>
          <Input
            size={'lg'}
            id="color"
            name={'color'}
            onChange={onChange}
            value={color}
          />
        </FormControl>
        <Separator height={25} />
        <Center>
          <Button
            _focus={{ boxShadow: 'none' }}
            colorScheme={'pink'}
            isLoading={isLoading}
            onClick={saveCalendar}
          >
            Save
          </Button>
        </Center>
        <Separator height={15} />
      </>
    </ChakraModal>
  );
};

export default AddCalendarModal;
