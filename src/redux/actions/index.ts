import { CalDavAccount, CalDavCalendar } from '../../types/interface';
import { CalDavTask } from '../../bloben-interface/calDavTask/calDavTask';
import { CalDavTaskSettings } from '../../bloben-interface/calDavTaskSettings/CalDavTaskLabel';

export const setCaldavAccounts = (data: CalDavAccount[]) => {
  return {
    type: 'SET_CALDAV_ACCOUNTS',
    payload: data,
  };
};

export const addToCaldavAccounts = (data: CalDavAccount) => {
  return {
    type: 'ADD_TO_CALDAV_ACCOUNTS',
    payload: data,
  };
};
export const deleteCaldavAccount = (data: CalDavAccount) => {
  return {
    type: 'DELETE_CALDAV_ACCOUNT',
    payload: data,
  };
};

export const setCaldavCalendars = (data: CalDavCalendar[]) => {
  return {
    type: 'SET_CALDAV_CALENDARS',
    payload: data,
  };
};
export const addToCaldavCalendars = (data: CalDavCalendar[]) => {
  return {
    type: 'ADD_TO_CALDAV_CALENDARS',
    payload: data,
  };
};
export const updateCaldavCalendar = (data: CalDavCalendar) => {
  return {
    type: 'UPDATE_CALDAV_CALENDAR',
    payload: data,
  };
};
export const deleteCaldavCalendar = (data: CalDavCalendar) => {
  return {
    type: 'DELETE_CALDAV_CALENDAR',
    payload: data,
  };
};

export const setSettings = (data: any) => {
  return {
    type: 'SET_SETTINGS',
    payload: data,
  };
};
export const updateSettings = (key: string, value: any) => {
  return {
    type: 'UPDATE_SETTINGS',
    payload: { key, value },
  };
};

export const replace = (data: any) => {
  return {
    type: 'REPLACE',
    payload: data,
  };
};

export const setCalDavTasks = (data: CalDavTask[]) => {
  return {
    type: 'SET_CALDAV_TASKS',
    payload: data,
  };
};

export const addCalDavTask = (data: CalDavTask) => {
  return {
    type: 'ADD_CALDAV_TASK',
    payload: data,
  };
};

export const updateCalDavTask = (data: CalDavTask) => {
  return {
    type: 'UPDATE_CALDAV_TASK',
    payload: data,
  };
};

export const setCalDavTaskSettings = (data: CalDavTaskSettings[]) => {
  return {
    type: 'SET_CALDAV_TASK_SETTINGS',
    payload: data,
  };
};
export const updateCalDavTaskSettings = (data: CalDavTaskSettings) => {
  return {
    type: 'UPDATE_CALDAV_TASK_SETTINGS',
    payload: data,
  };
};
