import { CalDavTaskSettings } from '../../bloben-interface/calDavTaskSettings/CalDavTaskLabel';

const calDavTaskSettings = (state: CalDavTaskSettings[] = [], action: any) => {
  switch (action.type) {
    case 'SET_CALDAV_TASK_SETTINGS':
      return action.payload;
    case 'UPDATE_CALDAV_TASK_SETTINGS':
      return state.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    default:
      return state;
  }
};

export default calDavTaskSettings;
