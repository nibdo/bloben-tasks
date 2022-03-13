import { CalDavCalendar, ReduxState } from '../../types/interface';
import { Context } from '../../context/store';
import { Flex } from '@chakra-ui/react';
import { HEADER_HEIGHT } from '../../types/constants';
import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Board from '../../components/board/Board';
import BottomSheetCalendars from '../../components/bottomSheetCalendars/BottomSheetCalendars';
import BottomSheetNewTask from '../../components/bottomSheetNewTask/BottomSheetNewTask';
import BottomSheetSettings from '../../components/bottomSheetSettings/BottomSheetSettings';
import Drawer from '../../components/drawer/Drawer';
import Header from '../../components/header/Header';
import MobileNavbar from '../../components/mobileNavbar/MobileNavbar';

const Main = () => {
  const [store] = useContext(Context);
  const { isMobile } = store;

  const [bottomSheetCalendarsOpen, setBottomSheetCalendarsOpen] =
    useState(false);
  const [bottomSheetSettingsOpen, setBottomSheetSettingsOpen] = useState(false);
  const [bottomSheetNewTaskOpen, setBottomSheetNewTaskOpen] = useState(false);

  const [selectedCalendar, selectCalendar] = useState<CalDavCalendar | null>(
    null
  );

  const calDavCalendars: CalDavCalendar[] = useSelector(
    (state: ReduxState) => state.calDavCalendars
  );

  const [, dispatchContext] = useContext(Context);
  const setContext = (type: string, payload: any) => {
    dispatchContext({ type, payload });
  };

  const handleSelectCalendar = (calendar: CalDavCalendar) => {
    setContext('selectedCalendar', calendar);
    selectCalendar(calendar);
  };

  useEffect(() => {
    if (calDavCalendars.length) {
      setContext('selectedCalendar', calDavCalendars[0]);
      selectCalendar(calDavCalendars[0]);
    }
  }, []);

  const openBottomSheetCalendars = () => {
    setBottomSheetCalendarsOpen(true);
  };
  const openBottomSheetSettings = () => {
    setBottomSheetSettingsOpen(true);
  };
  const openBottomSheetNewTask = () => {
    setBottomSheetNewTaskOpen(true);
  };

  return (
    <Flex direction={'column'} width={'100%'}>
      {!isMobile ? (
        <div style={{ minHeight: HEADER_HEIGHT }}>
          <Header />
        </div>
      ) : null}
      <Flex direction={'row'} width={'100%'} padding={!isMobile ? '8px' : 0}>
        {!isMobile ? <Drawer selectCalendar={handleSelectCalendar} /> : null}
        {selectedCalendar ? <Board calendar={selectedCalendar} /> : null}
      </Flex>
      {isMobile ? (
        <MobileNavbar
          openBottomSheetCalendars={openBottomSheetCalendars}
          openBottomSheetSettings={openBottomSheetSettings}
          openBottomSheetNewTask={openBottomSheetNewTask}
        />
      ) : null}

      {bottomSheetCalendarsOpen ? (
        <BottomSheetCalendars
          isBottomSheetOpen={bottomSheetCalendarsOpen}
          onClose={() => setBottomSheetCalendarsOpen(false)}
          selectCalendar={selectCalendar}
        />
      ) : null}
      {bottomSheetSettingsOpen ? (
        <BottomSheetSettings
          isBottomSheetOpen={bottomSheetSettingsOpen}
          onClose={() => setBottomSheetSettingsOpen(false)}
        />
      ) : null}
      {bottomSheetNewTaskOpen ? (
        <BottomSheetNewTask
          isBottomSheetOpen={bottomSheetNewTaskOpen}
          onClose={() => setBottomSheetNewTaskOpen(false)}
        />
      ) : null}
    </Flex>
  );
};

export default Main;
