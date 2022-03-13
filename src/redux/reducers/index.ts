import { Reducer, combineReducers } from 'redux';

import { ReduxState } from '../../types/interface';
import calDavAccounts from 'redux/reducers/calDavAccounts';
import calDavCalendars from './calDavCalendars';
import calDavTaskSettings from './calDavTaskSettings';
import calDavTasks from './calDavTasks';

export const initialReduxState: ReduxState = {
  calDavAccounts: [],
  calDavCalendars: [],
  calDavTasks: [],
  calDavTaskSettings: [],
};

export const allReducers: Reducer = combineReducers({
  calDavAccounts,
  calDavCalendars,
  calDavTasks,
  calDavTaskSettings,
});

const rootReducer = (state: ReduxState | undefined, action: any) => {
  if (action.type === 'REPLACE') {
    state = action.payload;
  }

  return allReducers(state, action);
};
export default rootReducer;
