import { AxiosResponse } from 'axios';
import {
  CalDavTaskSettings,
  UpdateCalDavTaskSettingsRequest,
} from '../bloben-interface/calDavTaskSettings/CalDavTaskLabel';
import { CommonResponse } from '../bloben-interface/interface';

import Axios from 'lib/Axios';

export default {
  get: async (): Promise<AxiosResponse<CalDavTaskSettings[]>> => {
    return Axios.get(`/v1/caldav-task/settings`);
  },
  update: async (
    calendarID: string,
    data: UpdateCalDavTaskSettingsRequest
  ): Promise<AxiosResponse<CommonResponse>> => {
    return Axios.put(`/v1/caldav-task/settings/${calendarID}`, data);
  },
};
