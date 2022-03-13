import './BottomSheetNewTask.scss';
import { CalDavTaskSettings } from '../../bloben-interface/calDavTaskSettings/CalDavTaskLabel';
import { Context } from '../../context/store';
import { Flex, IconButton, Input, useToast } from '@chakra-ui/react';
import { ReduxState } from '../../types/interface';
import { TOAST_STATUS } from '../../types/enums';
import { createToast } from '../../utils/common';
import { find } from 'lodash';
import { fontSizeNormal } from '../../types/constants';
import { updateCalDavTaskSettings } from '../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { v4 } from 'uuid';
import BottomSheet from 'bottom-sheet-react';
import CalDavTaskApi from '../../api/CalDavTaskApi';
import ICalHelper from '../../utils/ICalHelper';
import Paper from '../eva-icons/paper';
import React, { useContext, useEffect, useState } from 'react';
import Separator from '../separator/Separator';
// const taskPostSaveAction = (task: CalDavTask) => {
//
// };

interface BottomSheetNewTaskProps {
  isBottomSheetOpen: boolean;
  onClose: any;
}
const BottomSheetNewTask = (props: BottomSheetNewTaskProps) => {
  const toast = useToast();
  const { isBottomSheetOpen, onClose } = props;

  const [summary, setSummary] = useState('');
  // const dispatch = useDispatch();
  const [store] = useContext(Context);

  const calDavTaskSettings: CalDavTaskSettings[] = useSelector(
    (state: ReduxState) => state.calDavTaskSettings
  );

  const onChange = (e: any) => {
    setSummary(e.target.value);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, []);

  const dispatch = useDispatch();

  const handleSaveTask = async () => {
    try {
      const externalID = v4();
      const iCalString: string = new ICalHelper({
        summary,
        externalID,
      }).parseTo();

      const response = await CalDavTaskApi.create({
        iCalString,
        calendarID: store.selectedCalendar?.id,
        externalID,
      });

      const settings = find(
        calDavTaskSettings,
        (item) => item.calendarID === store.selectedCalendar?.id
      );
      const newSettings: any = { ...settings };
      // @ts-ignore
      newSettings.order = [response.data.data.id, ...settings?.order];
      dispatch(updateCalDavTaskSettings(newSettings));

      setSummary('');
      // toast(createToast(response?.data?.message));
    } catch (e: any) {
      toast(createToast(e.response?.data?.message, TOAST_STATUS.ERROR));
    }
  };

  return (
    <>
      {isBottomSheetOpen ? (
        <BottomSheet
          {...props}
          customHeight={100}
          isExpandable={false}
          onClose={onClose}
          backdropClassName={'BottomSheetNewTask'}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: 16,
            }}
          >
            <Flex
              direction={'row'}
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Input
                size={'xl'}
                name={'summary'}
                borderColor={'transparent'}
                // borderRadius={8}
                value={summary}
                onChange={onChange}
                fontSize={fontSizeNormal}
                autoComplete={'off'}
                placeholder={'Add task'}
                background={'white'}
                focusBorderColor={'transparent'}
                style={{
                  borderBottom: 'solid 2px pink',
                  padding: 8,
                  marginRight: 4,
                }}
                autoFocus={true}
                // focusBorderBottomColor={'pink.400'}
                maxWidth={300}
              />
              <IconButton
                _focus={{ boxShadow: 'none' }}
                variant={'ghost'}
                aria-label="Refresh"
                style={{ padding: 8 }}
                icon={
                  <Paper
                    style={{
                      transform: 'rotate(45deg)',
                      width: 25,
                      height: 25,
                    }}
                  />
                }
                isRound
                autoFocus={false}
                onClick={handleSaveTask}
              />
            </Flex>
            <Separator height={6} />
          </div>
        </BottomSheet>
      ) : null}
    </>
  );
};
export default BottomSheetNewTask;
