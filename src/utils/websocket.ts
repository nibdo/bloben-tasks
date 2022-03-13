import {
  addToCaldavCalendars,
  deleteCaldavCalendar,
  setCalDavTaskSettings,
  setCalDavTasks,
  setCaldavCalendars,
  updateCaldavCalendar,
} from '../redux/actions';
import { reduxStore } from '../layers/ReduxProvider';
import CalDavCalendarApi from '../api/CalDavCalendarApi';
import CalDavTaskApi from '../api/CalDavTaskApi';
import CalDavTaskSettingsApi from '../api/CalDavTaskSettingsApi';

const handleCalendars = (msg: any) => {
  if (msg.action === 'DELETE') {
    reduxStore.dispatch(deleteCaldavCalendar({ id: msg.id } as any));
  }
  if (msg.action === 'UPDATE') {
    // handle insert/update
    reduxStore.dispatch(updateCaldavCalendar(msg.data));
  }
  if (msg.action === 'CREATE') {
    // handle insert/update
    reduxStore.dispatch(addToCaldavCalendars([msg.data]));
  }
};

const handleSyncCalDavTasks = async () => {
  const response = await CalDavTaskApi.getTasks();

  reduxStore.dispatch(setCalDavTasks(response.data));
};

const handleSyncCalDavTaskSettings = async () => {
  const response = await CalDavTaskSettingsApi.get();

  reduxStore.dispatch(setCalDavTaskSettings(response.data));
};

const handleSyncCalDavCalendars = async () => {
  const response = await CalDavCalendarApi.getCalDavCalendars();

  reduxStore.dispatch(setCaldavCalendars(response.data));
};

export const processSocketMsg = async (msg: any) => {
  const msgData: any = JSON.parse(msg);

  if (msgData.type === 'CALENDAR') {
    handleCalendars(msgData);
  }

  if (msgData.type === 'CALDAV_TASKS') {
    await handleSyncCalDavTasks();
  }
  if (msgData.type === 'CALDAV_TASK_SETTINGS') {
    await handleSyncCalDavTaskSettings();
  }

  if (msgData.type === 'CALDAV_CALENDARS') {
    await handleSyncCalDavCalendars();
  }
};
