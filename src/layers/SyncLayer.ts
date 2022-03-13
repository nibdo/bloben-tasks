import {
  setCalDavTaskSettings,
  setCalDavTasks,
  setCaldavAccounts,
  setCaldavCalendars,
} from '../redux/actions';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import CalDavAccountApi from '../api/CalDavAccountApi';
import CalDavCalendarApi from '../api/CalDavCalendarApi';
import CalDavTaskApi from '../api/CalDavTaskApi';
import CalDavTaskSettingsApi from '../api/CalDavTaskSettingsApi';

const SyncLayer = (props: any) => {
  const dispatch = useDispatch();

  const loadData = async () => {
    const calDavAccountsResponse = await CalDavAccountApi.getCalDavAccounts();
    const calDavCalendarsResponse =
      await CalDavCalendarApi.getCalDavCalendars();
    const calDavTasksResponse = await CalDavTaskApi.getTasks();
    const calDavTaskSettingsResponse = await CalDavTaskSettingsApi.get();

    dispatch(setCaldavAccounts(calDavAccountsResponse.data));
    dispatch(setCaldavCalendars(calDavCalendarsResponse.data));
    dispatch(setCalDavTasks(calDavTasksResponse.data));
    dispatch(setCalDavTaskSettings(calDavTaskSettingsResponse.data));

    await CalDavTaskApi.sync();
  };

  useEffect(() => {
    loadData();
  }, []);

  return props.children;
};
export default SyncLayer;
