/* eslint-disable @typescript-eslint/no-unused-vars,no-console */
import './BoardColumn.scss';
import {
  BOARD_HEADER_HEIGHT,
  HEADER_HEIGHT,
  PADDING_APP,
  PADDING_BOARD,
} from '../../types/constants';
import { CalDavTask } from '../../bloben-interface/calDavTask/calDavTask';
import { CalDavTaskSettings } from '../../bloben-interface/calDavTaskSettings/CalDavTaskLabel';
import { Context } from '../../context/store';
import { DateTime } from 'luxon';
import { DragDropContext, Draggable, Droppable } from '@react-forked/dnd';
import {
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spacer,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { TOAST_STATUS } from '../../types/enums';
import { createToast } from '../../utils/common';
import { filter, forEach, keyBy, map } from 'lodash';
import { updateCalDavTaskSettings } from '../../redux/actions';
import { useDispatch } from 'react-redux';
import { v4 } from 'uuid';
import CalDavTaskApi from '../../api/CalDavTaskApi';
import CalDavTaskSettingsApi from '../../api/CalDavTaskSettingsApi';
import ICalHelper from 'utils/ICalHelper';
import React, { useContext, useEffect, useState } from 'react';
import RefreshIcon from '../eva-icons/refresh';
import Separator from 'components/separator/Separator';
import TaskItem from '../taskItem/TaskItem';

const sortByDate = (tasks: CalDavTask[]) => {
  return tasks.sort((a, b) => {
    return (
      DateTime.fromISO(a.createdAt).toMillis() -
      DateTime.fromISO(b.createdAt).toMillis()
    );
  });
};

export const sortTasks = (tasks: CalDavTask[], orderIDs: string[]) => {
  const orderResult: CalDavTask[] = [];

  const usedIDs: string[] = [];
  const keyedTasks = keyBy(tasks, 'id');

  forEach(orderIDs, (id) => {
    const taskFound = keyedTasks[id];
    if (taskFound) {
      orderResult.push(taskFound);

      usedIDs.push(taskFound.id);
      delete keyedTasks[id];
    }
  });

  // sort remaining tasks without order by createdAt value
  const remainingTasks = filter(tasks, (item) => !usedIDs.includes(item.id));
  const sortedRemainingTasks = sortByDate(remainingTasks);

  return [...orderResult, ...sortedRemainingTasks];
};

interface BoardColumnProps {
  tasks: CalDavTask[];
  calendarID: string;
  title: string;
  settings?: CalDavTaskSettings;
}
const BoardColumn = (props: BoardColumnProps) => {
  const [store] = useContext(Context);
  const { isMobile } = store;

  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const [tasksOrdered, setTasksOrdered] = useState<CalDavTask[]>([]);
  const { tasks, calendarID, title, settings } = props;
  const grid = 8;

  const [summary, setSummary] = useState('');

  useEffect(() => {
    let sorted: CalDavTask[];
    if (settings?.order) {
      sorted = sortTasks(tasks, settings?.order);
    } else {
      sorted = sortByDate(tasks);
    }

    setTasksOrdered(sorted);

    const sortedOrder = map(sorted, 'id');
    if (JSON.stringify(settings?.order) !== JSON.stringify(sortedOrder)) {
      CalDavTaskSettingsApi.update(calendarID, {
        order: sortedOrder,
        orderBy: 'custom',
      });
    }
  }, []);

  useEffect(() => {
    let sorted: CalDavTask[];
    if (settings?.order) {
      sorted = sortTasks(tasks, settings?.order);
    } else {
      sorted = sortByDate(tasks);
    }

    setTasksOrdered(sorted);

    const sortedOrder = map(sorted, 'id');
    if (JSON.stringify(settings?.order) !== JSON.stringify(sortedOrder)) {
      CalDavTaskSettingsApi.update(calendarID, {
        order: sortedOrder,
        orderBy: 'custom',
      });
    }
  }, [calendarID]);

  useEffect(() => {
    let sorted: CalDavTask[];
    if (settings?.order) {
      sorted = sortTasks(tasks, settings?.order);
    } else {
      sorted = sortByDate(tasks);
    }

    setTasksOrdered(sorted);
  }, [JSON.stringify(tasks)]);

  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: isMobile ? 6 : 8,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    // justifyContent: 'center',
    margin: `0 0 ${grid}px 0`,
    background: isDragging ? 'white' : 'white',
    boxShadow: isDragging ? '0 0 0 4px pink' : '',
    borderRadius: 10,
    ...draggableStyle,
  });

  const getListStyle = (isDraggingOver: boolean) => ({
    // background: isDraggingOver ? 'pink.100' : 'transparent',
    width: '100%',
    height: '100%',
  });

  const reorder = (list: any, startIndex: number, endIndex: number) => {
    const result: CalDavTask[] = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    CalDavTaskSettingsApi.update(calendarID, {
      order: map(result, 'id'),
      orderBy: 'custom',
    });

    return result;
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const items: any = reorder(
      tasksOrdered,
      result.source.index,
      result.destination.index
    );

    setTasksOrdered(items);
  };

  const onChange = (e: any) => {
    setSummary(e.target.value);
  };

  const dispatch = useDispatch();

  const handleSaveTask = async (e: any) => {
    if (isLoading) {
      return;
    }
    if (e.keyCode === 13 || e.which === 13) {
      setIsLoading(true);
      try {
        const externalID = v4();
        const iCalString: string = new ICalHelper({
          summary,
          externalID,
        }).parseTo();

        const response = await CalDavTaskApi.create({
          iCalString,
          calendarID,
          externalID,
        });

        const newSettings: any = { ...settings };
        // @ts-ignore
        newSettings.order = [response.data.data.id, ...settings?.order];
        dispatch(updateCalDavTaskSettings(newSettings));

        setSummary('');
        // toast(createToast(response?.data?.message));
        setIsLoading(false);
      } catch (e: any) {
        setIsLoading(false);
        toast(createToast(e.response?.data?.message, TOAST_STATUS.ERROR));
      }
    }
  };

  const handleCheck = async (item: CalDavTask) => {
    try {
      const externalID = item.externalID;
      const iCalString: string = new ICalHelper({
        ...item,
        status: item.status === 'COMPLETED' ? 'NEEDS-ACTION' : 'COMPLETED',
        externalID,
      }).parseTo();

      const response = await CalDavTaskApi.update({
        iCalString,
        calendarID,
        externalID,
        id: item.id,
        etag: item.etag,
        url: item.href,
        prevEvent: null,
      });

      // toast(createToast(response?.data?.message));
      setIsLoading(false);
    } catch (e: any) {
      setIsLoading(false);
      toast(createToast(e.response?.data?.message, TOAST_STATUS.ERROR));
    }
  };

  const handleRefresh = async () => {
    await CalDavTaskApi.sync();
  };

  return (
    <div
      className={'BoardColumn__container'}
      style={{ padding: isMobile ? 0 : PADDING_BOARD }}
    >
      <div
        style={{
          height: isMobile ? 55 : BOARD_HEADER_HEIGHT,
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          padding: isMobile ? PADDING_BOARD : 0,
          paddingLeft: isMobile ? 60 : 2,
          borderBottom: isMobile ? 'solid 0.4px lightgray' : '',
        }}
      >
        <Flex direction={'row'}>
          <Heading
            size={isMobile ? 'xl' : 'lg'}
            // paddingLeft={isMobile ? 6 : 2}
          >
            {title}
          </Heading>
          {isMobile ? (
            <>
              <Spacer />
              <IconButton
                _focus={{ boxShadow: 'none' }}
                variant={'ghost'}
                aria-label="Refresh"
                background={'transparent'}
                icon={<RefreshIcon className={'HeaderIcon'} />}
                isRound
                autoFocus={false}
                onClick={handleRefresh}
              />
            </>
          ) : null}
        </Flex>
        {!isMobile ? (
          <>
            <Separator height={12} />
            <InputGroup>
              <Input
                size={'lg'}
                name={'summary'}
                value={summary}
                onChange={onChange}
                autoComplete={'off'}
                placeholder={'Add task'}
                onKeyPress={handleSaveTask}
                background={'white'}
                focusBorderColor={'pink.400'}
                maxWidth={300}
              />
              {isLoading ? (
                <InputRightElement width="4.5rem">
                  <Spinner size="md" color={'pink.400'} />
                </InputRightElement>
              ) : null}
            </InputGroup>
            <Separator height={20} />
          </>
        ) : null}
      </div>
      <div
        className={'BoardColumn__scrollview'}
        style={{
          padding: isMobile ? PADDING_BOARD : 0,
          maxHeight: !isMobile
            ? window.innerHeight -
              BOARD_HEADER_HEIGHT -
              HEADER_HEIGHT -
              PADDING_BOARD * 2 -
              PADDING_APP * 2
            : window.innerHeight - 125,
          paddingRight: 10,
        }}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {tasksOrdered.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <TaskItem item={item} handleCheck={handleCheck} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default BoardColumn;
