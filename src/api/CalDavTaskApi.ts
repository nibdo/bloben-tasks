import { AxiosResponse } from 'axios';
import { CalDavTask } from '../bloben-interface/calDavTask/calDavTask';
import { CommonResponse } from '../bloben-interface/interface';
import {
  CreateCalDavEventRequest,
  DeleteCalDavEventRequest,
  UpdateCalDavEventRequest,
} from '../bloben-interface/event/event';
import Axios from 'lib/Axios';

export default {
  getTasks: async (): Promise<AxiosResponse<CalDavTask[]>> => {
    return Axios.get(`/v1/caldav-tasks`);
  },
  sync: async (): Promise<AxiosResponse<CommonResponse>> => {
    return Axios.get(`/v1/caldav-tasks/sync`);
  },
  create: async (
    data: CreateCalDavEventRequest
  ): Promise<AxiosResponse<CommonResponse>> => {
    return Axios.post('/v1/caldav-tasks', data);
  },
  update: async (
    data: UpdateCalDavEventRequest
  ): Promise<AxiosResponse<CommonResponse>> => {
    return Axios.put('/v1/caldav-tasks', data);
  },
  delete: async (
    data: DeleteCalDavEventRequest
  ): Promise<AxiosResponse<CommonResponse>> => {
    return Axios.delete(`/v1/caldav-tasks`, data);
  },
};
