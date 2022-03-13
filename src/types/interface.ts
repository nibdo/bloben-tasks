import { CalDavTask } from '../bloben-interface/calDavTask/calDavTask';
import { CalDavTaskSettings } from '../bloben-interface/calDavTaskSettings/CalDavTaskLabel';

export interface CalDavAccount {
  id: string;
  username: string;
  password: string;
  url: string;
  principalUrl: string;
}

export interface CalDavCalendar {
  calDavAccountID: string;
  color: string;
  displayName: string;
  id: string;
  timezone: string;
  url: string;
  components: string[];
  // [key: string]: any;
}

export interface ReduxState {
  calDavAccounts: CalDavAccount[];
  calDavCalendars: CalDavCalendar[];
  calDavTasks: CalDavTask[];
  calDavTaskSettings: CalDavTaskSettings[];
}

export interface CalDavEvent {
  id: string;
  calendarID?: string;
  startAt: string;
  endAt: string;
  timezone: string | null;
  isRepeated: boolean;
  rRule: string | null;
  summary: string | null;
  etag: string;
  location: string | null;
  description: string | null;
  color: string;
  alarms?: any;
  recurenceID?: string;
  internalID?: string;
  url: string;
  calendarUrl: string;
}
