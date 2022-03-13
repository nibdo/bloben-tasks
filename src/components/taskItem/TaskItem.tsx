import './TaskItem.scss';
import {
  Button,
  Flex,
  IconButton,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { CalDavTask } from '../../bloben-interface/calDavTask/calDavTask';
import { Context } from '../../context/store';
import { TOAST_STATUS } from '../../types/enums';
import { createToast } from '../../utils/common';
import { fontSizeNormal } from '../../types/constants';
import CalDavTaskApi from '../../api/CalDavTaskApi';
import ICalHelper from '../../utils/ICalHelper';
import MenuIcon from '../eva-icons/more';
import RadioOff from '../eva-icons/radio-off';
import RadioOn from '../eva-icons/radio-on';
import React, { useContext, useEffect, useState } from 'react';
import ResizeTextarea from 'react-textarea-autosize';

interface TaskItemProps {
  item: CalDavTask;
  handleCheck: any;
}
const TaskItem = (props: TaskItemProps) => {
  const [store] = useContext(Context);
  const { isMobile } = store;

  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const [summary, setSummary] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const { handleCheck, item } = props;
  // const { status } = item;

  const isCompleted = isChecked;

  const handleUpdate = async () => {
    // if (isLoading) {
    //   return;
    // }

    // if (e.keyCode === 13 || e.which === 13) {
    if (summary === item.summary) {
      return;
    }
    setIsLoading(true);
    try {
      const externalID = item.externalID;
      const iCalString: string = new ICalHelper({
        summary,
        externalID,
      }).parseTo();

      await CalDavTaskApi.update({
        iCalString,
        calendarID: item.calendarID,
        externalID,
        id: item.id,
        etag: item.etag,
        url: item.href,
        prevEvent: null,
      });

      // setSummary('');
      // toast(createToast(response?.data?.message));
      setIsLoading(false);
    } catch (e: any) {
      setIsLoading(false);
      toast(createToast(e.response?.data?.message, TOAST_STATUS.ERROR));
      // }
    }
  };

  const handleDelete = async () => {
    try {
      const response = await CalDavTaskApi.delete({
        calendarID: item.calendarID,
        etag: item.etag,
        id: item.id,
        url: item.href,
      });

      toast(createToast(response?.data?.message));
    } catch (e: any) {
      toast(createToast(e.response?.data?.message, TOAST_STATUS.ERROR));
    }
  };

  const onChange = (e: any) => {
    setSummary(e.target.value);
  };

  useEffect(() => {
    setSummary(item.summary);
    setIsChecked(item.status === 'COMPLETED');
  }, []);

  const checkInternal = (item: any) => {
    const newValue = item.status === 'COMPLETED' ? false : true;

    setIsChecked(newValue);
    handleCheck(item);
  };

  return (
    <Flex
      direction={'row'}
      alignItems={'flex-start'}
      justifyContent={'center'}
      paddingTop={2}
      paddingBottom={2}
      width={'100%'}
    >
      <Flex direction={'column'} height={'100%'} alignItems={'flex-start'}>
        <IconButton
          _focus={{ boxShadow: 'none' }}
          variant={'ghost'}
          background={'transparent'}
          aria-label="Check"
          icon={
            isChecked ? (
              <RadioOn className={'TaskItem_check_icon-checked'} />
            ) : (
              <RadioOff className={'TaskItem_check_icon'} />
            )
          }
          marginRight={4}
          isRound
          size={isMobile ? 'md' : 'xs'}
          autoFocus={false}
          onClick={() => checkInternal(item)}
        />
      </Flex>
      <InputGroup
        width={'100%'}
        style={{
          alignSelf: 'center',
        }}
        alignSelf={'center'}
      >
        <Textarea
          as={ResizeTextarea}
          size={'md'}
          fontSize={fontSizeNormal}
          name={'summary'}
          value={summary}
          minH={'unset'}
          onChange={onChange}
          autoComplete={'off'}
          placeholder={'Edit task'}
          // onKeyPress={handleUpdate}
          autoFocus={false}
          margin={0}
          padding={0}
          overflow={'hidden'}
          resize={'none'}
          minRows={1}
          background={'white'}
          focusBorderColor={'transparent'}
          variant={'ghosted'}
          width={'100%'}
          color={isCompleted ? 'gray.500' : 'blackAlpha.900'}
          onBlur={handleUpdate}
        />
        <Flex direction={'column'} height={'100%'} alignItems={'flex-start'}>
          {isLoading ? (
            <InputRightElement width="4.5rem">
              <Spinner size="md" color={'pink.400'} />
            </InputRightElement>
          ) : (
            <Menu closeOnSelect={true}>
              <MenuButton
                as={IconButton}
                _focus={{ boxShadow: 'none' }}
                aria-label={'task-menu'}
                icon={
                  <MenuIcon fill={'gray'} style={{ width: 20, height: 20 }} />
                }
                variant={'ghosted'}
                size={'xs'}
                alignSelf={'flex-end'}
              />
              <MenuList zIndex={9991}>
                <MenuItem
                  as={Button}
                  _focus={{ boxShadow: 'none' }}
                  variant={'ghost'}
                  isFullWidth={true}
                  justifyContent={'flex-start'}
                  fontSize={14}
                  onClick={handleDelete}
                >
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
      </InputGroup>
    </Flex>
  );
};

export default TaskItem;
